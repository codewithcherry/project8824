// this file is to write the code for controller all products related functions to manioulate the data into views and models

exports.addProductController=(req,res,next)=>{
    console.log("add product page rendered");
    res.render("admin/add-product",{pagetitle:"Add Products"});
}

exports.postProductController=(req,res,next)=>{
    const {title,description,price}=req.body;
    const product=new Product(title,description,price);
    product.save()
    res.redirect("/");
}
