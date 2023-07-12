import jwt from "jsonwebtoken";
import "dotenv/config";
import express from "express";
import { Customer } from "../Models/Customer.js";
import mongoose from "mongoose";

export const customerRouter = express.Router();

customerRouter.post("/addcustomer", async (req, res) => {
  try {
    const token = await req.headers["x-auth-token"];
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decode);
    const newCustomer = await new Customer({
      ...req.body,
      user: decode.id,
    }).save();
    res
      .status(200)
      .json({ message: "New Customer Added Successfully", newCustomer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

customerRouter.get("/getcustomers", async (req, res) => {
  try {
    const token = await req.headers["x-auth-token"];
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const customers = await Customer.find({ user: decode.id });
    res
      .status(200)
      .json({ message: "customers fetched successfully", customers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

customerRouter.put("/editcustomer/:id", async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { ...req.body } },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "customer updated successfully", customer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

customerRouter.delete('/deletecustomer/:id',async(req,res)=>{
  try {
    
    const deletedCustomer=await Customer.findByIdAndDelete({_id:req.params.id})
    
    if(!deletedCustomer){
      res.status(400).json({message:"error occured"})
      return
    }
    console.log(deletedCustomer)
    res.status(200).json({message:"Customer Deleted Successfully"})
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
})
