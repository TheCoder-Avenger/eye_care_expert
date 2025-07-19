"use client";

import { useState } from "react";
import "./style.scss";

const MobileDrawer = ({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
  selectedLanguage,
  languages,
  onLanguageChange,
  isLoggedIn,
  user,
  cartCount,
  wishlistCount,
  onWishlistClick,
  onCartClick,
  onLoginClick,
  onRegisterClick,
  onUserProfileClick,
  onLogout,
}) => {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLanguageSelect = (language) => {
    onLanguageChange(language);
    setShowLanguageDropdown(false);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="mobile-drawer__overlay" onClick={handleOverlayClick} />
      )}

      {/* Drawer */}
      <div className={`mobile-drawer ${isOpen ? "mobile-drawer--open" : ""}`}>
        <div className="mobile-drawer__header">
          <h3 className="mobile-drawer__title">Menu</h3>
          <button className="mobile-drawer__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="mobile-drawer__content">
          {/* Category Toggle */}
          <div className="mobile-drawer__section">
            <h4 className="mobile-drawer__section-title">Categories</h4>
            <div className="mobile-drawer__category-toggle">
              <button
                className={`mobile-drawer__category-btn ${
                  selectedCategory === "Eyeglass" ? "active" : ""
                }`}
                onClick={() => onCategoryChange("Eyeglass")}
              >
                👓 Eyeglasses
              </button>
              <button
                className={`mobile-drawer__category-btn ${
                  selectedCategory === "Sunglass" ? "active" : ""
                }`}
                onClick={() => onCategoryChange("Sunglass")}
              >
                🕶️ Sunglasses
              </button>
            </div>
          </div>

          {/* Language Selection */}
          <div className="mobile-drawer__section">
            <h4 className="mobile-drawer__section-title">Language</h4>
            <div className="mobile-drawer__language">
              <button
                className="mobile-drawer__language-trigger"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              >
                🌐 {selectedLanguage} {showLanguageDropdown ? "▲" : "▼"}
              </button>
              {showLanguageDropdown && (
                <div className="mobile-drawer__language-options">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`mobile-drawer__language-option ${
                        selectedLanguage === lang.name ? "active" : ""
                      }`}
                      onClick={() => handleLanguageSelect(lang)}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mobile-drawer__section">
            <h4 className="mobile-drawer__section-title">Quick Access</h4>
            <div className="mobile-drawer__actions">
              <button
                className="mobile-drawer__action-btn"
                onClick={() => {
                  onWishlistClick();
                  onClose();
                }}
              >
                <span className="mobile-drawer__action-icon">♥️</span>
                <span className="mobile-drawer__action-label">Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="mobile-drawer__action-badge">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                className="mobile-drawer__action-btn"
                onClick={() => {
                  onCartClick();
                  onClose();
                }}
              >
                <span className="mobile-drawer__action-icon">🛒</span>
                <span className="mobile-drawer__action-label">Cart</span>
                {cartCount > 0 && (
                  <span className="mobile-drawer__action-badge">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Authentication Section */}
          <div className="mobile-drawer__section">
            <h4 className="mobile-drawer__section-title">Account</h4>
            {isLoggedIn && user ? (
              <div className="mobile-drawer__user-section">
                <div className="mobile-drawer__user-info">
                  <span className="mobile-drawer__user-avatar">👤</span>
                  <div className="mobile-drawer__user-details">
                    <div className="mobile-drawer__user-name">
                      {user.first_name} {user.last_name}
                    </div>
                    <div className="mobile-drawer__user-email">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="mobile-drawer__user-actions">
                  <button
                    className="mobile-drawer__user-action"
                    onClick={() => {
                      onUserProfileClick();
                      onClose();
                    }}
                  >
                    My Profile
                  </button>
                  <button
                    className="mobile-drawer__user-action"
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="mobile-drawer__auth-buttons">
                <button
                  className="mobile-drawer__auth-btn mobile-drawer__auth-btn--login"
                  onClick={() => {
                    onLoginClick();
                    onClose();
                  }}
                >
                  Login
                </button>
                <button
                  className="mobile-drawer__auth-btn mobile-drawer__auth-btn--register"
                  onClick={() => {
                    onRegisterClick();
                    onClose();
                  }}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
