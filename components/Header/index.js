"use client";

import { useState, useEffect } from "react";
import "./style.scss";
import Modal from "@components/Modal";
import Register from "@components/Register";
import Login from "@components/Login";
import { useUser } from "@/context/UserContext";
import Cart from "@components/Cart";
import Wishlist from "@components/Wishlist";

const Header = () => {
  const { user, isLoggedIn, isLoading, logout } = useUser();

  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const [selectedCategory, setSelectedCategory] = useState("Eyeglass");

  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

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
  };

  const handleLoginSuccess = (userData) => {
    console.log("User logged in:", userData);
  };

  const fetchCartCount = async () => {
    if (!isLoggedIn || !user?.email) return;

    try {
      const response = await fetch(
        `/api/users/cart?email=${encodeURIComponent(user.email)}`
      );
      const data = await response.json();

      if (data.success) {
        setCartCount(data.cart.length);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const fetchWishlistCount = async () => {
    if (!isLoggedIn || !user?.email) return;

    try {
      const response = await fetch(
        `/api/users/wishlist?email=${encodeURIComponent(user.email)}`
      );
      const data = await response.json();

      if (data.success) {
        setWishlistCount(data.wishlist.length);
      }
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user?.email) {
      fetchCartCount();
      fetchWishlistCount();
    } else {
      setCartCount(0);
      setWishlistCount(0);
    }
  }, [isLoggedIn, user]);

  return (
    <>
      <header className="header">
        <div className="header__container">
          <div className="header__logo-section">
            <div className="header__logo">
              <span className="header__logo-icon">👁️</span>
              <div className="header__logo-text">
                <h1>EyeCare Expert</h1>
                <p className="header__logo-tagline">Your Vision, Our Mission</p>
              </div>
            </div>
          </div>

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
    </>
  );
};

export default Header;
