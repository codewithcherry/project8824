// this file is to write the code for controller all products related functions to manioulate the data into views and models
exports.addProductController=(req,res,next)=>{
    console.log("add product page rendered");
    res.render("add-product",{pagetitle:"Add Products"});
}