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

  const [selectedLensType, setSelectedLensType] = useState("");
  const [selectedFrameColor, setSelectedFrameColor] = useState("");
  const [selectedPowerOption, setSelectedPowerOption] = useState("with-power");
  const [photochromaticOption, setPhotochromaticOption] = useState(false);
  const [selectedLensCategory, setSelectedLensCategory] =
    useState("Single Vision");
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
            lensOptions: [
              // Single Vision Lenses
              {
                id: "single-vision-uncoat",
                category: "Single Vision",
                name: "Uncoat Lens",
                price: 900,
                features: [],
                description: "Basic single vision lens for distance or reading",
              },
              {
                id: "single-vision-arc",
                category: "Single Vision",
                name: "Arc Coating Lens",
                price: 1300,
                features: ["Arc Coating", "Scratch Resistant Coating"],
                description: "Enhanced durability with anti-reflective coating",
              },
              {
                id: "single-vision-blue-cut",
                category: "Single Vision",
                name: "Blue Cut Lens",
                price: 1800,
                features: [
                  "Arc Coating",
                  "Scratch Resistant Coating",
                  "Blue Light Protection",
                ],
                description:
                  "Protection from harmful blue light from digital screens",
              },
              {
                id: "single-vision-high-index-blue",
                category: "Single Vision",
                name: "High Index Blue Cut Lens",
                price: 2800,
                features: [
                  "Arc Coating",
                  "Scratch Resistant Coating",
                  "Blue Light Protection",
                  "UV Protection",
                  "Thin and Strong Lens",
                ],
                description: "Premium thin lens with complete eye protection",
              },

              // Progressive Lenses
              {
                id: "progressive-uncoat",
                category: "Progressive",
                name: "Normal Corridor Uncoat Lens",
                price: 1900,
                features: ["Distance Near and Intermittent Vision"],
                description: "Basic progressive lens for all distances",
              },
              {
                id: "progressive-arc",
                category: "Progressive",
                name: "Normal Corridor Arc Lens",
                price: 2500,
                features: [
                  "Distance Near and Intermittent Vision",
                  "Double Side Arc",
                ],
                description: "Progressive lens with enhanced coating",
              },
              {
                id: "progressive-blue-cut",
                category: "Progressive",
                name: "Normal Corridor Blue Cut Lens",
                price: 3000,
                features: [
                  "Distance Near and Intermittent Vision",
                  "Double Side Arc",
                  "Blue Light Protection",
                  "UV Protection",
                ],
                description: "Progressive lens with blue light protection",
              },
              {
                id: "progressive-wide-corridor",
                category: "Progressive",
                name: "Wide Corridor Blue Cut Lens",
                price: 5000,
                features: [
                  "Distance Near and Intermittent Vision",
                  "Double Side Arc",
                  "Blue Light Protection",
                  "UV Protection",
                  "Wide Corridor",
                ],
                description:
                  "Premium progressive lens with wider field of view",
              },

              // Bifocal Lenses
              {
                id: "bifocal-uncoat",
                category: "Bifocal",
                name: "Bifocal Uncoat Lens",
                price: 1200,
                features: ["Distance and Near Vision"],
                description: "Basic bifocal lens for distance and reading",
              },
              {
                id: "bifocal-arc",
                category: "Bifocal",
                name: "Bifocal Arc Lens",
                price: 1600,
                features: ["Distance and Near Vision", "Double Side Arc"],
                description: "Bifocal lens with anti-reflective coating",
              },
              {
                id: "bifocal-blue-cut",
                category: "Bifocal",
                name: "Bifocal Blue Cut Lens",
                price: 2200,
                features: [
                  "Distance and Near Vision",
                  "Double Side Arc",
                  "Blue Light Protection",
                  "UV Protection",
                ],
                description: "Bifocal lens with blue light protection",
              },
              {
                id: "bifocal-high-index",
                category: "Bifocal",
                name: "High Index Bifocal Lens",
                price: 2800,
                features: [
                  "Distance and Near Vision",
                  "Double Side Arc",
                  "Blue Light Protection",
                  "UV Protection",
                  "Thin and Strong Lens",
                ],
                description:
                  "Premium thin bifocal lens with complete protection",
              },
            ],
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

          // Set default frame color based on product color
          if (foundProduct.color) {
            setSelectedFrameColor(foundProduct.color.toLowerCase());
          }
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
      const selectedLens = product.lensOptions.find(
        (lens) => lens.id === selectedLensType
      );
      const lensPrice = selectedLens ? selectedLens.price : 0;
      const photochromaticPrice = photochromaticOption ? 700 : 0;
      const totalLensPrice = lensPrice + photochromaticPrice;
      const totalPrice = product.price + totalLensPrice;

      // Prepare WhatsApp message
      const message = `🛒 *Add to Cart Request*

*Product Details:*
• Product: ${product.name}
• Frame Color: ${selectedFrameColor.toUpperCase()}
• Frame Price: ₹${product.price.toLocaleString()}

*Lens Selection:*
• Lens Type: ${selectedLens ? selectedLens.name : "Not Selected"}
• Lens Price: ₹${lensPrice.toLocaleString()}
${photochromaticOption ? "• Photochromatic: +₹700" : ""}
• Total Lens Price: ₹${totalLensPrice.toLocaleString()}

*Power Options:*
• Type: ${selectedPowerOption === "with-power" ? "With Power" : "Without Power"}
${
  selectedPowerOption === "with-power"
    ? `
*Prescription Details:*
• Right Eye: SPH ${prescription.rightEye.sph}, CYL ${prescription.rightEye.cyl}, AXIS ${prescription.rightEye.axis}
• Left Eye: SPH ${prescription.leftEye.sph}, CYL ${prescription.leftEye.cyl}, AXIS ${prescription.leftEye.axis}`
    : ""
}

*Quantity:* ${quantity}
*Total Price:* ₹${totalPrice.toLocaleString()}

Please confirm this order.`;

      // Redirect to WhatsApp
      const whatsappUrl = `https://wa.me/918879046890?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");

      setToast({
        isVisible: true,
        message: "Redirecting to WhatsApp...",
        type: "success",
      });
    } catch (error) {
      console.error("Error preparing WhatsApp message:", error);
      setToast({
        isVisible: true,
        message: "Failed to prepare WhatsApp message. Please try again.",
        type: "error",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    const selectedLens = product.lensOptions.find(
      (lens) => lens.id === selectedLensType
    );
    const lensPrice = selectedLens ? selectedLens.price : 0;
    const photochromaticPrice = photochromaticOption ? 700 : 0;
    const totalLensPrice = lensPrice + photochromaticPrice;
    const totalPrice = product.price + totalLensPrice;

    // Prepare WhatsApp message
    const message = `🛍️ *Buy Now Request*

*Product Details:*
• Product: ${product.name}
• Frame Color: ${selectedFrameColor.toUpperCase()}
• Frame Price: ₹${product.price.toLocaleString()}

*Lens Selection:*
• Lens Type: ${selectedLens ? selectedLens.name : "Not Selected"}
• Lens Price: ₹${lensPrice.toLocaleString()}
${photochromaticOption ? "• Photochromatic: +₹700" : ""}
• Total Lens Price: ₹${totalLensPrice.toLocaleString()}

*Power Options:*
• Type: ${selectedPowerOption === "with-power" ? "With Power" : "Without Power"}
${
  selectedPowerOption === "with-power"
    ? `
*Prescription Details:*
• Right Eye: SPH ${prescription.rightEye.sph}, CYL ${prescription.rightEye.cyl}, AXIS ${prescription.rightEye.axis}
• Left Eye: SPH ${prescription.leftEye.sph}, CYL ${prescription.leftEye.cyl}, AXIS ${prescription.leftEye.axis}`
    : ""
}

*Quantity:* ${quantity}
*Total Price:* ₹${totalPrice.toLocaleString()}

I want to buy this product now. Please process my order.`;

    // Redirect to WhatsApp
    const whatsappUrl = `https://wa.me/918879046890?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");

    setToast({
      isVisible: true,
      message: "Redirecting to WhatsApp for purchase...",
      type: "success",
    });
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

  const handleLensTypeChange = (lensId) => {
    // Toggle selection - if same lens is clicked, unselect it
    if (selectedLensType === lensId) {
      setSelectedLensType("");
    } else {
      setSelectedLensType(lensId);
    }
  };

  const handleLensCategoryChange = (category) => {
    setSelectedLensCategory(category);
    // Clear the selected lens type when switching categories
    setSelectedLensType("");
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
                {(() => {
                  // Define lens chart images
                  const lensChartImages = [
                    "/single_vision_lens_chart.jpeg",
                    "/progressive_lens_chart.jpeg",
                    "/bifocal_lens_chart.jpeg",
                  ];

                  // Check if selected index is for a lens chart
                  const productImageCount = product.images.length;
                  const isLensChartSelected =
                    selectedImageIndex >= productImageCount;

                  if (isLensChartSelected) {
                    // Show lens chart image
                    const lensChartIndex =
                      selectedImageIndex - productImageCount;
                    return (
                      <Image
                        src={lensChartImages[lensChartIndex]}
                        alt={`Lens Chart ${lensChartIndex + 1}`}
                        width={500}
                        height={500}
                        className={`product-view__main-image-img ${
                          isZoomed ? "product-view__main-image-img--zoomed" : ""
                        }`}
                        onClick={() => setIsZoomed(!isZoomed)}
                      />
                    );
                  } else {
                    // Show product image
                    return (
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
                    );
                  }
                })()}
                <button
                  className="product-view__zoom-btn"
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  {isZoomed ? "🔍-" : "🔍+"}
                </button>
              </div>

              <div className="product-view__thumbnails">
                {/* Product Images */}
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

                {/* Lens Chart Images - Always Show */}
                <button
                  className={`product-view__thumbnail ${
                    selectedImageIndex === product.images.length
                      ? "product-view__thumbnail--active"
                      : ""
                  }`}
                  onClick={() => setSelectedImageIndex(product.images.length)}
                >
                  <Image
                    src="/single_vision_lens_chart.jpeg"
                    alt="Single Vision Lens Chart"
                    width={80}
                    height={80}
                  />
                </button>

                <button
                  className={`product-view__thumbnail ${
                    selectedImageIndex === product.images.length + 1
                      ? "product-view__thumbnail--active"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedImageIndex(product.images.length + 1)
                  }
                >
                  <Image
                    src="/progressive_lens_chart.jpeg"
                    alt="Progressive Lens Chart"
                    width={80}
                    height={80}
                  />
                </button>

                <button
                  className={`product-view__thumbnail ${
                    selectedImageIndex === product.images.length + 2
                      ? "product-view__thumbnail--active"
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedImageIndex(product.images.length + 2)
                  }
                >
                  <Image
                    src="/bifocal_lens_chart.jpeg"
                    alt="Bifocal Lens Chart"
                    width={80}
                    height={80}
                  />
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="product-view__main-image">
                <Image
                  src="/single_vision_lens_chart.jpeg"
                  alt="Single Vision Lens Chart"
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
                {/* Lens Chart Images - Always Show */}
                <button
                  className={`product-view__thumbnail ${
                    selectedImageIndex === 0
                      ? "product-view__thumbnail--active"
                      : ""
                  }`}
                  onClick={() => setSelectedImageIndex(0)}
                >
                  <Image
                    src="/single_vision_lens_chart.jpeg"
                    alt="Single Vision Lens Chart"
                    width={80}
                    height={80}
                  />
                </button>

                <button
                  className={`product-view__thumbnail ${
                    selectedImageIndex === 1
                      ? "product-view__thumbnail--active"
                      : ""
                  }`}
                  onClick={() => setSelectedImageIndex(1)}
                >
                  <Image
                    src="/progressive_lens_chart.jpeg"
                    alt="Progressive Lens Chart"
                    width={80}
                    height={80}
                  />
                </button>

                <button
                  className={`product-view__thumbnail ${
                    selectedImageIndex === 2
                      ? "product-view__thumbnail--active"
                      : ""
                  }`}
                  onClick={() => setSelectedImageIndex(2)}
                >
                  <Image
                    src="/bifocal_lens_chart.jpeg"
                    alt="Bifocal Lens Chart"
                    width={80}
                    height={80}
                  />
                </button>
              </div>
            </>
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
            <div className="product-view__frame-price">
              <span className="product-view__price-label">Frame Price:</span>
              <span className="product-view__price">
                ₹{product.price?.toLocaleString()}
              </span>
            </div>

            {/* Show lens pricing */}
            {product.lensOptions && (
              <div className="product-view__lens-pricing">
                {selectedLensType ? (
                  (() => {
                    const selectedLens = product.lensOptions.find(
                      (lens) => lens.id === selectedLensType
                    );
                    if (selectedLens) {
                      const lensPrice = selectedLens.price;
                      const photochromaticPrice = photochromaticOption
                        ? 700
                        : 0;
                      const totalLensPrice = lensPrice + photochromaticPrice;
                      const totalPrice = product.price + totalLensPrice;

                      return (
                        <>
                          <div className="product-view__lens-price-row">
                            <span className="product-view__price-label">
                              Lens Price ({selectedLens.name}):
                            </span>
                            <span className="product-view__price">
                              ₹{lensPrice.toLocaleString()}
                            </span>
                          </div>
                          {photochromaticOption && (
                            <div className="product-view__lens-price-row">
                              <span className="product-view__price-label">
                                Photochromatic Features:
                              </span>
                              <span className="product-view__price">₹700</span>
                            </div>
                          )}
                          <div className="product-view__total-price">
                            <span className="product-view__price-label">
                              Total Price:
                            </span>
                            <span className="product-view__price product-view__price--total">
                              ₹{totalPrice.toLocaleString()}
                            </span>
                          </div>
                        </>
                      );
                    }
                  })()
                ) : (
                  <div className="product-view__lens-price-placeholder">
                    <span className="product-view__price-label">
                      Lens Price:
                    </span>
                    <span className="product-view__price-placeholder-text">
                      Select a lens option above
                    </span>
                  </div>
                )}
              </div>
            )}

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
              <h3>Lens Type Selection:</h3>
              <p className="product-view__lens-note">
                Choose your lens type based on your vision needs. Prices are for
                2 lenses.
              </p>

              {/* Category Tabs */}
              <div className="product-view__lens-category-tabs">
                {["Single Vision", "Progressive", "Bifocal"].map((category) => (
                  <button
                    key={category}
                    className={`product-view__lens-category-tab ${
                      selectedLensCategory === category
                        ? "product-view__lens-category-tab--active"
                        : ""
                    }`}
                    onClick={() => handleLensCategoryChange(category)}
                  >
                    {category} Lenses
                  </button>
                ))}
              </div>

              {/* Show lenses for selected category only */}
              {(() => {
                const categoryLenses = product.lensOptions.filter(
                  (lens) => lens.category === selectedLensCategory
                );
                if (categoryLenses.length === 0) return null;

                return (
                  <div className="product-view__lens-category">
                    <div className="product-view__lens-grid">
                      {categoryLenses.map((lens) => (
                        <div
                          key={lens.id}
                          className={`product-view__lens-option ${
                            selectedLensType === lens.id
                              ? "product-view__lens-option--active"
                              : ""
                          }`}
                          onClick={() => handleLensTypeChange(lens.id)}
                        >
                          <div className="product-view__lens-header">
                            <h5>{lens.name}</h5>
                            <span className="product-view__lens-price">
                              ₹{lens.price.toLocaleString()}
                            </span>
                          </div>
                          <p className="product-view__lens-description">
                            {lens.description}
                          </p>
                          {lens.features && lens.features.length > 0 && (
                            <div className="product-view__lens-features">
                              <span className="features-label">Features:</span>
                              <ul>
                                {lens.features.map((feature, index) => (
                                  <li key={index}>✓ {feature}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Photochromatic Add-on */}
              <div className="product-view__photochromatic-option">
                <label className="product-view__checkbox-label">
                  <input
                    type="checkbox"
                    checked={photochromaticOption}
                    onChange={(e) => setPhotochromaticOption(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Add Photochromatic Features (+₹700)
                  <small>(Lenses that automatically darken in sunlight)</small>
                </label>
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
              onClick={() => {
                const selectedLens = product.lensOptions.find(
                  (lens) => lens.id === selectedLensType
                );
                const lensPrice = selectedLens ? selectedLens.price : 0;
                const photochromaticPrice = photochromaticOption ? 700 : 0;
                const totalLensPrice = lensPrice + photochromaticPrice;
                const totalPrice = product.price + totalLensPrice;

                // Prepare WhatsApp message for Buy 1 Get 1
                const message = `🎁 *Buy 1 Get 1 Free Inquiry*

*Product Details:*
• Product: ${product.name}
• Frame Color: ${selectedFrameColor.toUpperCase()}
• Frame Price: ₹${product.price.toLocaleString()}

*Lens Selection:*
• Lens Type: ${selectedLens ? selectedLens.name : "Not Selected"}
• Lens Price: ₹${lensPrice.toLocaleString()}
${photochromaticOption ? "• Photochromatic: +₹700" : ""}
• Total Lens Price: ₹${totalLensPrice.toLocaleString()}

*Power Options:*
• Type: ${selectedPowerOption === "with-power" ? "With Power" : "Without Power"}
${
  selectedPowerOption === "with-power"
    ? `
*Prescription Details:*
• Right Eye: SPH ${prescription.rightEye.sph}, CYL ${prescription.rightEye.cyl}, AXIS ${prescription.rightEye.axis}
• Left Eye: SPH ${prescription.leftEye.sph}, CYL ${prescription.leftEye.cyl}, AXIS ${prescription.leftEye.axis}`
    : ""
}

*Quantity:* ${quantity}
*Total Price:* ₹${totalPrice.toLocaleString()}

I'm interested in the Buy 1 Get 1 Free offer for this product. Please provide available options.`;

                // Redirect to WhatsApp
                const whatsappUrl = `https://wa.me/918879046890?text=${encodeURIComponent(
                  message
                )}`;
                window.open(whatsappUrl, "_blank");

                setToast({
                  isVisible: true,
                  message: "Redirecting to WhatsApp for Buy 1 Get 1 inquiry...",
                  type: "success",
                });
              }}
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
              <button
                className="buy-one-get-one__confirm"
                onClick={() => {
                  const selectedLens = product.lensOptions.find(
                    (lens) => lens.id === selectedLensType
                  );
                  const lensPrice = selectedLens ? selectedLens.price : 0;
                  const photochromaticPrice = photochromaticOption ? 700 : 0;
                  const totalLensPrice = lensPrice + photochromaticPrice;
                  const totalPrice = product.price + totalLensPrice;

                  // Prepare WhatsApp message for Buy 1 Get 1
                  const message = `🎁 *Buy 1 Get 1 Free Request*

*Primary Product:*
• Product: ${product.name}
• Frame Color: ${selectedFrameColor.toUpperCase()}
• Frame Price: ₹${product.price.toLocaleString()}

*Lens Selection:*
• Lens Type: ${selectedLens ? selectedLens.name : "Not Selected"}
• Lens Price: ₹${lensPrice.toLocaleString()}
${photochromaticOption ? "• Photochromatic: +₹700" : ""}
• Total Lens Price: ₹${totalLensPrice.toLocaleString()}

*Power Options:*
• Type: ${selectedPowerOption === "with-power" ? "With Power" : "Without Power"}
${
  selectedPowerOption === "with-power"
    ? `
*Prescription Details:*
• Right Eye: SPH ${prescription.rightEye.sph}, CYL ${prescription.rightEye.cyl}, AXIS ${prescription.rightEye.axis}
• Left Eye: SPH ${prescription.leftEye.sph}, CYL ${prescription.leftEye.cyl}, AXIS ${prescription.leftEye.axis}`
    : ""
}

*Free Product:*
• Product: ${selectedSecondProduct.name}
• Original Price: ₹${selectedSecondProduct.price.toLocaleString()}

*Quantity:* ${quantity}
*You Pay:* ₹${product.price.toLocaleString()}
*You Save:* ₹${selectedSecondProduct.price.toLocaleString()}
*Total Value:* ₹{(product.price + selectedSecondProduct.price).toLocaleString()}

I want to avail the Buy 1 Get 1 Free offer. Please confirm my order.`;

                  // Redirect to WhatsApp
                  const whatsappUrl = `https://wa.me/918879046890?text=${encodeURIComponent(
                    message
                  )}`;
                  window.open(whatsappUrl, "_blank");

                  setToast({
                    isVisible: true,
                    message: "Redirecting to WhatsApp for Buy 1 Get 1 offer...",
                    type: "success",
                  });

                  setShowBuyOneGetOneModal(false);
                }}
              >
                Order via WhatsApp
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
