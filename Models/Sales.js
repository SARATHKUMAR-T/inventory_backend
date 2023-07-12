import mongoose from "mongoose";
const{ObjectId}=mongoose.Schema

const salesSchema=new mongoose.Schema({
    itemName:{
        type:String
    },
    quantity:{
        type:String
    },
    itemcode:{
        type:String
    },
    sellingDate:{
        type:String
    },
    customerName:{
        type:String
    },
    amountPaid:{
        type:String
    },
    user: {
        type: ObjectId,
        ref: "user",
      },
      sellingPrice:{
        type:String
      },
      remainingBalance:{
        type:String
      },
      totalAmount:{
        type:String
      }

})

export const Sales=mongoose.model("sales",salesSchema)