const fs = require('fs');
const path = require('path');

const DataFolder = path.join(path.dirname(process.mainModule.filename), 'data');
if (!fs.existsSync(DataFolder)) {
    fs.mkdirSync(DataFolder);
}

const p = path.join(DataFolder, 'cart.json');

module.exports = class Cart {

    static addCartProduct(productId, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalCartPrice: 0 };
            if (!err && fileContent.length > 0) {
                cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.products.findIndex(p => p.id === productId);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: productId, qty: 1 };
                cart.products.push(updatedProduct);
            }
            cart.totalCartPrice += +productPrice;

            fs.writeFile(p, JSON.stringify(cart, null, 2), err => {
                if (err) console.log(err);
            });
        });
    }

    static deleteCartProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err || fileContent.length === 0) {
                return; // No cart file or it's empty, nothing to delete
            }
            
            const cart = JSON.parse(fileContent);
            const productToDelete = cart.products.find(product => id === product.id);

            if (!productToDelete) {
                return; // Product not found in the cart, nothing to delete
            }

            const updatedCart = {
                products: cart.products.filter(product => id !== product.id),
                totalCartPrice: cart.totalCartPrice - (productToDelete.qty * productPrice)
            };

            fs.writeFile(p, JSON.stringify(updatedCart, null, 2), err => {
                if (err) console.log(err);
            });
        });
    }

}
