"use client";

import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import PlaceholderImage from "@components/PlaceholderImage";
import "./style.scss";

const Wishlist = ({ isOpen, onClose }) => {
  const { user, isLoggedIn } = useUser();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && isLoggedIn && user?.email) {
      fetchWishlistItems();
    }
  }, [isOpen, isLoggedIn, user]);

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/users/wishlist?email=${encodeURIComponent(user.email)}`
      );
      const data = await response.json();

      if (data.success) {
        setWishlistItems(data.wishlist);
      }
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(
        `/api/users/wishlist/${productId}?email=${encodeURIComponent(
          user.email
        )}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      if (data.success) {
        setWishlistItems(data.wishlist);
      }
    } catch (error) {
      console.error("Error removing wishlist item:", error);
    }
  };

  const addToCart = async (product) => {
    try {
      const cartData = {
        email: user.email,
        product_id: product._id,
        lens_type: "single-vision",
        lens_option: "basic",
        quantity: 1,
      };

      const response = await fetch("/api/users/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartData),
      });

      const data = await response.json();
      if (data.success) {
        alert("Product added to cart successfully!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="wishlist-overlay">
      <div className="wishlist">
        <div className="wishlist__header">
          <h2 className="wishlist__title">Your Wishlist</h2>
          <button className="wishlist__close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="wishlist__content">
          {!isLoggedIn ? (
            <div className="wishlist__login-message">
              <p>Please log in to view your wishlist</p>
            </div>
          ) : loading ? (
            <div className="wishlist__loading">
              <div className="wishlist__loading-spinner"></div>
              <p>Loading wishlist items...</p>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="wishlist__empty">
              <p>Your wishlist is empty</p>
            </div>
          ) : (
            <div className="wishlist__items">
              {wishlistItems.map((item) => (
                <div key={item._id} className="wishlist__item">
                  <div className="wishlist__item-image">
                    {item.images?.[0] ? (
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
                  <div className="wishlist__item-details">
                    <h4 className="wishlist__item-name">{item.name}</h4>
                    <p className="wishlist__item-price">₹{item.price}</p>
                    <p className="wishlist__item-description">
                      {item.description?.substring(0, 100)}...
                    </p>
                    <div className="wishlist__item-actions">
                      <button
                        className="wishlist__add-to-cart"
                        onClick={() => addToCart(item)}
                      >
                        Add to Cart
                      </button>
                      <button
                        className="wishlist__remove"
                        onClick={() => removeFromWishlist(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
