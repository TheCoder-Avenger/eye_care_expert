"use client";

import { useState, useEffect } from "react";
import PlaceholderImage from "@components/PlaceholderImage";
import Modal from "@components/Modal";
import "./style.scss";

const ProductView = ({ slug }) => {
  // Product state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Product configuration state
  const [selectedLensType, setSelectedLensType] = useState("single-vision");
  const [selectedFrameColor, setSelectedFrameColor] = useState("black");
  const [selectedPowerOption, setSelectedPowerOption] = useState("with-power");
  const [prescription, setPrescription] = useState({
    rightEye: { sph: "", cyl: "", axis: "" },
    leftEye: { sph: "", cyl: "", axis: "" },
  });

  // Modal state
  const [showBuyOneGetOneModal, setShowBuyOneGetOneModal] = useState(false);
  const [selectedSecondProduct, setSelectedSecondProduct] = useState(null);

  // Cart state
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Mock product data (replace with API call)
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setProduct({
          id: slug,
          name: "Classic Aviator Sunglasses",
          brand: "EyeCare Expert",
          price: 2999,
          originalPrice: 4999,
          discount: 40,
          rating: 4.5,
          reviews: 128,
          description:
            "Premium quality aviator sunglasses with UV protection and polarized lenses. Perfect for outdoor activities and daily wear.",
          features: [
            "UV 400 Protection",
            "Polarized Lenses",
            "Anti-Reflective Coating",
            "Scratch Resistant",
            "Lightweight Frame",
          ],
          images: [
            "/api/placeholder/600/600",
            "/api/placeholder/600/600",
            "/api/placeholder/600/600",
            "/api/placeholder/600/600",
            "/api/placeholder/600/600",
          ],
          colors: [
            { name: "Black", code: "#000000", available: true },
            { name: "Brown", code: "#8B4513", available: true },
            { name: "Gold", code: "#FFD700", available: false },
            { name: "Silver", code: "#C0C0C0", available: true },
          ],
          lensOptions: [
            {
              id: "single-vision",
              name: "Single Vision",
              price: 0,
              description: "For distance or reading",
            },
            {
              id: "progressive",
              name: "Progressive",
              price: 1500,
              description: "For distance and reading combined",
            },
            {
              id: "blue-light",
              name: "Blue Light Filter",
              price: 800,
              description: "Reduces digital eye strain",
            },
          ],
          buyOneGetOneProducts: [
            {
              id: "product-2",
              name: "Reading Glasses",
              price: 1999,
              image: "/api/placeholder/200/200",
            },
            {
              id: "product-3",
              name: "Sport Sunglasses",
              price: 2499,
              image: "/api/placeholder/200/200",
            },
            {
              id: "product-4",
              name: "Blue Light Glasses",
              price: 1799,
              image: "/api/placeholder/200/200",
            },
          ],
        });
        setLoading(false);
      }, 1000);
    };

    fetchProduct();
  }, [slug]);

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    // Simulate API call
    setTimeout(() => {
      setIsAddingToCart(false);
      // Add to cart logic here
      console.log("Added to cart:", {
        product,
        lensType: selectedLensType,
        frameColor: selectedFrameColor,
        powerOption: selectedPowerOption,
        prescription:
          selectedPowerOption === "with-power" ? prescription : null,
        quantity,
      });
    }, 1500);
  };

  const handleBuyNow = () => {
    // Navigate to checkout or show buy options
    console.log("Buy now clicked");
  };

  const handleBuyOneGetOne = () => {
    setShowBuyOneGetOneModal(true);
  };

  const isPrescriptionValid = () => {
    if (selectedPowerOption === "without-power") return true;

    const { rightEye, leftEye } = prescription;
    return (
      rightEye.sph &&
      rightEye.cyl &&
      rightEye.axis &&
      leftEye.sph &&
      leftEye.cyl &&
      leftEye.axis
    );
  };

  const isConfigurationComplete = () => {
    return selectedLensType && selectedFrameColor && isPrescriptionValid();
  };

  if (loading) {
    return (
      <div className="product-view">
        <div className="product-view__loading">
          <div className="product-view__loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-view">
        <div className="product-view__error">
          <h2>Product not found</h2>
          <p>The product you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-view">
      <div className="product-view__container">
        {/* Product Gallery */}
        <div className="product-view__gallery">
          {/* Main Image */}
          <div className="product-view__main-image">
            <img
              src={product.images[selectedImageIndex]}
              alt={product.name}
              className={`product-view__main-image-img ${
                isZoomed ? "product-view__main-image-img--zoomed" : ""
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            />
            <button
              className="product-view__zoom-btn"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              {isZoomed ? "🔍-" : "🔍+"}
            </button>
          </div>

          {/* Thumbnail Images */}
          <div className="product-view__thumbnails">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`product-view__thumbnail ${
                  selectedImageIndex === index
                    ? "product-view__thumbnail--active"
                    : ""
                }`}
                onClick={() => handleImageSelect(index)}
              >
                <img src={image} alt={`${product.name} view ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="product-view__details">
          <div className="product-view__header">
            <h1 className="product-view__title">{product.name}</h1>
            <p className="product-view__brand">{product.brand}</p>

            <div className="product-view__rating">
              <span className="product-view__stars">★★★★☆</span>
              <span className="product-view__rating-text">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
          </div>

          <div className="product-view__pricing">
            <span className="product-view__price">₹{product.price}</span>
            <span className="product-view__original-price">
              ₹{product.originalPrice}
            </span>
            <span className="product-view__discount">
              {product.discount}% OFF
            </span>
          </div>

          <div className="product-view__description">
            <p>{product.description}</p>
          </div>

          <div className="product-view__features">
            <h3>Features:</h3>
            <ul>
              {product.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Frame Color Selection */}
          <div className="product-view__options">
            <h3>Frame Color:</h3>
            <div className="product-view__color-options">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  className={`product-view__color-option ${
                    selectedFrameColor === color.name.toLowerCase()
                      ? "product-view__color-option--active"
                      : ""
                  } ${
                    !color.available
                      ? "product-view__color-option--unavailable"
                      : ""
                  }`}
                  style={{ backgroundColor: color.code }}
                  onClick={() =>
                    color.available &&
                    setSelectedFrameColor(color.name.toLowerCase())
                  }
                  disabled={!color.available}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Lens Options */}
          <div className="product-view__lens-options">
            <h3>Lens Type:</h3>
            <div className="product-view__lens-grid">
              {product.lensOptions.map((lens) => (
                <div
                  key={lens.id}
                  className={`product-view__lens-option ${
                    selectedLensType === lens.id
                      ? "product-view__lens-option--active"
                      : ""
                  }`}
                  onClick={() => setSelectedLensType(lens.id)}
                >
                  <h4>{lens.name}</h4>
                  <p>{lens.description}</p>
                  <span className="product-view__lens-price">
                    {lens.price === 0 ? "Included" : `+₹${lens.price}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Power Options */}
          <div className="product-view__power-options">
            <h3>Power Options:</h3>
            <div className="product-view__power-toggle">
              <button
                className={`product-view__power-btn ${
                  selectedPowerOption === "without-power"
                    ? "product-view__power-btn--active"
                    : ""
                }`}
                onClick={() => setSelectedPowerOption("without-power")}
              >
                Without Power
              </button>
              <button
                className={`product-view__power-btn ${
                  selectedPowerOption === "with-power"
                    ? "product-view__power-btn--active"
                    : ""
                }`}
                onClick={() => setSelectedPowerOption("with-power")}
              >
                With Power
              </button>
            </div>
          </div>

          {/* Prescription Form */}
          {selectedPowerOption === "with-power" && (
            <div className="product-view__prescription">
              <h3>Prescription Details:</h3>
              <div className="product-view__prescription-form">
                <div className="product-view__eye-section">
                  <h4>Right Eye (OD)</h4>
                  <div className="product-view__prescription-inputs">
                    <input
                      type="number"
                      placeholder="SPH"
                      value={prescription.rightEye.sph}
                      onChange={(e) =>
                        setPrescription((prev) => ({
                          ...prev,
                          rightEye: { ...prev.rightEye, sph: e.target.value },
                        }))
                      }
                    />
                    <input
                      type="number"
                      placeholder="CYL"
                      value={prescription.rightEye.cyl}
                      onChange={(e) =>
                        setPrescription((prev) => ({
                          ...prev,
                          rightEye: { ...prev.rightEye, cyl: e.target.value },
                        }))
                      }
                    />
                    <input
                      type="number"
                      placeholder="AXIS"
                      value={prescription.rightEye.axis}
                      onChange={(e) =>
                        setPrescription((prev) => ({
                          ...prev,
                          rightEye: { ...prev.rightEye, axis: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="product-view__eye-section">
                  <h4>Left Eye (OS)</h4>
                  <div className="product-view__prescription-inputs">
                    <input
                      type="number"
                      placeholder="SPH"
                      value={prescription.leftEye.sph}
                      onChange={(e) =>
                        setPrescription((prev) => ({
                          ...prev,
                          leftEye: { ...prev.leftEye, sph: e.target.value },
                        }))
                      }
                    />
                    <input
                      type="number"
                      placeholder="CYL"
                      value={prescription.leftEye.cyl}
                      onChange={(e) =>
                        setPrescription((prev) => ({
                          ...prev,
                          leftEye: { ...prev.leftEye, cyl: e.target.value },
                        }))
                      }
                    />
                    <input
                      type="number"
                      placeholder="AXIS"
                      value={prescription.leftEye.axis}
                      onChange={(e) =>
                        setPrescription((prev) => ({
                          ...prev,
                          leftEye: { ...prev.leftEye, axis: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="product-view__actions">
            <div className="product-view__quantity">
              <label>Quantity:</label>
              <div className="product-view__quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className="product-view__buttons">
              <button
                className="product-view__add-to-cart"
                onClick={handleAddToCart}
                disabled={!isConfigurationComplete() || isAddingToCart}
              >
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </button>

              <button
                className="product-view__buy-now"
                onClick={handleBuyNow}
                disabled={!isConfigurationComplete()}
              >
                Buy Now
              </button>
            </div>

            <button
              className="product-view__buy-one-get-one"
              onClick={handleBuyOneGetOne}
              disabled={!isConfigurationComplete()}
            >
              🎁 Buy 1 Get 1 Free
            </button>
          </div>
        </div>
      </div>

      {/* Buy One Get One Modal */}
      {showBuyOneGetOneModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowBuyOneGetOneModal(false)}
        >
          <div
            className="modal modal--large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal__header">
              <h3>Buy 1 Get 1 Free - Choose Your Second Product</h3>
              <button
                className="modal__close-btn"
                onClick={() => setShowBuyOneGetOneModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal__body">
              <div className="buy-one-get-one">
                <div className="buy-one-get-one__selected">
                  <h4>Selected Product:</h4>
                  <div className="buy-one-get-one__product">
                    <img src={product.images[0]} alt={product.name} />
                    <div>
                      <h5>{product.name}</h5>
                      <p>₹{product.price}</p>
                    </div>
                  </div>
                </div>

                <div className="buy-one-get-one__free-products">
                  <h4>Choose Your Free Product:</h4>
                  <div className="buy-one-get-one__grid">
                    {product.buyOneGetOneProducts.map((freeProduct) => (
                      <div
                        key={freeProduct.id}
                        className={`buy-one-get-one__free-product ${
                          selectedSecondProduct?.id === freeProduct.id
                            ? "buy-one-get-one__free-product--selected"
                            : ""
                        }`}
                        onClick={() => setSelectedSecondProduct(freeProduct)}
                      >
                        <img src={freeProduct.image} alt={freeProduct.name} />
                        <h5>{freeProduct.name}</h5>
                        <p className="buy-one-get-one__original-price">
                          ₹{freeProduct.price}
                        </p>
                        <span className="buy-one-get-one__free-tag">FREE</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedSecondProduct && (
                  <div className="buy-one-get-one__summary">
                    <div className="buy-one-get-one__total">
                      <p>You Pay: ₹{product.price}</p>
                      <p>You Save: ₹{selectedSecondProduct.price}</p>
                      <h4>
                        Total Value: ₹
                        {product.price + selectedSecondProduct.price}
                      </h4>
                    </div>
                    <button className="buy-one-get-one__confirm">
                      Add Both to Cart
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductView;
