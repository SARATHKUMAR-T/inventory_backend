import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const purchaseSchema = new mongoose.Schema({
  itemName: {
    type: String,
    requried: true,
  },
  quantity: {
    type: String,
  },
  purchasePrice: {
    type: String,
  },
  manufacturer: {
    type: String,
  },
  purchaseDate: {
    type: String,
  },
  user: {
    type: ObjectId,
    ref: "user",
  },
  totalAmount: {
    type: String,
  },
  itemcode: {
    type: String,
  },
  contact: {
    type: String,
  },
});

export const Purchase = mongoose.model("purchase", purchaseSchema);
