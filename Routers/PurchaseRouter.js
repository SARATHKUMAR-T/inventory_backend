import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { Purchase } from "../Models/Purchase.js";

export const purchaseRouter = express.Router();

purchaseRouter.post("/addpurchase", async (req, res) => {
  let token;
  try {
    const item = req.body;
    token = await req.headers["x-auth-token"];
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decode)
    const oldItem = await Purchase.findOne({ itemName: item.itemName });

    if (oldItem) {
      res.status(400).json({ message: "item already exists" });
    } else {
      const totalAmount =
        Number(item.quantity) * Number(item.purchasePrice).toString();
      const newPurchase = await new Purchase({
        ...item,
        totalAmount,
        user: decode.id,
      }).save();
      res.status(200).json({ message: "Purchase added successfully", newPurchase });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

purchaseRouter.get("/getpurchase", async (req, res) => {
  try {
    const token = await req.headers["x-auth-token"];
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const purchase = await Purchase.find({ user: decode.id });
    res.status(200).json({ message: "purchase fetched successfully", purchase });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});


purchaseRouter.put("/editpurchase/:id", async (req, res) => {
    try {
      const purchase = await Purchase.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { ...req.body } },
        { new: true }
      );
      res.status(200).json({ message: "sales updated successfully", purchase });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
  });
  
  purchaseRouter.delete("/deletepurchase/:id", async (req, res) => {
    try {
      const deletePurchase = await Purchase.findByIdAndDelete({ _id: req.params.id });
  
      if (!deletePurchase) {
        res.status(400).json({ message: "error occured" });
        return;
      }
      console.log(deletePurchase);
      res.status(200).json({ message: "Purchase Deleted Successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
  });
  
