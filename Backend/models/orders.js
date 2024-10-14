const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const orderSchema=new Schema({
    user:{
        userId:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        }
    },
    products:[
        {
            productId:{
                type:Object,
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }
        }
    ],
    time:{
        type:Date,
        required:true
    }
})

const Order=mongoose.model("Order",orderSchema);

module.exports=Order;