"use client";

import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import PlaceholderImage from "@components/PlaceholderImage";
import "./style.scss";

const WishlistPage = () => {
  const { user, isLoggedIn } = useUser();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user?.email) {
      fetchWishlistItems();
    }
  }, [isLoggedIn, user]);

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

  if (!isLoggedIn) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-page__container">
          <div className="wishlist-page__login-message">
            <h2>Please log in to view your wishlist</h2>
            <p>You need to be logged in to access your wishlist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-page__container">
        <div className="wishlist-page__header">
          <h1 className="wishlist-page__title">My Wishlist</h1>
          <p className="wishlist-page__subtitle">
            {wishlistItems.length}{" "}
            {wishlistItems.length === 1 ? "item" : "items"} in your wishlist
          </p>
        </div>

        {loading ? (
          <div className="wishlist-page__loading">
            <div className="wishlist-page__loading-spinner"></div>
            <p>Loading your wishlist...</p>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="wishlist-page__empty">
            <div className="wishlist-page__empty-icon">♡</div>
            <h2>Your wishlist is empty</h2>
            <p>Save items you love for later!</p>
            <a href="/products" className="wishlist-page__continue-shopping">
              Browse Products
            </a>
          </div>
        ) : (
          <div className="wishlist-page__grid">
            {wishlistItems.map((item) => (
              <div key={item._id} className="wishlist-page__item">
                <div className="wishlist-page__item-image">
                  {item.images?.[0] ? (
                    <PlaceholderImage
                      width={250}
                      height={200}
                      text=""
                      backgroundColor="f0f0f0"
                      textColor="666"
                    />
                  ) : (
                    <PlaceholderImage
                      width={250}
                      height={200}
                      text="No Image"
                      backgroundColor="f0f0f0"
                      textColor="666"
                    />
                  )}

                  <button
                    className="wishlist-page__item-remove"
                    onClick={() => removeFromWishlist(item._id)}
                    title="Remove from wishlist"
                  >
                    ×
                  </button>
                </div>

                <div className="wishlist-page__item-content">
                  <h3 className="wishlist-page__item-name">{item.name}</h3>

                  <p className="wishlist-page__item-price">₹{item.price}</p>

                  <p className="wishlist-page__item-description">
                    {item.description?.substring(0, 120)}...
                  </p>

                  <div className="wishlist-page__item-details">
                    <span className="wishlist-page__item-detail">
                      <strong>Color:</strong> {item.color}
                    </span>
                    <span className="wishlist-page__item-detail">
                      <strong>Material:</strong> {item.material}
                    </span>
                    <span className="wishlist-page__item-detail">
                      <strong>Shape:</strong> {item.shape}
                    </span>
                  </div>

                  <div className="wishlist-page__item-actions">
                    <button
                      className="wishlist-page__add-to-cart"
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>

                    <a
                      href={`/product/${item._id}`}
                      className="wishlist-page__view-product"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
