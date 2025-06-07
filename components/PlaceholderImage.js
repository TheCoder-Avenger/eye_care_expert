const PlaceholderImage = ({
  width = 400,
  height = 400,
  text = "Product Image",
}) => {
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: "#f0f0f0",
        border: "2px dashed #ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#999",
        fontSize: "16px",
        fontWeight: "500",
        textAlign: "center",
        borderRadius: "8px",
      }}
    >
      {text}
    </div>
  );
};

export default PlaceholderImage;
