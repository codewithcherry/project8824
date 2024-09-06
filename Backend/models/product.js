const Cart=require('./cart')
const mongodb=require('mongodb')
const {getDb}=require("../utils/db");

class Product {
    constructor(id,title, description, price,userId) { 
        this._id=id ? new mongodb.ObjectId(id):null
        this.title = title;
        this.description = description;
        this.price = price;
        this.userId=userId
    }

    save() {
        const db=getDb()
        let dbOp;
        if(!this._id){
            dbOp= db.collection("products")
            .insertOne(this)
        }
        else{
            dbOp= db.collection("products")
            .updateOne({_id:this._id},{$set:this})
        }
            return dbOp.then(result=>{
                console.log(result)
            })
            .catch(err=>{
                console.log("Error! data not inserted.")
            })
    }

    static DeleteProduct(id){
        const db=getDb()
        return db.collection("products").deleteOne({_id:new mongodb.ObjectId(id)})
        .then(
            result=>{
                console.log("deleted sucessfully")
                return result
            }
        ).catch(err=>{
            console.log(err)
        })
       
    }

    static fetchAll(cb) {
       const db=getDb()
       return db.collection("products")
                .find()
                .toArray()
                .then(products=>{
                    cb(products)
                })
                .catch(err=>{
                    console.log(err)
                })
    }

    static findProduct(pid){
        const db=getDb();
        return db.collection('products')
                .findOne({_id:new mongodb.ObjectId(pid)})
                .then(product=>{
                    return product;
                })
                .catch(err=>{
                    console.log(err);
                })
    }
}

module.exports = Product;
