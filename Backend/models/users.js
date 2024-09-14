const {getDb}=require('../utils/db');
const mongodb=require('mongodb');

class User{
    constructor(id,userName,email,cart){
        this._id=id;
        this.userName=userName;
        this.email=email;
        this.cart=cart;
    }

    createNewUser(){
        let db=getDb()
        return db.collection("users").insertOne(this);
    }

    addToCart(product){
        let cartProductIndex=this.cart.items.findIndex(p=> p.productId.toString()==product._id.toString())
        let newQuantity=1;
        let updatedCartItems=[...this.cart.items]
        let updatedCart=this.cart
        if(cartProductIndex>=0){
            newQuantity=newQuantity+1;
            updatedCartItems[cartProductIndex].quantity=newQuantity;
            updatedCart={items:updatedCartItems}
        }
        else{
            updatedCartItems.push({productId:new mongodb.ObjectId(product._id),quantity:newQuantity})
            updatedCart={items:updatedCartItems}
        }
       
        let db=getDb()
        return db
        .collection("users")
        .updateOne(
            {_id:new mongodb.ObjectId(this._id)},
            {$set:{cart:updatedCart}}
        );
    }

    static findUserbyId(uid){
        let db=getDb();

        return db.collection("users").findOne({_id:new mongodb.ObjectId(uid)})
                .then(user=>{
                    console.log("user found");
                    return user;
                    
                })
                .catch(err=>{
                    console.log(err);
                })
    }
}

module.exports=User;