"use client";

import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import PlaceholderImage from "@components/PlaceholderImage";
import "./style.scss";

const Cart = ({ isOpen, onClose }) => {
  const { user, isLoggedIn } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && isLoggedIn && user?.email) {
      fetchCartItems();
    }
  }, [isOpen, isLoggedIn, user]);

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

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product_id?.price || 0) * item.quantity;
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay">
      <div className="cart">
        <div className="cart__header">
          <h2 className="cart__title">Your Cart</h2>
          <button className="cart__close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="cart__content">
          {!isLoggedIn ? (
            <div className="cart__login-message">
              <p>Please log in to view your cart</p>
            </div>
          ) : loading ? (
            <div className="cart__loading">
              <div className="cart__loading-spinner"></div>
              <p>Loading cart items...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="cart__empty">
              <p>Your cart is empty</p>
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
                      <p className="cart__item-price">
                        ₹{item.product_id?.price || 0} × {item.quantity}
                      </p>
                    </div>
                    <button
                      className="cart__item-remove"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart__footer">
                <div className="cart__total">
                  <strong>Total: ₹{calculateTotal()}</strong>
                </div>
                <button className="cart__checkout-btn">
                  Proceed to Checkout
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
