import "./style.scss";

const PlaceholderImage = ({
  width = 400,
  height = 400,
  text = "Product Image",
}) => {
  return (
    <div
      className="placeholder-image"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {text}
    </div>
  );
};

export default PlaceholderImage;
