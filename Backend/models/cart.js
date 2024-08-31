const fs = require('fs');
const path = require('path');

const Product=require("./product")

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

    static FetchCartProducts(cb) {
        fs.readFile(p, (err, fileContent) => {
            if (err || fileContent.length == 0) {
                cb([]); // Return an empty array if there's an error or the cart is empty
                return;
            }

            let cart = JSON.parse(fileContent);
            let cartItems = [];

            // Lazy load the Product module to avoid circular dependency
            const Product = require("./product");

            // Use Promises to ensure all product details are fetched before returning the result
            let fetchProductPromises = cart.products.map(cartProduct => {
                return new Promise((resolve) => {
                    Product.findProduct(cartProduct.id, (product) => {
                        if (product) {
                            product.qty = cartProduct.qty; // Add the quantity to the product object
                            resolve(product);
                        } else {
                            resolve(null); // If the product is not found, resolve with null
                        }
                    });
                });
            });

            Promise.all(fetchProductPromises).then(products => {
                cartItems = products.filter(product => product !== null); // Filter out any null values
                cb(cartItems); // Return the array of products with their quantities
            });
        });
    }
    
    }