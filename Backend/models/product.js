// this file is to code the model for products controller

const products=[]

class Product{
    constructor(title,description,price){
        this.title=title;
        this.description=description;
        this.price=price;
    }

    save() {
        products.push(this);
    }
    static fetchAll(){
        return products
    }
}

module.exports= Product;