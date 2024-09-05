// this file is to write the code for controller all products related functions to manioulate the data into views and models
const Product=require("../models/product");

exports.addProductController=(req,res,next)=>{
    console.log("add product page rendered");
    res.render("admin/add-product",{pagetitle:"Add Products"});
}

exports.postProductController=(req,res,next)=>{
    const {title,description,price}=req.body;
    const product=new Product(title,description,price);
    product.save().then(result=>{
        res.redirect("/home");
    }
    )
    .catch(err=>{
        console.log(err)
    })
   
}

exports.getadminProductslist=(req,res,next)=>{
    Product.fetchAll((products)=>{
        res.render('admin/productslist',{pagetitle:"Admin Products",prods:products});
    })
}


exports.getEditProduct=(req,res,next)=>{
    let prodID=req.params.productID;
    let editmode=req.query.edit;
    if(!editmode){
        console.log("redirect to home page, editmode=false")
        res.redirect("/")
    }else{
        Product.findProduct(prodID,(product)=>{
            res.render("admin/edit-products",{pageTitle:"Edit Product",product:product});
        })
        
    }
    
}

exports.postDeleteProduct=(req,res,next)=>{
    let prodId=req.body.productID;
    console.log(prodId);
    Product.DeleteProduct(prodId);
    res.redirect("/productslist");
}