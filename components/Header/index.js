"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "./style.scss";
import Modal from "@components/Modal";
import Register from "@components/Register";
import Login from "@components/Login";
import { useUser } from "@/context/UserContext";
import Cart from "@components/Cart";
import Wishlist from "@components/Wishlist";
import MobileDrawer from "@components/MobileDrawer";

const Header = () => {
  const { user, isLoggedIn, isLoading, logout, cart, wishlist } = useUser();

  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const [selectedCategory, setSelectedCategory] = useState("Eyeglass");

  // Cart and wishlist counts are now managed by UserContext
  const cartCount = cart?.length || 0;
  const wishlistCount = wishlist?.length || 0;

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "mr", name: "Marathi" },
  ];

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language.name);
    setShowLanguageDropdown(false);
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategory(category);
  };

  const handleLogout = () => {
    logout();
    setShowUserModal(false);
    setShowCartModal(false);
    setShowWishlistModal(false);
    setShowMobileDrawer(false);
  };

  const handleLoginSuccess = (userData) => {
    console.log("User logged in:", userData);
  };

  // Cart and wishlist counts are now managed by UserContext

  return (
    <>
      <header className="header">
        <div className="header__container">
          <div className="header__logo-section">
            <Link href="/" className="header__logo-link">
              <div className="header__logo">
                <div className="header__logo-image">
                  <Image
                    src="/eye-care-expert-logo.png"
                    alt="Eye Care Expert Logo"
                    width={60}
                    height={60}
                    className="header__logo-img"
                    priority
                  />
                </div>
                <div className="header__logo-text">
                  <h1>EyeCare Expert</h1>
                  <p className="header__logo-tagline">
                    Your Vision, Our Precision
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Mobile Category Toggle - Only visible on mobile */}
          <div className="header__mobile-category">
            <div className="header__mobile-category-toggle">
              <button
                className={`header__mobile-toggle ${
                  selectedCategory === "Eyeglass" ? "active" : ""
                }`}
                onClick={() => handleCategoryToggle("Eyeglass")}
              >
                <span className="header__mobile-toggle-icon">👓</span>
                <span className="header__mobile-toggle-text">Eyeglasses</span>
              </button>
              <button
                className={`header__mobile-toggle ${
                  selectedCategory === "Sunglass" ? "active" : ""
                }`}
                onClick={() => handleCategoryToggle("Sunglass")}
              >
                <span className="header__mobile-toggle-icon">🕶️</span>
                <span className="header__mobile-toggle-text">Sunglasses</span>
              </button>
            </div>
          </div>

          {/* Mobile hamburger menu button */}
          <button
            className="header__mobile-menu-btn"
            onClick={() => setShowMobileDrawer(true)}
          >
            <span className="header__hamburger-line"></span>
            <span className="header__hamburger-line"></span>
            <span className="header__hamburger-line"></span>
          </button>

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

          <div className="header__controls">
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

            <div className="header__auth-section">
              {isLoading ? (
                <div className="header__loading">Loading...</div>
              ) : isLoggedIn && user ? (
                <div className="header__user-profile">
                  <button
                    className="header__profile-btn"
                    onClick={() => setShowUserModal(true)}
                  >
                    <span className="header__avatar">👤</span>
                    <span className="header__user-name">
                      {user.first_name} {user.last_name}
                    </span>
                    <span className="header__dropdown-arrow">▼</span>
                  </button>
                </div>
              ) : (
                <div className="header__auth-buttons">
                  <button
                    className="header__login-btn"
                    onClick={() => setShowLoginModal(true)}
                  >
                    Login
                  </button>
                  <button
                    className="header__signup-btn"
                    onClick={() => setShowRegisterModal(true)}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <Modal
        isOpen={showUserModal && isLoggedIn}
        onClose={() => setShowUserModal(false)}
        title="User Profile"
        size="small"
      >
        <div className="modal__user-info">
          <div className="modal__user-info-avatar">👤</div>
          <h4>
            {user?.first_name} {user?.last_name}
          </h4>
          <p>{user?.email}</p>
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
      <Register
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />

      <Login
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <Cart isOpen={showCartModal} onClose={() => setShowCartModal(false)} />
      <Wishlist
        isOpen={showWishlistModal}
        onClose={() => setShowWishlistModal(false)}
      />

      <MobileDrawer
        isOpen={showMobileDrawer}
        onClose={() => setShowMobileDrawer(false)}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryToggle}
        selectedLanguage={selectedLanguage}
        languages={languages}
        onLanguageChange={handleLanguageChange}
        isLoggedIn={isLoggedIn}
        user={user}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onWishlistClick={() => setShowWishlistModal(true)}
        onCartClick={() => setShowCartModal(true)}
        onLoginClick={() => setShowLoginModal(true)}
        onRegisterClick={() => setShowRegisterModal(true)}
        onUserProfileClick={() => setShowUserModal(true)}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Header;
