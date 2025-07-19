const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Function to convert Google Drive URL to direct image URL
function convertGoogleDriveUrl(url) {
  if (url.includes("drive.google.com/file/d/")) {
    const fileId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileId) {
      return `https://drive.google.com/uc?export=view&id=${fileId[1]}`;
    }
  }
  return url;
}

// Path to the Excel file
const excelFilePath = path.join(__dirname, "../models/ece_products.xlsx");
const outputJsonPath = path.join(__dirname, "../models/products.json");

// Read the Excel file
const workbook = XLSX.readFile(excelFilePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

// Track used product IDs to avoid duplicates
const usedProductIds = new Set();

// Map Excel columns to Product schema
const products = rows.map((row, idx) => {
  // Generate unique product_id
  let productId = String(row["pid"] || row["no"] || idx + 1);

  // If product_id already exists, append suffix
  if (usedProductIds.has(productId)) {
    let counter = 1;
    let newProductId = `${productId}_${counter}`;
    while (usedProductIds.has(newProductId)) {
      counter++;
      newProductId = `${productId}_${counter}`;
    }
    productId = newProductId;
  }

  usedProductIds.add(productId);

  // Fix image fields - split comma-separated URLs and convert Google Drive URLs
  let imageField = row["image"] || "";
  let imageArray = [];

  if (imageField) {
    imageArray = imageField
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.length > 0)
      .map((url) => convertGoogleDriveUrl(url));
  }

  // New pricing logic: All frames are 1200 for 2 frames (Buy 1 Get 1)
  const actualPrice = 2000; // Price for 2 frames
  const discountedPrice = 1200; // Discounted price for 2 frames
  const discountPercentage = Math.round(
    ((actualPrice - discountedPrice) / actualPrice) * 100
  );

  // Determine if product is out of stock based on image availability
  const hasImages = imageArray.length > 0;
  const outOfStock = !hasImages;

  // Map general size properly from Excel data
  let generalSize = (row["general size"] || "").toString().toUpperCase().trim();

  // If general_size is empty, try to infer from size dimensions
  if (!generalSize && row["size"]) {
    const size = row["size"].toString();
    const firstNumber = parseInt(size.split(/[\/\-\s]/)[0]);

    if (firstNumber) {
      if (firstNumber <= 48) {
        generalSize = "SMALL";
      } else if (firstNumber <= 52) {
        generalSize = "MEDIUM";
      } else if (firstNumber <= 56) {
        generalSize = "LARGE";
      } else {
        generalSize = "NARROW";
      }
    } else {
      generalSize = "MEDIUM"; // Default fallback
    }
  }

  // Ensure general_size is one of the valid enum values
  const validGeneralSizes = ["SMALL", "MEDIUM", "LARGE", "NARROW"];
  if (!validGeneralSizes.includes(generalSize)) {
    generalSize = "MEDIUM"; // Default fallback
  }

  return {
    product_id: productId,
    name: row["brand name"] || "Eye Care Expert Frame",
    brand_name: row["brand name"] || "eye care expert",
    description: `High-quality ${row["shape"] || "eyewear"} frame made from ${
      row["material"] || "premium materials"
    }. Available in ${row["colour"] || "various colors"}.`,
    images: imageArray,
    price: discountedPrice, // 1200 for 2 frames
    actual_price: actualPrice, // 2000 for 2 frames
    discounted_percentage: discountPercentage, // 40%
    discounted_price: discountedPrice, // Same as price
    size: row["size"] || "",
    general_size: generalSize,
    dimensions: row["size"] || "",
    material: row["material"] || "",
    color: row["colour"] || "",
    shape: row["shape"] || "",
    frame_type: row["frame type"] || "",
    available_lens_types: [
      {
        type: "Single Vision",
        sub_options: ["Anti-Glare", "Blue Light Protection"],
      },
      {
        type: "Progressive",
        sub_options: ["Anti-Glare", "Photochromic"],
      },
      {
        type: "Bifocal",
        sub_options: ["Anti-Glare"],
      },
    ],
    buy_1_get_1_available: true, // All products have Buy 1 Get 1 offer
    is_popular: (row["best saler"] || "")
      .toString()
      .toLowerCase()
      .includes("true"),
    best_seller: (row["best saler"] || "")
      .toString()
      .toLowerCase()
      .includes("true"),
    quantity: outOfStock ? 0 : 100, // Set quantity to 0 if out of stock
    out_of_stock: outOfStock, // Mark as out of stock if no images
  };
});

fs.writeFileSync(outputJsonPath, JSON.stringify(products, null, 2));
console.log(
  `Converted ${products.length} products to JSON at ${outputJsonPath}`
);
console.log(`Unique product IDs generated: ${usedProductIds.size}`);
