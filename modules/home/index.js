"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "@components/Modal";
import ProductCard from "@/components/ProductCard";
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
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      // Fetch bestseller products
      console.log("Fetching bestseller products...");
      const bestsellerResponse = await fetch("/api/products?best_seller=true");
      console.log("Response status:", bestsellerResponse.status);

      if (!bestsellerResponse.ok) {
        throw new Error("Failed to fetch bestseller products");
      }
      const bestsellerData = await bestsellerResponse.json();
      console.log("Bestseller data:", bestsellerData);
      console.log(
        "Products count:",
        bestsellerData?.data?.products?.length || 0
      );

      setBestsellerProducts(bestsellerData?.data?.products || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
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
          {/* Bestseller Products Section */}
          <section className="product-section">
            <div className="product-section__header">
              <h2 className="product-section__title">🏆 Bestseller Products</h2>
              <p className="product-section__subtitle">
                Most loved by our customers
              </p>
              <Link
                href="/products?best_seller=true"
                className="product-section__view-all"
              >
                View All Bestsellers →
              </Link>
            </div>

            {loading && (
              <div className="product-section__loading">
                <div className="loading-spinner">
                  Loading bestseller products...
                </div>
              </div>
            )}

            {error && (
              <div className="product-section__error">
                <div className="error-message">
                  <h3>Error loading products</h3>
                  <p>{error}</p>
                  <button
                    className="product-section__retry"
                    onClick={fetchProducts}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {!loading && !error && (
              <div className="product-section__grid">
                {bestsellerProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </section>
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
