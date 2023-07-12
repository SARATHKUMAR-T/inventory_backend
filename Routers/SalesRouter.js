import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { Sales } from "../Models/Sales.js";

export const salesRouter = express.Router();

salesRouter.post("/addsales", async (req, res) => {
  let token;
  try {
    const sale = req.body;
    token = await req.headers["x-auth-token"];
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decode)
    const oldItem = await Sales.findOne({ itemName: sale.itemName });

    if (oldItem) {
      res.status(400).json({ message: "sale already exists" });
    } else {
      const totalAmount =
        Number(sale.quantity) * Number(sale.sellingPrice).toString();
      const remainingBalance =
        Number(totalAmount) - Number(sale.amountPaid).toString();
      console.log(totalAmount, remainingBalance);
      const newSale = await new Sales({
        ...sale,
        totalAmount,
        remainingBalance,
        user: decode.id,
      }).save();
      res.status(200).json({ message: "Sales added successfully", newSale });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

salesRouter.get("/getsales", async (req, res) => {
  try {
    const token = await req.headers["x-auth-token"];
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const sales = await Sales.find({ user: decode.id });
    res.status(200).json({ message: "sales fetched successfully", sales });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});


salesRouter.put("/editsales/:id", async (req, res) => {
    try {
      const sale = await Sales.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { ...req.body } },
        { new: true }
      );
      res.status(200).json({ message: "sales updated successfully", sale });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
  });
  
  salesRouter.delete("/deletesales/:id", async (req, res) => {
    try {
      const deleteSale = await Sales.findByIdAndDelete({ _id: req.params.id });
  
      if (!deleteSale) {
        res.status(400).json({ message: "error occured" });
        return;
      }
      console.log(deleteSale);
      res.status(200).json({ message: "Sales Deleted Successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "internal server error" });
    }
  });
  
