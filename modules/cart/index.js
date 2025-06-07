"use client";

import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import PlaceholderImage from "@components/PlaceholderImage";
import "./style.scss";

const CartPage = () => {
  const { user, isLoggedIn } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user?.email) {
      fetchCartItems();
    }
  }, [isLoggedIn, user]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/users/cart?email=${encodeURIComponent(user.email)}`
      );
      const data = await response.json();

      if (data.success) {
        setCartItems(data.cart);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      const response = await fetch(
        `/api/users/cart/${cartItemId}?email=${encodeURIComponent(user.email)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (data.success) {
        setCartItems(data.cart);
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map((item) =>
      item._id === cartItemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product_id?.price || 0) * item.quantity;
    }, 0);
  };

  const calculateSubtotal = (item) => {
    return (item.product_id?.price || 0) * item.quantity;
  };

  if (!isLoggedIn) {
    return (
      <div className="cart-page">
        <div className="cart-page__container">
          <div className="cart-page__login-message">
            <h2>Please log in to view your cart</h2>
            <p>You need to be logged in to access your shopping cart.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page__container">
        <div className="cart-page__header">
          <h1 className="cart-page__title">Shopping Cart</h1>
          <p className="cart-page__subtitle">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        {loading ? (
          <div className="cart-page__loading">
            <div className="cart-page__loading-spinner"></div>
            <p>Loading your cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="cart-page__empty">
            <div className="cart-page__empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <a href="/products" className="cart-page__continue-shopping">
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="cart-page__content">
            <div className="cart-page__items">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-page__item">
                  <div className="cart-page__item-image">
                    {item.product_id?.images?.[0] ? (
                      <PlaceholderImage
                        width={120}
                        height={90}
                        text=""
                        backgroundColor="f0f0f0"
                        textColor="666"
                      />
                    ) : (
                      <PlaceholderImage
                        width={120}
                        height={90}
                        text="No Image"
                        backgroundColor="f0f0f0"
                        textColor="666"
                      />
                    )}
                  </div>

                  <div className="cart-page__item-details">
                    <h3 className="cart-page__item-name">
                      {item.product_id?.name || "Product"}
                    </h3>
                    <p className="cart-page__item-specs">
                      Lens Type: {item.lens_type} | Option: {item.lens_option}
                    </p>
                    <p className="cart-page__item-price">
                      ₹{item.product_id?.price || 0} each
                    </p>
                  </div>

                  <div className="cart-page__item-quantity">
                    <label>Quantity:</label>
                    <div className="cart-page__quantity-controls">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-page__item-subtotal">
                    <strong>₹{calculateSubtotal(item)}</strong>
                  </div>

                  <button
                    className="cart-page__item-remove"
                    onClick={() => removeFromCart(item._id)}
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-page__summary">
              <div className="cart-page__summary-content">
                <h3>Order Summary</h3>

                <div className="cart-page__summary-line">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{calculateTotal()}</span>
                </div>

                <div className="cart-page__summary-line">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <div className="cart-page__summary-line cart-page__summary-total">
                  <strong>Total: ₹{calculateTotal()}</strong>
                </div>

                <button className="cart-page__checkout-btn">
                  Proceed to Checkout
                </button>

                <a href="/products" className="cart-page__continue-shopping">
                  Continue Shopping
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
