const fs = require('fs');
const path = require('path');

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
        this.id=Math.floor(Math.random()*1000000).toString();
        fs.readFile(p, (err, fileContent) => {
            let products = [];
            if (!err) {
                products = JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products, null, 2), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        fs.readFile(p, (err, fileContent) => {
            if (err) {
                cb([]);
            } else {
                cb(JSON.parse(fileContent));
            }
        });
    }

    static findProduct(pid,cb){
        this.fetchAll(products=>{
            const item=products.find(p=>p.id===pid);
            cb(item);
        });   
    }
}

module.exports = Product;
