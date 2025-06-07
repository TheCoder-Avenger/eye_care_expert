"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "../../context/UserContext";
import PlaceholderImage from "@components/PlaceholderImage";
import Modal from "@components/Modal";
import "./style.scss";

const Wishlist = ({ isOpen, onClose }) => {
  const { user, isLoggedIn, updateUser } = useUser();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && isLoggedIn && user?.email) {
      fetchWishlistItems();
    } else if (isOpen && !isLoggedIn) {
      setWishlistItems([]);
      setError(null);
    }
  }, [isOpen, isLoggedIn, user]);

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/users/wishlist?email=${encodeURIComponent(user.email)}`
      );
      const data = await response.json();

      if (data.success) {
        setWishlistItems(data.wishlist || []);
      } else {
        setError(data.message || "Failed to fetch wishlist items");
      }
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
      setError("Failed to load wishlist items. Please try again.");
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
        setWishlistItems(data.wishlist || []);
        // Update user context if wishlist count is available
        if (updateUser && data.wishlistCount !== undefined) {
          updateUser({ ...user, wishlistCount: data.wishlistCount });
        }
      } else {
        setError(data.message || "Failed to remove item from wishlist");
      }
    } catch (error) {
      console.error("Error removing wishlist item:", error);
      setError("Failed to remove item. Please try again.");
    }
  };

  const addToCart = async (product) => {
    try {
      setError(null);
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
        // Update user context if cart count is available
        if (updateUser && data.cartCount !== undefined) {
          updateUser({ ...user, cartCount: data.cartCount });
        }

        // Show success message
        setError(null);
        alert("Product added to cart successfully!");
      } else {
        setError(data.message || "Failed to add product to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setError("Failed to add product to cart. Please try again.");
    }
  };

  const wishlistTitle = `Your Wishlist${
    isLoggedIn && wishlistItems.length > 0 ? ` (${wishlistItems.length})` : ""
  }`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={wishlistTitle}
      size="medium"
    >
      <div className="wishlist__content">
        {error && (
          <div className="wishlist__error">
            <p>{error}</p>
            <button
              onClick={() => setError(null)}
              className="wishlist__error-close"
            >
              Dismiss
            </button>
          </div>
        )}

        {!isLoggedIn ? (
          <div className="wishlist__login-message">
            <div className="wishlist__login-icon">💖</div>
            <h3>Sign in to view your wishlist</h3>
            <p>
              Save your favorite items for later by signing in to your account.
            </p>
          </div>
        ) : loading ? (
          <div className="wishlist__loading">
            <div className="wishlist__loading-spinner"></div>
            <p>Loading your wishlist...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="wishlist__empty">
            <div className="wishlist__empty-icon">💔</div>
            <h3>Your wishlist is empty</h3>
            <p>
              Browse our collection and add items you love to your wishlist.
            </p>
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
                  {item.description && (
                    <p className="wishlist__item-description">
                      {item.description.length > 100
                        ? `${item.description.substring(0, 100)}...`
                        : item.description}
                    </p>
                  )}
                  <div className="wishlist__item-actions">
                    <button
                      className="wishlist__add-to-cart"
                      onClick={() => addToCart(item)}
                      disabled={loading}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="wishlist__remove"
                      onClick={() => removeFromWishlist(item._id)}
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isLoggedIn && wishlistItems.length > 0 && (
          <div className="wishlist__footer">
            <button
              className="wishlist__refresh"
              onClick={fetchWishlistItems}
              disabled={loading}
            >
              🔄 Refresh
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default Wishlist;
