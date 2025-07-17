"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import "./style.scss";

const ProductsView = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    color: "",
    shape: "",
    frame_type: "",
    material: "",
    minPrice: "",
    maxPrice: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });

  // Fetch products from API
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "9",
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== "")
        ),
      });

      const response = await fetch(`/api/products?${queryParams}`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);
        setPagination(data.data.pagination);
      } else {
        throw new Error(data.error || "Failed to fetch products");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch products when filters or page changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts(1);
    }, 300); // 300ms debounce for search

    return () => clearTimeout(timeoutId);
  }, [filters]);

  // Handle filter changes with useCallback to prevent unnecessary re-renders
  const handleFilterChange = useCallback((filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  }, []);

  // Handle page change
  const handlePageChange = (page) => {
    fetchProducts(page);
  };

  if (error) {
    return (
      <div className="products-view">
        <div className="products-view__error">
          <h2>Error Loading Products</h2>
          <p>{error}</p>
          <button onClick={() => fetchProducts(1)} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="products-view">
      <div className="products-view__container">
        {/* Header */}
        <div className="products-view__header">
          <h1>Our Eyewear Collection</h1>
          <p>Discover perfect frames for your style and vision needs</p>
        </div>

        {/* Filters */}
        <div className="products-view__filters">
          <div className="filters-row">
            <div className="filter-group">
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <select
                value={filters.color}
                onChange={(e) => handleFilterChange("color", e.target.value)}
              >
                <option value="">All Colors</option>
                <option value="Black">Black</option>
                <option value="Brown">Brown</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Blue">Blue</option>
                <option value="Purple">Purple</option>
                <option value="Gray">Gray</option>
                <option value="Tortoise">Tortoise</option>
                <option value="Gunmetal">Gunmetal</option>
              </select>
            </div>

            <div className="filter-group">
              <select
                value={filters.shape}
                onChange={(e) => handleFilterChange("shape", e.target.value)}
              >
                <option value="">All Shapes</option>
                <option value="Aviator">Aviator</option>
                <option value="Round">Round</option>
                <option value="Square">Square</option>
                <option value="Rectangle">Rectangle</option>
                <option value="Cat Eye">Cat Eye</option>
                <option value="Oval">Oval</option>
                <option value="Wrap">Wrap</option>
                <option value="Oversized">Oversized</option>
              </select>
            </div>

            <div className="filter-group">
              <select
                value={filters.frame_type}
                onChange={(e) =>
                  handleFilterChange("frame_type", e.target.value)
                }
              >
                <option value="">All Frame Types</option>
                <option value="Full Rim">Full Rim</option>
                <option value="Semi Rim">Semi Rim</option>
                <option value="Rimless">Rimless</option>
              </select>
            </div>

            <div className="filter-group">
              <select
                value={filters.material}
                onChange={(e) => handleFilterChange("material", e.target.value)}
              >
                <option value="">All Materials</option>
                <option value="Metal">Metal</option>
                <option value="Acetate">Acetate</option>
                <option value="Titanium">Titanium</option>
                <option value="Stainless Steel">Stainless Steel</option>
                <option value="Polycarbonate">Polycarbonate</option>
              </select>
            </div>
          </div>

          <div className="filters-row">
            <div className="filter-group">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="price-input"
              />
            </div>
            <div className="filter-group">
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="price-input"
              />
            </div>
            <div className="filter-group">
              <button
                onClick={() =>
                  setFilters({
                    search: "",
                    color: "",
                    shape: "",
                    frame_type: "",
                    material: "",
                    minPrice: "",
                    maxPrice: "",
                  })
                }
                className="clear-filters-btn"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="products-view__results-info">
          <p>
            Showing {products.length} of {pagination.totalProducts} products
            {filters.search && ` for "${filters.search}"`}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="products-view__loading">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="products-view__no-results">
            <h3>No products found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="products-view__grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="products-view__pagination">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
              className="pagination-btn"
            >
              Previous
            </button>

            <div className="pagination-numbers">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === pagination.totalPages ||
                    Math.abs(page - pagination.currentPage) <= 2
                )
                .map((page, index, array) => (
                  <span key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="pagination-ellipsis">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`pagination-number ${
                        page === pagination.currentPage ? "active" : ""
                      }`}
                    >
                      {page}
                    </button>
                  </span>
                ))}
            </div>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsView;
