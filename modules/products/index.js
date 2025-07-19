"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import productsData from "@/models/products.json";
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
    material: "",
    general_size: "",
    best_seller: "",
    minPrice: "",
    maxPrice: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
  });

  // Fetch products from local JSON data instead of API
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching products from local data...");

      // COMMENTED OUT - Original API fetch code
      /*
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
      */

      // Filter products from local JSON data
      let filteredProducts = productsData.filter(
        (product) => product.out_of_stock === false
      );

      // Apply search filter
      if (filters.search) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(filters.search.toLowerCase())
        );
      }

      // Apply color filter
      if (filters.color) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.color.toLowerCase() === filters.color.toLowerCase()
        );
      }

      // Apply shape filter
      if (filters.shape) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.shape.toLowerCase() === filters.shape.toLowerCase()
        );
      }

      // Apply material filter
      if (filters.material) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.material.toLowerCase() === filters.material.toLowerCase()
        );
      }

      // Apply general size filter
      if (filters.general_size) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.general_size.toLowerCase() ===
            filters.general_size.toLowerCase()
        );
      }

      // Apply best_seller filter
      if (filters.best_seller) {
        filteredProducts = filteredProducts.filter(
          (product) => product.best_seller === true
        );
      }

      // Apply price range filter
      if (filters.minPrice) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price >= parseFloat(filters.minPrice)
        );
      }
      if (filters.maxPrice) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price <= parseFloat(filters.maxPrice)
        );
      }

      console.log("Filtered products:", filteredProducts.length);

      // Pagination logic
      const limit = 9;
      const totalProducts = filteredProducts.length;
      const totalPages = Math.ceil(totalProducts / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      // Transform the data to match the expected format
      const transformedProducts = paginatedProducts.map((product) => ({
        _id: product.product_id,
        name: product.name,
        brand_name: product.brand_name,
        description: product.description,
        images: product.images,
        price: product.price, // Keep as number for formatPrice function
        actual_price: product.actual_price, // Keep as number for formatPrice function
        discounted_percentage: product.discounted_percentage,
        frameType: product.frame_type || product.material,
        material: product.material,
        color: product.color,
        shape: product.shape,
        size: product.size,
        general_size: product.general_size,
        available_lens_types: product.available_lens_types,
        buy_1_get_1_available: product.buy_1_get_1_available,
        is_popular: product.is_popular,
        best_seller: product.best_seller,
        quantity: product.quantity,
        out_of_stock: product.out_of_stock,
      }));

      setProducts(transformedProducts);
      setPagination({
        currentPage: page,
        totalPages,
        totalProducts,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      });
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
                <option value="BLACK">Black</option>
                <option value="BROWN">Brown</option>
                <option value="GREY">Grey</option>
                <option value="BLUE">Blue</option>
                <option value="GOLD">Gold</option>
                <option value="SILVER">Silver</option>
                <option value="WHITE">White</option>
                <option value="GREEN">Green</option>
                <option value="PINK">Pink</option>
                <option value="PURPLE">Purple</option>
                <option value="MAROON">Maroon</option>
                <option value="GUN METAL">Gun Metal</option>
                <option value="ROSE GOLD">Rose Gold</option>
                <option value="MATTE BLACK">Matte Black</option>
                <option value="MATTE GREY">Matte Grey</option>
                <option value="MATTE BLUE">Matte Blue</option>
                <option value="TRANSPARENT GREY">Transparent Grey</option>
                <option value="TRANSPARENT BLUE">Transparent Blue</option>
                <option value="BLACK AND SILVER">Black & Silver</option>
                <option value="BLACK AND GOLD">Black & Gold</option>
                <option value="BLACK AND BROWN">Black & Brown</option>
                <option value="BLUE SILVER">Blue Silver</option>
              </select>
            </div>

            <div className="filter-group">
              <select
                value={filters.shape}
                onChange={(e) => handleFilterChange("shape", e.target.value)}
              >
                <option value="">All Shapes</option>
                <option value="SQUARE">Square</option>
                <option value="ROUND">Round</option>
                <option value="RECTANGULAR">Rectangular</option>
                <option value="CAT EYE">Cat Eye</option>
                <option value="AVIATOR">Aviator</option>
                <option value="OVAL">Oval</option>
                <option value="HEXAGON">Hexagon</option>
                <option value="WAYFARER">Wayfarer</option>
                <option value="BUTTRERFLY">Butterfly</option>
              </select>
            </div>

            <div className="filter-group">
              <select
                value={filters.material}
                onChange={(e) => handleFilterChange("material", e.target.value)}
              >
                <option value="">All Materials</option>
                <option value="TR">TR (Plastic)</option>
                <option value="METAL">Metal</option>
                <option value="ACETATE">Acetate</option>
                <option value="TITANIUM">Titanium</option>
                <option value="HALF METAL">Half Metal</option>
                <option value="METAL HALF">Metal Half</option>
                <option value="TITANIUM RIMLESS">Titanium Rimless</option>
                <option value="ULTEM RIMLESS">Ultem Rimless</option>
              </select>
            </div>

            <div className="filter-group">
              <select
                value={filters.general_size}
                onChange={(e) =>
                  handleFilterChange("general_size", e.target.value)
                }
              >
                <option value="">All Sizes</option>
                <option value="SMALL">Small</option>
                <option value="MEDIUM">Medium</option>
                <option value="LARGE">Large</option>
                <option value="NARROW">Narrow</option>
              </select>
            </div>

            <div className="filter-group">
              <select
                value={filters.best_seller}
                onChange={(e) =>
                  handleFilterChange("best_seller", e.target.value)
                }
              >
                <option value="">All Best Sellers</option>
                <option value="true">Best Sellers</option>
                <option value="false">Not Best Sellers</option>
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
                    material: "",
                    general_size: "",
                    best_seller: "",
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
