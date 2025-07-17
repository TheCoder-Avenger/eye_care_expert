import mongoose from "mongoose";

const lensTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true,
  },
  sub_options: [
    {
      type: String,
      trim: true,
    },
  ],
});

const productSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand_name: {
      type: String,
      required: true,
      trim: true,
      default: "eye care expert",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    actual_price: {
      type: Number,
      required: true,
      min: 0,
    },
    discounted_percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    discounted_price: {
      type: Number,
      min: 0,
    },
    size: {
      type: String,
      required: true,
      trim: true,
    },
    general_size: {
      type: String,
      enum: ["SMALL", "MEDIUM", "LARGE", "NARROW"],
      required: true,
    },
    dimensions: {
      type: String,
      required: true,
      trim: true,
    },
    material: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    shape: {
      type: String,
      required: true,
      trim: true,
    },
    frame_type: {
      type: String,
      trim: true,
    },
    available_lens_types: [lensTypeSchema],
    buy_1_get_1_available: {
      type: Boolean,
      default: false,
    },
    is_popular: {
      type: Boolean,
      default: false,
    },
    best_seller: {
      type: Boolean,
      default: false,
    },
    quantity: {
      type: Number,
      default: 100,
      min: 0,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
