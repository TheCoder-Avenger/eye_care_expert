"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "../../context/UserContext";
import PlaceholderImage from "@components/PlaceholderImage";
import "./style.scss";

const Cart = ({ isOpen, onClose }) => {
  const { user, isLoggedIn, updateUser } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  // Close modal when clicking outside
  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Close modal with Escape key
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && isLoggedIn && user?.email) {
      fetchCartItems();
    } else if (isOpen && !isLoggedIn) {
      setCartItems([]);
      setError(null);
    }
  }, [isOpen, isLoggedIn, user]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/users/cart?email=${encodeURIComponent(user.email)}`
      );
      const data = await response.json();

      if (data.success) {
        setCartItems(data.cart || []);
      } else {
        setError(data.message || "Failed to fetch cart items");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to load cart items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      setUpdatingItems((prev) => new Set(prev).add(cartItemId));
      setError(null);

      const response = await fetch(
        `/api/users/cart/${cartItemId}?email=${encodeURIComponent(user.email)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (data.success) {
        setCartItems(data.cart || []);
        // Update user context if cart count is available
        if (updateUser && data.cartCount !== undefined) {
          updateUser({ ...user, cartCount: data.cartCount });
        }
      } else {
        setError(data.message || "Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
      setError("Failed to remove item. Please try again.");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdatingItems((prev) => new Set(prev).add(cartItemId));
      setError(null);

      const response = await fetch(`/api/users/cart/${cartItemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          quantity: newQuantity,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCartItems(data.cart || []);
        // Update user context if cart count is available
        if (updateUser && data.cartCount !== undefined) {
          updateUser({ ...user, cartCount: data.cartCount });
        }
      } else {
        setError(data.message || "Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      setError("Failed to update quantity. Please try again.");
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product_id?.price || 0) * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={handleOverlayClick}>
      <div className="cart">
        <div className="cart__header">
          <h2 className="cart__title">
            Your Cart
            {isLoggedIn && cartItems.length > 0 && (
              <span className="cart__count">({getTotalItems()})</span>
            )}
          </h2>
          <button
            className="cart__close"
            onClick={onClose}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        <div className="cart__content">
          {error && (
            <div className="cart__error">
              <p>{error}</p>
              <button
                onClick={() => setError(null)}
                className="cart__error-close"
              >
                Dismiss
              </button>
            </div>
          )}

          {!isLoggedIn ? (
            <div className="cart__login-message">
              <div className="cart__login-icon">🛒</div>
              <h3>Sign in to view your cart</h3>
              <p>Save items in your cart by signing in to your account.</p>
            </div>
          ) : loading ? (
            <div className="cart__loading">
              <div className="cart__loading-spinner"></div>
              <p>Loading your cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="cart__empty">
              <div className="cart__empty-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Add some products to get started with your order.</p>
            </div>
          ) : (
            <>
              <div className="cart__items">
                {cartItems.map((item) => (
                  <div key={item._id} className="cart__item">
                    <div className="cart__item-image">
                      {item.product_id?.images?.[0] ? (
                        <PlaceholderImage
                          width={80}
                          height={60}
                          text=""
                          backgroundColor="f0f0f0"
                          textColor="666"
                        />
                      ) : (
                        <PlaceholderImage
                          width={80}
                          height={60}
                          text="No Image"
                          backgroundColor="f0f0f0"
                          textColor="666"
                        />
                      )}
                    </div>
                    <div className="cart__item-details">
                      <h4 className="cart__item-name">
                        {item.product_id?.name || "Product"}
                      </h4>
                      <p className="cart__item-specs">
                        Lens: {item.lens_type} | Option: {item.lens_option}
                      </p>
                      <div className="cart__item-price-info">
                        <p className="cart__item-price">
                          ₹{item.product_id?.price || 0} × {item.quantity}
                        </p>
                        <p className="cart__item-subtotal">
                          Subtotal: ₹
                          {(item.product_id?.price || 0) * item.quantity}
                        </p>
                      </div>
                      <div className="cart__item-quantity">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          disabled={
                            item.quantity <= 1 || updatingItems.has(item._id)
                          }
                          className="cart__quantity-btn"
                        >
                          −
                        </button>
                        <span className="cart__quantity-value">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          disabled={updatingItems.has(item._id)}
                          className="cart__quantity-btn"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="cart__item-remove"
                      onClick={() => removeFromCart(item._id)}
                      disabled={updatingItems.has(item._id)}
                      title="Remove item"
                    >
                      {updatingItems.has(item._id) ? "..." : "×"}
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart__footer">
                <div className="cart__summary">
                  <div className="cart__summary-line">
                    <span>Items ({getTotalItems()})</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                  <div className="cart__summary-line">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="cart__total">
                    <strong>Total: ₹{calculateTotal()}</strong>
                  </div>
                </div>
                <button className="cart__checkout-btn" disabled={loading}>
                  Proceed to Checkout
                </button>
                <button
                  className="cart__refresh"
                  onClick={fetchCartItems}
                  disabled={loading}
                >
                  🔄 Refresh Cart
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
