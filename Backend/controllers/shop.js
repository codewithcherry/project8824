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