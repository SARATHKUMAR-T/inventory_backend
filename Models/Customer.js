import mongoose from "mongoose";

const {ObjectId} = mongoose.Schema

const customerSchema=new mongoose.Schema({
    customerName:{
        type:String,
        required:true
    },
    contactNumber:{
        type:String,
        required:true
    },
    companyName:{
      type:String,
      required:true
    },
    address:{
        type:String,
        required:true
    },
    user : {
        type : ObjectId,
        ref : "user"
       }
})


export const Customer=mongoose.model('customer',customerSchema)