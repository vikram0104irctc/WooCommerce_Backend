import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    regular_price: { type: Number, required: true },
    sale_price: { type: Number, required: true },
    stock_status: { type: String, required: true },
    stock_quantity: { type: Number, default: null },
    category: { type: String },
    tags: { type: [String], default: [] },
    on_sale: { type: Boolean },
    created_at: { type: Date },
    average_rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
