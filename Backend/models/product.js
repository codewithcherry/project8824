const fs = require('fs');
const path = require('path');

const Cart=require('./cart')

const {getDb}=require("../utils/db");
const { get } = require('http');

const dataFolder = path.join(path.dirname(process.mainModule.filename), 'data');
if (!fs.existsSync(dataFolder)){
    fs.mkdirSync(dataFolder);
}

const p = path.join(dataFolder, 'products.json');

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
                    return products
                })
                .catch(err=>{
                    console.log(err)
                })
    }

    static findProduct(pid,cb){
        
    }
}

module.exports = Product;
