const Cart=require('./cart')
const mongodb=require('mongodb')
const {getDb}=require("../utils/db");

class Product {
    constructor(id,title, description, price) { 
        this._id=new mongodb.ObjectId(id);  
        this.title = title;
        this.description = description;
        this.price = price;
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

    static findProduct(pid,cb){
        const db=getDb();
        return db.collection('products')
                .find({_id:new mongodb.ObjectId(pid)})
                .next()
                .then(product=>{
                    cb(product);
                })
                .catch(err=>{
                    console.log(err);
                })
    }
}

module.exports = Product;
