"use client";

import { useState } from "react";
import "./style.scss";
import Modal from "@components/Modal";

const Header = () => {
  // Modal state management
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // Dropdown state
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // User authentication state (placeholder)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("John Doe");

  // Selected language state
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  // Product category toggle
  const [selectedCategory, setSelectedCategory] = useState("Eyeglass");

  // Cart and wishlist counters
  const [cartCount, setCartCount] = useState(3);
  const [wishlistCount, setWishlistCount] = useState(5);

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "mr", name: "Marathi" },
  ];

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language.name);
    setShowLanguageDropdown(false);
    // Add translation logic here
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategory(category);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowUserModal(false);
  };

  return (
    <>
      <header className="header">
        <div className="header__container">
          {/* Logo and Tagline Section */}
          <div className="header__logo-section">
            <div className="header__logo">
              <span className="header__logo-icon">👁️</span>
              <div className="header__logo-text">
                <h1>EyeCare Expert</h1>
                <p className="header__logo-tagline">Your Vision, Our Mission</p>
              </div>
            </div>
          </div>

          {/* Product Category Toggle */}
          <div className="header__category-toggle">
            <div className="header__toggle-container">
              <button
                className={`header__toggle-btn ${
                  selectedCategory === "Eyeglass"
                    ? "header__toggle-btn--active"
                    : ""
                }`}
                onClick={() => handleCategoryToggle("Eyeglass")}
              >
                👓 Eyeglasses
              </button>
              <button
                className={`header__toggle-btn ${
                  selectedCategory === "Sunglass"
                    ? "header__toggle-btn--active"
                    : ""
                }`}
                onClick={() => handleCategoryToggle("Sunglass")}
              >
                🕶️ Sunglasses
              </button>
            </div>
          </div>

          {/* Right Section - Controls */}
          <div className="header__controls">
            {/* Language Dropdown */}
            <div className="header__language-dropdown">
              <button
                className="header__dropdown-trigger"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              >
                🌐 {selectedLanguage} ▼
              </button>
              {showLanguageDropdown && (
                <div className="header__dropdown-menu">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`header__dropdown-item ${
                        selectedLanguage === lang.name
                          ? "header__dropdown-item--active"
                          : ""
                      }`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              className="header__icon-btn header__wishlist-btn"
              onClick={() => setShowWishlistModal(true)}
            >
              <span className="header__icon-btn-icon">♥️</span>
              <span className="header__icon-btn-label">Wishlist</span>
              {wishlistCount > 0 && (
                <span className="header__icon-btn-badge">{wishlistCount}</span>
              )}
            </button>

            {/* Cart Button */}
            <button
              className="header__icon-btn header__cart-btn"
              onClick={() => setShowCartModal(true)}
            >
              <span className="header__icon-btn-icon">🛒</span>
              <span className="header__icon-btn-label">Cart</span>
              {cartCount > 0 && (
                <span className="header__icon-btn-badge">{cartCount}</span>
              )}
            </button>

            {/* Authentication Section */}
            <div className="header__auth-section">
              {isLoggedIn ? (
                <div className="header__user-profile">
                  <button
                    className="header__profile-btn"
                    onClick={() => setShowUserModal(true)}
                  >
                    <span className="header__avatar">👤</span>
                    <span className="header__user-name">{userName}</span>
                    <span className="header__dropdown-arrow">▼</span>
                  </button>
                </div>
              ) : (
                <div className="header__auth-buttons">
                  <button className="header__login-btn">Login</button>
                  <button className="header__signup-btn">Sign Up</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Wishlist Modal */}
      <Modal
        isOpen={showWishlistModal}
        onClose={() => setShowWishlistModal(false)}
        title="Your Wishlist"
        size="medium"
      >
        <p>You have {wishlistCount} items in your wishlist.</p>
        <div className="modal__items">
          <div className="modal__item">
            <span>👓 Classic Frame - $99</span>
            <button className="modal__item-remove-btn">Remove</button>
          </div>
          <div className="modal__item">
            <span>🕶️ Aviator Sunglasses - $149</span>
            <button className="modal__item-remove-btn">Remove</button>
          </div>
          <div className="modal__item">
            <span>👓 Blue Light Glasses - $79</span>
            <button className="modal__item-remove-btn">Remove</button>
          </div>
        </div>
      </Modal>

      {/* Cart Modal */}
      <Modal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        title="Shopping Cart"
        size="medium"
      >
        <p>You have {cartCount} items in your cart.</p>
        <div className="modal__items">
          <div className="modal__item">
            <span>👓 Reading Glasses - $89 (x2)</span>
            <button className="modal__item-remove-btn">Remove</button>
          </div>
          <div className="modal__item">
            <span>🕶️ Sports Sunglasses - $199</span>
            <button className="modal__item-remove-btn">Remove</button>
          </div>
        </div>
        <div className="modal__cart-total">
          <strong>Total: $377</strong>
        </div>
        <button className="modal__checkout-btn">Proceed to Checkout</button>
      </Modal>

      {/* User Profile Modal */}
      <Modal
        isOpen={showUserModal && isLoggedIn}
        onClose={() => setShowUserModal(false)}
        title="User Profile"
        size="small"
      >
        <div className="modal__user-info">
          <div className="modal__user-info-avatar">👤</div>
          <h4>{userName}</h4>
          <p>john.doe@example.com</p>
        </div>
        <div className="modal__user-actions">
          <button className="modal__action-btn">My Orders</button>
          <button className="modal__action-btn">Profile Settings</button>
          <button className="modal__action-btn">Prescription History</button>
          <button
            className="modal__action-btn modal__action-btn--logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Header;
