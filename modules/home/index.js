"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "@components/Modal";
import { useUser } from "@/context/UserContext";
import "./style.scss";

const HomeView = () => {
  const { user, isLoggedIn, wishlist: userWishlist } = useUser();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [filters, setFilters] = useState({
    frameType: "",
    material: "",
    color: "",
    shape: "",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());

  const banners = [
    {
      id: 1,
      title: "Premium Eyewear Collection 2024",
      subtitle:
        "Discover our latest designer frames with cutting-edge technology",
      image: "/api/placeholder/800/400",
      cta: "Explore Collection",
    },
    {
      id: 2,
      title: "Blue Light Protection Technology",
      subtitle:
        "Advanced lens technology to protect your eyes from digital strain",
      image: "/api/placeholder/800/400",
      cta: "Learn More",
    },
  ];

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/products?is_popular=true");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's wishlist from API
  const fetchWishlist = async () => {
    if (!isLoggedIn || !user?.email) {
      setWishlist(new Set());
      return;
    }

    try {
      const response = await fetch(
        `/api/users/wishlist?email=${encodeURIComponent(user.email)}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const wishlistIds = new Set(
            data.wishlist?.map((item) => item._id) || []
          );
          setWishlist(wishlistIds);
        }
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const filterOptions = {
    frameType: ["metal", "plastic"],
    material: ["titanium", "acetate", "stainless-steel", "polycarbonate"],
    color: ["black", "blue", "gold", "red", "tortoise", "silver"],
    shape: ["aviator", "rectangular", "round", "wrap", "cat-eye"],
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [isLoggedIn, user]);

  const filteredProducts = products?.data?.products?.filter(
    (ele) => ele?.is_popular === true
  );

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType] === value ? "" : value,
    }));
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const openFilterModal = () => {
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const clearAllFilters = () => {
    setFilters({ frameType: "", material: "", color: "", shape: "" });
  };

  const toggleWishlist = async (product) => {
    // Check if user is logged in
    if (!isLoggedIn || !user?.email) {
      alert("Please log in to add items to your wishlist");
      return;
    }

    try {
      const isInWishlist = wishlist.has(product?._id);

      // Optimistically update UI
      setWishlist((prev) => {
        const newWishlist = new Set(prev);
        if (isInWishlist) {
          newWishlist.delete(product?._id);
        } else {
          newWishlist.add(product?._id);
        }
        return newWishlist;
      });

      let response;

      if (isInWishlist) {
        // Remove from wishlist
        response = await fetch(
          `/api/users/wishlist/${product?._id}?email=${encodeURIComponent(
            user.email
          )}`,
          {
            method: "DELETE",
          }
        );
      } else {
        // Add to wishlist
        response = await fetch("/api/users/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            product_id: product?._id,
          }),
        });
      }

      if (!response.ok) {
        // Revert optimistic update if API call fails
        setWishlist((prev) => {
          const newWishlist = new Set(prev);
          if (isInWishlist) {
            newWishlist.add(product?._id);
          } else {
            newWishlist.delete(product?._id);
          }
          return newWishlist;
        });
        throw new Error("Failed to update wishlist");
      }

      const result = await response.json();
      console.log("Wishlist updated:", result);

      // Show success message
      if (isInWishlist) {
        console.log("Product removed from wishlist");
      } else {
        console.log("Product added to wishlist");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert("Failed to update wishlist. Please try again.");
    }
  };

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const FiltersContent = () => (
    <>
      <h3 className="filters-sidebar__title">Filter Products</h3>

      {Object.entries(filterOptions).map(([filterType, options]) => (
        <div key={filterType} className="filters-sidebar__group">
          <h4 className="filters-sidebar__group-title">
            {filterType.charAt(0).toUpperCase() +
              filterType.slice(1).replace(/([A-Z])/g, " $1")}
          </h4>
          <div className="filters-sidebar__options">
            {options.map((option) => (
              <button
                key={option}
                className={`filters-sidebar__option ${
                  filters[filterType] === option ? "active" : ""
                }`}
                onClick={() => handleFilterChange(filterType, option)}
              >
                {option.charAt(0).toUpperCase() +
                  option.slice(1).replace(/-/g, " ")}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button className="filters-sidebar__clear" onClick={clearAllFilters}>
        Clear All Filters
      </button>
    </>
  );

  return (
    <div className="home-view">
      <section className="banner-carousel">
        <div className="banner-carousel__container">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`banner-carousel__slide ${
                index === currentBanner ? "active" : ""
              }`}
            >
              <div className="banner-carousel__image">
                <div className="placeholder-image">Banner {index + 1}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          className="banner-carousel__nav banner-carousel__nav--prev"
          onClick={prevBanner}
        >
          ‹
        </button>
        <button
          className="banner-carousel__nav banner-carousel__nav--next"
          onClick={nextBanner}
        >
          ›
        </button>

        <div className="banner-carousel__indicators">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`banner-carousel__indicator ${
                index === currentBanner ? "active" : ""
              }`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
      </section>

      <div className="home-view__container">
        <div className="home-view__main">
          <main className="product-grid">
            <div className="product-grid__header">
              <div className="product-grid__header-left">
                <h2 className="product-grid__title">Our Premium Collection</h2>
                <span className="product-grid__count">
                  {filteredProducts?.length} product
                  {filteredProducts?.length !== 1 ? "s" : ""} found
                </span>
              </div>

              <button
                className="product-grid__filter-btn"
                onClick={openFilterModal}
              >
                <span className="product-grid__filter-icon">⚙</span>
                Filters
              </button>
            </div>

            <div className="product-grid__container">
              {loading && (
                <div className="product-grid__loading">
                  <div className="loading-spinner">
                    Loading popular products...
                  </div>
                </div>
              )}

              {error && (
                <div className="product-grid__error">
                  <div className="error-message">
                    <h3>Error loading products</h3>
                    <p>{error}</p>
                    <button
                      className="product-grid__retry"
                      onClick={fetchProducts}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {!loading &&
                !error &&
                filteredProducts.map((product) => (
                  <div key={product._id} className="product-card">
                    {product.badge && (
                      <div
                        className={`product-card__badge product-card__badge--${product.badge
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {product.badge}
                      </div>
                    )}
                    <div className="product-card__image">
                      <img
                        src={product?.images?.[0]}
                        className="placeholder-image"
                        alt={product?.name}
                      />
                      <button
                        className={`product-card__wishlist-overlay ${
                          wishlist.has(product._id) ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product);
                        }}
                        aria-label={
                          wishlist.has(product._id)
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                        }
                      >
                        <span className="product-card__wishlist-icon">
                          {wishlist.has(product._id) ? "❤️" : "🤍"}
                        </span>
                      </button>
                    </div>
                    <div className="product-card__content">
                      <h3 className="product-card__name">{product.name}</h3>
                      <div className="product-card__pricing">
                        <span className="product-card__price">
                          {product.price}
                        </span>
                        {product.price && (
                          <span className="product-card__original-price">
                            {product.price * 2}
                          </span>
                        )}
                      </div>
                      <div className="product-card__actions">
                        <button
                          className="product-card__btn product-card__btn--info"
                          onClick={() => openProductModal(product)}
                        >
                          Quick View
                        </button>
                        <Link
                          href={`/product/${product._id}`}
                          className="product-card__btn product-card__btn--primary"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {!loading && !error && filteredProducts.length === 0 && (
              <div className="product-grid__empty">
                <div className="product-grid__empty-icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters to see more results</p>
                <button
                  className="product-grid__clear-filters"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Modal
        isOpen={isFilterModalOpen}
        onClose={closeFilterModal}
        title="Filter Products"
        size="medium"
      >
        <div className="filters-modal">
          <FiltersContent />
        </div>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={closeProductModal}
        title={selectedProduct?.name || ""}
        size="large"
      >
        {selectedProduct && (
          <div className="product-modal">
            <div className="product-modal__image">
              <div className="placeholder-image">{selectedProduct.name}</div>
            </div>
            <div className="product-modal__content">
              <div className="product-modal__pricing">
                <span className="product-modal__price">
                  {selectedProduct.price}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="product-modal__original-price">
                    {selectedProduct.originalPrice}
                  </span>
                )}
              </div>
              <p className="product-modal__description">
                {selectedProduct.description}
              </p>

              <div className="product-modal__specs">
                <h4>Specifications</h4>
                <div className="product-modal__specs-grid">
                  <div className="product-modal__spec">
                    <strong>Frame Type:</strong> {selectedProduct.frameType}
                  </div>
                  <div className="product-modal__spec">
                    <strong>Material:</strong> {selectedProduct.material}
                  </div>
                  <div className="product-modal__spec">
                    <strong>Color:</strong> {selectedProduct.color}
                  </div>
                  <div className="product-modal__spec">
                    <strong>Shape:</strong> {selectedProduct.shape}
                  </div>
                </div>
              </div>

              <div className="product-modal__actions">
                <Link
                  href={`/product/${selectedProduct._id}`}
                  className="product-modal__btn product-modal__btn--primary"
                >
                  View Full Details
                </Link>
                <button
                  className="product-modal__btn product-modal__btn--secondary"
                  onClick={closeProductModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HomeView;
