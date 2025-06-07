"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const checkExistingUser = async () => {
      try {
        const storedEmail = localStorage.getItem("user_email");

        if (storedEmail) {
          const response = await fetch("/api/users/check-email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: storedEmail }),
          });

          if (response.ok) {
            const result = await response.json();
            setUser(result.user);
            setIsLoggedIn(true);
            await fetchUserCartAndWishlist(result.user.email);
          } else {
            localStorage.removeItem("user_email");
            loadLocalStorageCart();
          }
        } else {
          loadLocalStorageCart();
        }
      } catch (error) {
        console.error("Error checking existing user:", error);
        localStorage.removeItem("user_email");
        loadLocalStorageCart();
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingUser();
  }, []);

  const loadLocalStorageCart = () => {
    try {
      const storedCart = localStorage.getItem("guest_cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  };

  const fetchUserCartAndWishlist = async (email) => {
    try {
      const [cartResponse, wishlistResponse] = await Promise.all([
        fetch(`/api/users/cart?email=${encodeURIComponent(email)}`),
        fetch(`/api/users/wishlist?email=${encodeURIComponent(email)}`),
      ]);

      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        if (cartData.success) {
          setCart(cartData.cart || []);
        }
      }

      if (wishlistResponse.ok) {
        const wishlistData = await wishlistResponse.json();
        if (wishlistData.success) {
          setWishlist(wishlistData.wishlist || []);
        }
      }
    } catch (error) {
      console.error("Error fetching user cart and wishlist:", error);
    }
  };

  const addToCart = async (product, options = {}) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: options.quantity || 1,
      lensType: options.lensType,
      frameColor: options.frameColor,
      powerOption: options.powerOption,
      prescription: options.prescription,
      addedAt: new Date().toISOString(),
    };

    if (isLoggedIn && user?.email) {
      try {
        const response = await fetch("/api/users/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            product_id: product.id,
            lens_type: options.lensType || "single-vision",
            lens_option: options.frameColor || "black",
            quantity: options.quantity || 1,
            prescription_file_url: options.prescription
              ? JSON.stringify(options.prescription)
              : null,
            free_product_id: null,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCart(data.cart);
            return { success: true };
          }
        }
        throw new Error("Failed to add to cart");
      } catch (error) {
        console.error("Error adding to cart:", error);
        return { success: false, error: error.message };
      }
    } else {
      try {
        const updatedCart = [...cart, cartItem];
        setCart(updatedCart);
        localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
        return { success: true };
      } catch (error) {
        console.error("Error adding to guest cart:", error);
        return { success: false, error: error.message };
      }
    }
  };

  const login = async (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem("user_email", userData.email);

    const guestCart = localStorage.getItem("guest_cart");
    if (guestCart) {
      try {
        const parsedGuestCart = JSON.parse(guestCart);
        if (parsedGuestCart.length > 0) {
          for (const item of parsedGuestCart) {
            await addToCart(item, {
              quantity: item.quantity,
              lensType: item.lensType,
              frameColor: item.frameColor,
              powerOption: item.powerOption,
              prescription: item.prescription,
            });
          }
          localStorage.removeItem("guest_cart");
        }
      } catch (error) {
        console.error("Error migrating guest cart:", error);
      }
    }

    await fetchUserCartAndWishlist(userData.email);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCart([]);
    setWishlist([]);
    localStorage.removeItem("user_email");
    loadLocalStorageCart();
  };

  const value = {
    user,
    isLoggedIn,
    isLoading,
    cart,
    wishlist,
    login,
    logout,
    addToCart,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
