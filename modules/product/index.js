"use client";

import { useState, useEffect } from "react";
import PlaceholderImage from "@components/PlaceholderImage";
import Modal from "@components/Modal";
import Toast from "@components/Toast";
import { useUser } from "@/context/UserContext";
import "./style.scss";
import Image from "next/image";

const ProductView = ({ slug }) => {
  const { addToCart } = useUser();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const [selectedLensType, setSelectedLensType] = useState("single-vision");
  const [selectedFrameColor, setSelectedFrameColor] = useState("black");
  const [selectedPowerOption, setSelectedPowerOption] = useState("with-power");
  const [prescription, setPrescription] = useState({
    rightEye: { sph: "", cyl: "", axis: "" },
    leftEye: { sph: "", cyl: "", axis: "" },
  });

  const [showBuyOneGetOneModal, setShowBuyOneGetOneModal] = useState(false);
  const [selectedSecondProduct, setSelectedSecondProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // const response = await fetch(`/api/products/${slug}`);

        // if (!response.ok) {
        //   throw new Error("Failed to fetch product");
        // }

        // const data = await response.json();

        const productsData = await import("@/models/products.json");
        const allProducts = productsData.default;

        const foundProduct = allProducts.find(
          (product) =>
            product.product_id === slug ||
            product.product_id.toString() === slug ||
            product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug
        );

        if (foundProduct) {
          // Transform local data to match component expectations
          const transformedProduct = {
            id: foundProduct.product_id,
            name: foundProduct.name,
            brand: foundProduct.brand_name,
            price: foundProduct.price || foundProduct.actual_price,
            originalPrice: foundProduct.actual_price,
            discount: foundProduct.discounted_percentage || 0,
            description: foundProduct.description,
            images:
              foundProduct.images && foundProduct.images.length > 0
                ? foundProduct.images.map((img) =>
                    img.includes("drive.google.com") &&
                    !img.includes("uc?export=view")
                      ? img
                          .replace("/view?usp=sharing", "")
                          .replace("/view", "")
                          .replace(
                            "https://drive.google.com/file/d/",
                            "https://drive.google.com/uc?export=view&id="
                          )
                          .replace("/view", "")
                      : img
                  )
                : [],
            colors: [
              {
                name: foundProduct.color,
                code: getColorCode(foundProduct.color),
                available: foundProduct.quantity > 0,
              },
            ],
            lensOptions:
              foundProduct.available_lens_types &&
              foundProduct.available_lens_types.length > 0
                ? foundProduct.available_lens_types.map((lensType, index) => ({
                    id: lensType.type.toLowerCase().replace(/ /g, "-"),
                    name: lensType.type,
                    price: index * 500, // Different prices for different lens types
                    description: `${lensType.type} lens${
                      lensType.sub_options && lensType.sub_options.length > 0
                        ? ` with options: ${lensType.sub_options.join(", ")}`
                        : ""
                    }`,
                  }))
                : [],
            buyOneGetOneProducts:
              foundProduct.buy_1_get_1_available &&
              foundProduct.images &&
              foundProduct.images.length > 0
                ? [
                    {
                      id: "related-1",
                      name: `${foundProduct.shape} Frame`,
                      price: Math.round(foundProduct.actual_price * 0.8),
                      image: foundProduct.images[0],
                    },
                  ]
                : [],
            // Add original product data for reference
            originalData: foundProduct,
          };

          setProduct(transformedProduct);
        } else {
          throw new Error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // Helper function to get color codes
  const getColorCode = (colorName) => {
    const colorMap = {
      black: "#000000",
      brown: "#8B4513",
      gold: "#FFD700",
      silver: "#C0C0C0",
      blue: "#0066CC",
      purple: "#800080",
      gray: "#808080",
      grey: "#808080",
      tortoise: "#8B4513",
      gunmetal: "#2C3539",
      red: "#DC143C",
      green: "#228B22",
      white: "#FFFFFF",
      transparent: "#F5F5F5",
      clear: "#F8F8FF",
      navy: "#000080",
      maroon: "#800000",
      olive: "#808000",
      orange: "#FFA500",
      pink: "#FFC0CB",
      yellow: "#FFFF00",
      cyan: "#00FFFF",
      magenta: "#FF00FF",
      lime: "#00FF00",
    };
    const normalizedColor = colorName.toLowerCase().trim();
    return colorMap[normalizedColor] || "#666666";
  };

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);

    try {
      const result = await addToCart(product, {
        lensType: selectedLensType,
        frameColor: selectedFrameColor,
        powerOption: selectedPowerOption,
        prescription:
          selectedPowerOption === "with-power" ? prescription : null,
        quantity,
      });

      if (result.success) {
        setToast({
          isVisible: true,
          message: "Product added to cart successfully!",
          type: "success",
        });
      } else {
        setToast({
          isVisible: true,
          message: "Failed to add product to cart. Please try again.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setToast({
        isVisible: true,
        message: "Failed to add product to cart. Please try again.",
        type: "error",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
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
        <div className="product-view__gallery">
          {product.images && product.images.length > 0 ? (
            <>
              <div className="product-view__main-image">
                <Image
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  width={500}
                  height={500}
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
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      width={80}
                      height={80}
                    />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="product-view__no-image">
              <div className="product-view__placeholder">
                <h3>No Images Available</h3>
                <p>Product images will be added soon.</p>
              </div>
            </div>
          )}
        </div>

        <div className="product-view__details">
          <div className="product-view__header">
            <h1 className="product-view__title">
              {product?.name.toUpperCase()}
            </h1>
            <p className="product-view__brand">{product?.description}</p>
          </div>

          <div className="product-view__pricing">
            <span className="product-view__price">
              ₹{product.price?.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="product-view__original-price">
                  ₹{product.originalPrice?.toLocaleString()}
                </span>
                <span className="product-view__discount">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>

          {product.originalData && (
            <div className="product-view__specs">
              <h3>Specifications:</h3>
              <div className="product-view__specs-grid">
                <div className="product-view__spec">
                  <strong>Product ID:</strong> {product.originalData.product_id}
                </div>
                <div className="product-view__spec">
                  <strong>Frame Type:</strong> {product.originalData.frame_type}
                </div>
                <div className="product-view__spec">
                  <strong>Material:</strong> {product.originalData.material}
                </div>
                <div className="product-view__spec">
                  <strong>Shape:</strong> {product.originalData.shape}
                </div>
                <div className="product-view__spec">
                  <strong>Size:</strong> {product.originalData.general_size} (
                  {product.originalData.dimensions})
                </div>
                <div className="product-view__spec">
                  <strong>Quantity Available:</strong>{" "}
                  {product.originalData.quantity}
                </div>
                {product.originalData.buy_1_get_1_available && (
                  <div className="product-view__spec product-view__spec--highlight">
                    <strong>🎁 Buy 1 Get 1 Free Available!</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {product.description && (
            <div className="product-view__description">
              <p>{product.description}</p>
            </div>
          )}

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

          {product.lensOptions && product.lensOptions.length > 0 && (
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
          )}

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

      <Modal
        isOpen={showBuyOneGetOneModal}
        onClose={() => setShowBuyOneGetOneModal(false)}
        title="Buy 1 Get 1 Free - Choose Your Second Product"
        size="large"
      >
        <div className="buy-one-get-one">
          <div className="buy-one-get-one__selected">
            <h4>Selected Product:</h4>
            <div className="buy-one-get-one__product">
              <Image
                src={product.images[0]}
                alt={product.name}
                width={80}
                height={80}
              />
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
                  <Image
                    src={freeProduct.image}
                    alt={freeProduct.name}
                    width={120}
                    height={120}
                  />
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
                  Total Value: ₹{product.price + selectedSecondProduct.price}
                </h4>
              </div>
              <button className="buy-one-get-one__confirm">
                Add Both to Cart
              </button>
            </div>
          )}
        </div>
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default ProductView;
