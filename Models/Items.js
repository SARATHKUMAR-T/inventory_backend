import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    requried: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  purchasePrice: {
    type: String,
  },
  salesPrice: {
    type: String,
  },
  purchaseDate: {
    type: String,
  },
  user: {
    type: ObjectId,
    ref: "user",
  },
  itemcode: {
    type: String,
  },
});

export const Item = mongoose.model("Item", itemSchema);
