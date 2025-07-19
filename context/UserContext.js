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
  const [isLoading, setIsLoading] = useState(false); // Set to false since no API calls
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [comingSoonToast, setComingSoonToast] = useState({
    isVisible: false,
    message: "",
    type: "info",
  });

  useEffect(() => {
    // Commented out API check - just load local cart if any
    const loadLocalCart = () => {
      setIsLoading(false);
      // loadLocalStorageCart();
    };
    loadLocalCart();
  }, []);

  // Commented out original functions and replaced with Coming Soon messages

  // const checkExistingUser = async () => {
  //   try {
  //     const storedEmail = localStorage.getItem("user_email");

  //     if (storedEmail) {
  //       const response = await fetch("/api/users/check-email", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ email: storedEmail }),
  //       });

  //       if (response.ok) {
  //         const result = await response.json();
  //         setUser(result.user);
  //         setIsLoggedIn(true);
  //         await fetchUserCartAndWishlist(result.user.email);
  //       } else {
  //         localStorage.removeItem("user_email");
  //         loadLocalStorageCart();
  //       }
  //     } else {
  //       loadLocalStorageCart();
  //     }
  //   } catch (error) {
  //     console.error("Error checking existing user:", error);
  //     localStorage.removeItem("user_email");
  //     loadLocalStorageCart();
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const loadLocalStorageCart = () => {
  //   try {
  //     const storedCart = localStorage.getItem("guest_cart");
  //     if (storedCart) {
  //       setCart(JSON.parse(storedCart));
  //     }
  //   } catch (error) {
  //     console.error("Error loading cart from localStorage:", error);
  //   }
  // };

  // const fetchUserCartAndWishlist = async (email) => {
  //   try {
  //     const [cartResponse, wishlistResponse] = await Promise.all([
  //       fetch(`/api/users/cart?email=${encodeURIComponent(email)}`),
  //       fetch(`/api/users/wishlist?email=${encodeURIComponent(email)}`),
  //     ]);

  //     if (cartResponse.ok) {
  //       const cartData = await cartResponse.json();
  //       if (cartData.success) {
  //         setCart(cartData.cart || []);
  //       }
  //     }

  //     if (wishlistResponse.ok) {
  //       const wishlistData = await wishlistResponse.json();
  //       if (wishlistData.success) {
  //         setWishlist(wishlistData.wishlist || []);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user cart and wishlist:", error);
  //   }
  // };

  // Show Coming Soon message
  const showComingSoonMessage = (action) => {
    setComingSoonToast({
      isVisible: true,
      message: `${action} feature is coming soon! Stay tuned for updates.`,
      type: "info",
    });

    // Auto hide after 3 seconds
    setTimeout(() => {
      setComingSoonToast((prev) => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const addToCart = async (product, options = {}) => {
    showComingSoonMessage("Add to Cart");
    return { success: false, message: "Feature coming soon!" };

    // Original API code commented out:
    // const cartItem = {
    //   id: product.id,
    //   name: product.name,
    //   price: product.price,
    //   image: product.images[0],
    //   quantity: options.quantity || 1,
    //   lensType: options.lensType,
    //   frameColor: options.frameColor,
    //   powerOption: options.powerOption,
    //   prescription: options.prescription,
    //   addedAt: new Date().toISOString(),
    // };

    // if (isLoggedIn && user?.email) {
    //   try {
    //     const response = await fetch("/api/users/cart", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         email: user.email,
    //         product_id: product.id,
    //         lens_type: options.lensType || "single-vision",
    //         lens_option: options.frameColor || "black",
    //         quantity: options.quantity || 1,
    //         prescription_file_url: options.prescription
    //           ? JSON.stringify(options.prescription)
    //           : null,
    //         free_product_id: null,
    //       }),
    //     });

    //     if (response.ok) {
    //       const data = await response.json();
    //       if (data.success) {
    //         setCart(data.cart);
    //         return { success: true };
    //       }
    //     }
    //     throw new Error("Failed to add to cart");
    //   } catch (error) {
    //     console.error("Error adding to cart:", error);
    //     return { success: false, error: error.message };
    //   }
    // } else {
    //   try {
    //     const updatedCart = [...cart, cartItem];
    //     setCart(updatedCart);
    //     localStorage.setItem("guest_cart", JSON.stringify(updatedCart));
    //     return { success: true };
    //   } catch (error) {
    //     console.error("Error adding to guest cart:", error);
    //     return { success: false, error: error.message };
    //   }
    // }
  };

  const addToWishlist = async (product) => {
    showComingSoonMessage("Add to Wishlist");
    return { success: false, message: "Feature coming soon!" };
  };

  const removeFromWishlist = async (productId) => {
    showComingSoonMessage("Remove from Wishlist");
    return { success: false, message: "Feature coming soon!" };
  };

  const removeFromCart = async (cartItemId) => {
    showComingSoonMessage("Remove from Cart");
    return { success: false, message: "Feature coming soon!" };
  };

  const updateCartQuantity = async (cartItemId, quantity) => {
    showComingSoonMessage("Update Cart");
    return { success: false, message: "Feature coming soon!" };
  };

  const login = async (userData) => {
    showComingSoonMessage("Login");
    return { success: false, message: "Feature coming soon!" };

    // Original login code commented out:
    // setUser(userData);
    // setIsLoggedIn(true);
    // localStorage.setItem("user_email", userData.email);

    // const guestCart = localStorage.getItem("guest_cart");
    // if (guestCart) {
    //   try {
    //     const parsedGuestCart = JSON.parse(guestCart);
    //     if (parsedGuestCart.length > 0) {
    //       for (const item of parsedGuestCart) {
    //         await addToCart(item, {
    //           quantity: item.quantity,
    //           lensType: item.lensType,
    //           frameColor: item.frameColor,
    //           powerOption: item.powerOption,
    //           prescription: item.prescription,
    //         });
    //       }
    //       localStorage.removeItem("guest_cart");
    //     }
    //   } catch (error) {
    //     console.error("Error migrating guest cart:", error);
    //   }
    // }

    // await fetchUserCartAndWishlist(userData.email);
  };

  const register = async (userData) => {
    showComingSoonMessage("Registration");
    return { success: false, message: "Feature coming soon!" };
  };

  const logout = () => {
    showComingSoonMessage("Logout");
    // setUser(null);
    // setIsLoggedIn(false);
    // setCart([]);
    // setWishlist([]);
    // localStorage.removeItem("user_email");
    // loadLocalStorageCart();
  };

  const value = {
    user,
    isLoggedIn,
    isLoading,
    cart,
    wishlist,
    login,
    register,
    logout,
    addToCart,
    addToWishlist,
    removeFromWishlist,
    removeFromCart,
    updateCartQuantity,
    comingSoonToast,
    setComingSoonToast,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
