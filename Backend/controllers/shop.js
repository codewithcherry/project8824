const Product=require("../models/product");

exports.getProdducts=(req,res,next)=>{
    console.log("view products page rendered");
    Product.fetchAll((products)=>{
        res.render('shop/view-products',{pagetitle:"View Products",prods:products});
    })
   
};

exports.getShopHome=(req,res,next)=>{
    console.log("shop home page rendered");
    Product.fetchAll((products)=>{
        res.render('shop/index',{pagetitle:"View Products",prods:products});
    })
}

exports.getShopCart=(req,res,next)=>{
    console.log("Cart page is rendered");
    res.render('shop/cart',{pageTitle:"my cart"});
}

exports.getOrders=(req,res,next)=>{
    console.log("Orders page rendered");
    res.render('shop/orders',{pageTitle:"My Orders"})
}

exports.getShopCheckout=(req,res,next)=>{
    console.log("checkout page rendered");
    res.render("shop/checkout",{pageTitle:"Checkout Page"});
}