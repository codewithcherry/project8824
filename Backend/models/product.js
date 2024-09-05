const Cart=require('./cart')
const mongodb=require('mongodb')
const {getDb}=require("../utils/db");

class Product {
    constructor(title, description, price) {       
        this.title = title;
        this.description = description;
        this.price = price;
    }

    save() {
            const db=getDb()
           return db.collection("products")
            .insertOne(this)
            .then(result=>{
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
