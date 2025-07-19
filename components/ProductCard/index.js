import Image from "next/image";
import { useRouter } from "next/navigation";
import "./style.scss";

const ProductCard = ({ product }) => {
  const router = useRouter();

  // Format price in Indian Rupees
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Handle view product - navigate to product detail page
  const handleViewProduct = () => {
    // Use product_id or _id depending on which is available
    const productId = product.product_id || product._id;
    router.push(`/product/${productId}`);
  };

  return (
    <div className="product-card">
      <div className="product-card__image">
        {product.images && product.images.length > 0 && product.images[0] ? (
          <Image
            src={product.images[0]}
            width={350}
            height={250}
            alt={product.name}
          />
        ) : (
          <div className="product-card__no-image">
            <span>Image Not Available</span>
          </div>
        )}
        {product.buy_1_get_1_available && (
          <div className="product-card__badge">Buy 1 Get 1</div>
        )}
        {product.best_seller && (
          <div className="product-card__badge best-seller">Best Seller</div>
        )}
      </div>

      <div className="product-card__content">
        <h3 className="product-card__title">{product?.name?.toUpperCase()}</h3>
        <p className="product-card__description">
          {product.description.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description}
        </p>

        <div className="product-card__details">
          <div className="detail-row">
            <span className="detail-label">Shape:</span>
            <span className="detail-value">{product.shape}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Material:</span>
            <span className="detail-value">{product.material}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Color:</span>
            <span className="detail-value">{product.color}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Size:</span>
            <span className="detail-value">{product.size}</span>
          </div>
        </div>

        <div className="product-card__lens-types">
          <h4>Available Lens Types:</h4>
          <div className="lens-types-list">
            {product.available_lens_types.map((lensType, index) => (
              <span key={index} className="lens-type-tag">
                {lensType.type}
              </span>
            ))}
          </div>
        </div>

        <div className="product-card__footer">
          <div className="product-card__price">
            {product.actual_price && product.price < product.actual_price ? (
              <>
                <span className="discounted-price">
                  {formatPrice(product.price)}
                </span>
                <span className="actual-price strikethrough">
                  {formatPrice(product.actual_price)}
                </span>
                {product.discounted_percentage > 0 && (
                  <span className="discount-badge">
                    -{product.discounted_percentage}%
                  </span>
                )}
              </>
            ) : (
              <span>{formatPrice(product.price)}</span>
            )}
          </div>
          <button
            className="product-card__view-product"
            onClick={handleViewProduct}
          >
            View Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
