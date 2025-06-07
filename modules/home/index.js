"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "@components/Modal";
import "./style.scss";

const HomeView = () => {
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

  // Sample banner data
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

  // Sample product data
  const products = [
    {
      id: 1,
      name: "Classic Aviator Sunglasses",
      price: "$159.99",
      originalPrice: "$199.99",
      image: "/api/placeholder/300/250",
      frameType: "metal",
      material: "titanium",
      color: "black",
      shape: "aviator",
      description:
        "Premium aviator sunglasses with 100% UV protection and polarized lenses",
      badge: "Popular",
    },
    {
      id: 2,
      name: "Blue Light Blocking Glasses",
      price: "$89.99",
      originalPrice: "$129.99",
      image: "/api/placeholder/300/250",
      frameType: "plastic",
      material: "acetate",
      color: "blue",
      shape: "rectangular",
      description:
        "Reduce eye strain from digital devices with our premium blue light blocking technology",
      badge: "Best Seller",
    },
    {
      id: 3,
      name: "Vintage Round Frames",
      price: "$129.99",
      image: "/api/placeholder/300/250",
      frameType: "metal",
      material: "stainless-steel",
      color: "gold",
      shape: "round",
      description:
        "Timeless round frames with modern comfort and premium materials",
    },
    {
      id: 4,
      name: "Sport Sunglasses",
      price: "$199.99",
      originalPrice: "$249.99",
      image: "/api/placeholder/300/250",
      frameType: "plastic",
      material: "polycarbonate",
      color: "red",
      shape: "wrap",
      description:
        "High-performance sunglasses designed for active lifestyle with impact resistance",
      badge: "New",
    },
    {
      id: 5,
      name: "Cat Eye Frames",
      price: "$149.99",
      image: "/api/placeholder/300/250",
      frameType: "plastic",
      material: "acetate",
      color: "tortoise",
      shape: "cat-eye",
      description:
        "Elegant cat eye frames for a sophisticated and timeless look",
    },
    {
      id: 6,
      name: "Minimalist Frames",
      price: "$99.99",
      originalPrice: "$139.99",
      image: "/api/placeholder/300/250",
      frameType: "metal",
      material: "titanium",
      color: "silver",
      shape: "rectangular",
      description:
        "Clean, minimalist design perfect for everyday professional wear",
    },
  ];

  // Filter options
  const filterOptions = {
    frameType: ["metal", "plastic"],
    material: ["titanium", "acetate", "stainless-steel", "polycarbonate"],
    color: ["black", "blue", "gold", "red", "tortoise", "silver"],
    shape: ["aviator", "rectangular", "round", "wrap", "cat-eye"],
  };

  // Banner carousel auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    return (
      (!filters.frameType || product.frameType === filters.frameType) &&
      (!filters.material || product.material === filters.material) &&
      (!filters.color || product.color === filters.color) &&
      (!filters.shape || product.shape === filters.shape)
    );
  });

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
      {/* Banner Carousel */}
      <section className="banner-carousel">
        <div className="banner-carousel__container">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`banner-carousel__slide ${
                index === currentBanner ? "active" : ""
              }`}
            >
              <div className="banner-carousel__content">
                <h2 className="banner-carousel__title">{banner.title}</h2>
                <p className="banner-carousel__subtitle">{banner.subtitle}</p>
                <button className="banner-carousel__cta">{banner.cta}</button>
              </div>
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
          {/* Desktop Filters Sidebar */}
          <aside className="filters-sidebar filters-sidebar--desktop">
            <FiltersContent />
          </aside>

          {/* Product Grid */}
          <main className="product-grid">
            <div className="product-grid__header">
              <div className="product-grid__header-left">
                <h2 className="product-grid__title">Our Premium Collection</h2>
                <span className="product-grid__count">
                  {filteredProducts.length} product
                  {filteredProducts.length !== 1 ? "s" : ""} found
                </span>
              </div>

              {/* Mobile Filter Button */}
              <button
                className="product-grid__filter-btn"
                onClick={openFilterModal}
              >
                <span className="product-grid__filter-icon">⚙</span>
                Filters
              </button>
            </div>

            <div className="product-grid__container">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
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
                    <div className="placeholder-image">{product.name}</div>
                  </div>
                  <div className="product-card__content">
                    <h3 className="product-card__name">{product.name}</h3>
                    <div className="product-card__pricing">
                      <span className="product-card__price">
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="product-card__original-price">
                          {product.originalPrice}
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
                        href={`/product/${product.name
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                        className="product-card__btn product-card__btn--primary"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
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

      {/* Mobile Filters Modal */}
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

      {/* Product Info Modal */}
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
                  href={`/product/${selectedProduct.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
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
