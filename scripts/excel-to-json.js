const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

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

  return {
    product_id: productId,
    name: row["brand name"] || "",
    brand_name: row["brand name"] || "",
    description: "",
    images: row["image"] ? [row["image"]] : [],
    image_url: row["image"] || "",
    price: Number(row["discounted price"]) || 0,
    actual_price: Number(row["actual price"]) || 0,
    discounted_percentage: Number(row["discounted percentage"]) || 0,
    discounted_price: Number(row["discounted price"]) || 0,
    size: row["size"] || "",
    general_size: (row["general size"] || "").toUpperCase(),
    dimensions: row["size"] || "",
    material: row["material"] || "",
    color: row["colour"] || "",
    shape: row["shape"] || "",
    frame_type: "",
    available_lens_types: [],
    buy_1_get_1_available: (row["best saler"] || "")
      .toString()
      .toLowerCase()
      .includes("true"),
    is_popular: (row["best saler"] || "")
      .toString()
      .toLowerCase()
      .includes("true"),
    best_seller: (row["best saler"] || "")
      .toString()
      .toLowerCase()
      .includes("true"),
    quantity: 100,
  };
});

fs.writeFileSync(outputJsonPath, JSON.stringify(products, null, 2));
console.log(
  `Converted ${products.length} products to JSON at ${outputJsonPath}`
);
console.log(`Unique product IDs generated: ${usedProductIds.size}`);
