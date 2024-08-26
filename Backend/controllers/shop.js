const Product=require("../models/product");

exports.getProdducts=(req,res,next)=>{
    console.log("view products page rendered");
    Product.fetchAll((products)=>{
        res.render('shop/view-products',{pagetitle:"View Products",prods:products});
    })
   
};
