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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    size: {
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
      required: true,
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
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
