import express from "express";
import { Item } from "../Models/Items.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const ItemRouter = express.Router();

ItemRouter.post("/additem", async (req, res) => {
  let token;
  try {
    const item = req.body;
    token = await req.headers["x-auth-token"];
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const oldItem = await Item.findOne({ itemName: item.itemName });

    if (oldItem) {
      res.status(400).json({ message: "item already exists" });
    } else {
      const newItem = await new Item({
        ...item,
        user: decode.id,
      }).save();
      res.status(200).json({ message: "new item added successfully", newItem });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

ItemRouter.get("/getitems", async (req, res) => {
  try {
    const token = await req.headers["x-auth-token"];
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const items = await Item.find({ user: decode.id });
    res.status(200).json({ message: "items fetched successfully", items });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

ItemRouter.put("/edititem/:id", async (req, res) => {
  try {
    const item = await Item.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );
    res.status(200).json({ message: "item updated successfully", item });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

ItemRouter.delete("/deleteitem/:id", async (req, res) => {
  try {
    const deleteItem = await Item.findByIdAndDelete({ _id: req.params.id });

    if (!deleteItem) {
      res.status(400).json({ message: "error occured" });
      return;
    }
    console.log(deleteItem);
    res.status(200).json({ message: "Item Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});
