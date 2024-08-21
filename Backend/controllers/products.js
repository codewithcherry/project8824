// this file is to write the code for controller all products related functions to manioulate the data into views and models
exports.addProductController=(req,res,next)=>{
    console.log("add product page rendered");
    res.render("add-product",{pagetitle:"Add Products"});
}

const products=[]

exports.postProductController=(req,res,next)=>{
    products.push(req.body);
    console.log(products);
    res.redirect("/view-products");
}

exports.getProductController=(req,res,next)=>{
    console.log("view products page rendered");
    res.render('view-products',{pagetitle:"View Products",prods:products});
}
