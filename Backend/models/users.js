const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const userSchema=new Schema({
    username:{
        type:String,
        required:true
    },
    useremail:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    cart:{
        items:[{productId:
            {
                type:Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },
            quantity:{
                type:Number,
                required:true
            }
        }]

    },
    resetToken:{
        type:String
    },
    tokenExpiryTime:{
        type:Date
        
    }
})

userSchema.methods.addToCart=function (product){
        let cartProductIndex=this.cart.items.findIndex(p=> p.productId.toString()==product._id.toString())
        let newQuantity=1;
        let updatedCartItems=[...this.cart.items]
        let updatedCart=this.cart
        if(cartProductIndex>=0){
            newQuantity=updatedCartItems[cartProductIndex].quantity+1;
            updatedCartItems[cartProductIndex].quantity=newQuantity;
            updatedCart={items:updatedCartItems}
        }
        else{
            updatedCartItems.push(
                {
                    productId:product._id,
                    quantity:newQuantity
                }
            )
            updatedCart={items:updatedCartItems}
        }
        this.cart=updatedCart;
        return this.save();

}

userSchema.methods.deleteItemFromCart=function(productID){
      
        const updatedCartItems=this.cart.items.filter(product=>{
            return product.productId.toString()!==productID.toString();
        });

        this.cart.items=updatedCartItems;

        return this.save();   
}

userSchema.methods.clearCart=function(){
    this.cart={items:[]}
    this.save();
}

const User=mongoose.model("User",userSchema);

module.exports=User;
// const {getDb}=require('../utils/db');
// const mongodb=require('mongodb');

// class User{
//     constructor(id,userName,email,cart){
//         this._id=id;
//         this.userName=userName;
//         this.email=email;
//         this.cart=cart;
//     }

//     createNewUser(){
//         let db=getDb()
//         return db.collection("users").insertOne(this);
//     }

//     addToCart(product){
//         let cartProductIndex=this.cart.items.findIndex(p=> p.productId.toString()==product._id.toString())
//         let newQuantity=1;
//         let updatedCartItems=[...this.cart.items]
//         let updatedCart=this.cart
//         if(cartProductIndex>=0){
//             newQuantity=updatedCartItems[cartProductIndex].quantity+1;
//             updatedCartItems[cartProductIndex].quantity=newQuantity;
//             updatedCart={items:updatedCartItems}
//         }
//         else{
//             updatedCartItems.push({productId:new mongodb.ObjectId(product._id),quantity:newQuantity})
//             updatedCart={items:updatedCartItems}
//         }
       
//         let db=getDb()
//         return db
//         .collection("users")
//         .updateOne(
//             {_id:new mongodb.ObjectId(this._id)},
//             {$set:{cart:updatedCart}}
//         );
//     }

//     deleteItemFromCart(productID){
//         let updatedCartItems=[...this.cart.items]
//         updatedCartItems=updatedCartItems.filter(product=>{
//             return product.productId.toString()!==productID.toString();
//         })

//         let db=getDb()
//             return db.collection("users")
//                 .updateOne(
//                     { _id:new mongodb.ObjectId(this._id )},
//                     {$set:{cart:{items:updatedCartItems}}}
//                 )
//     }

//     getCart() {
//         const db = getDb();
        
//         // Get the list of product IDs in the cart
//         const productIds = this.cart.items.map(item => item.productId);
        
//         // Fetch all products in the cart from the products collection
//         return db
//             .collection('products')
//             .find({ _id: { $in: productIds } }) // Find products whose _id is in the cart
//             .toArray()
//             .then(products => {
//                 return products.map(product => {
//                     // Find the quantity of the current product from the user's cart
//                     const cartItem = this.cart.items.find(item => {
//                         return item.productId.toString() === product._id.toString();
//                     });
//                     return { ...product, quantity: cartItem.quantity };
//                 });
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     addToOrders(){
//         const db=getDb();
//         return this.getCart().then(products=>{
//             const orders={
//                 user:{
//                     username:this.userName,
//                     userEmail:this.email,
//                     userid:new mongodb.ObjectId(this._id)
//                 },
//                 items:products
//             }
//             return db.collection("orders")
//                      .insertOne(orders)
//         })
//         .then(result=>{
//             return db.collection("users")
//                                  .updateOne(
//                                     {_id:new mongodb.ObjectId(this._id)},
//                                     {$set:{cart:{items:[]}}}
//                                  )
//         })
//     }

//     getOrders(){
//         const db=getDb();
//         return db.collection("orders")
//                  .find({'user.userid':new mongodb.ObjectId(this._id)})
//                  .toArray();
//     }

//     static findUserbyId(uid){
//         let db=getDb();

//         return db.collection("users").findOne({_id:new mongodb.ObjectId(uid)})
//                 .then(user=>{
//                     console.log("user found");
//                     return user;
                    
//                 })
//                 .catch(err=>{
//                     console.log(err);
//                 })
//     }
// }

// module.exports=User;