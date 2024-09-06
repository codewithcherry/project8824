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
        let updatedCart={items:[{productId:new mongodb.ObjectId(product._id),quantity:1}]}
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