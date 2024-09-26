// this file is to write the code for controller all products related functions to manioulate the data into views and models
const Product=require("../models/product");

exports.addProductController=(req,res,next)=>{
    console.log("add product page rendered");
    res.render("admin/add-product",
        {   pagetitle:"Add Products",
            activeLink:"add-product",
            isAuthenticated:req.cookies.authenticate
        });
}

exports.postProductController = (req, res, next) => {
    // Destructure title, description, and price from req.body
    const { title, description, price } = req.body;

    // Pass an object to the Product constructor
    const product = new Product({
        title: title,         // or just 'title' in shorthand
        description: description,
        price: price,
        userId:req.user._id
    });

    // Save the product to the database
    product.save()
        .then(result => {
            res.redirect('/home');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getadminProductslist=(req,res,next)=>{
    Product.find().then((products)=>{
        return  res.render('admin/productslist',
            {   pagetitle:"View Products",
                activeLink:"productslist",
                prods:products,
                isAuthenticated:req.cookies.authenticate
            });
    })
    .catch(err=>{
        return console.log(err);
    })
}


exports.getEditProduct=(req,res,next)=>{
    let prodID=req.params.productID;
    let editmode=req.query.edit;
    if(!editmode){
        console.log("redirect to home page, editmode=false")
        res.redirect("/")
    }else{
        Product.findById(prodID).then((product)=>{
            res.render("admin/edit-products",
                {   pageTitle:"Edit Product",
                    product:product,
                    isAuthenticated:req.cookies.authenticate
                });
        })
        
    }
    
}

exports.postEditProductDetails=(req,res,next)=>{
    const prodID=req.body._id;
    const updatedTitle=req.body.title;
    const updatedDescription=req.body.description;
    const updatedPrice=req.body.price;

    Product.findById(prodID).then(product=>{
        product.title=updatedTitle;
        product.description=updatedDescription;
        product.price=updatedPrice;
        return product.save()
    })
    .then(product=>{
        res.redirect("/productslist");
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.postDeleteProduct=(req,res,next)=>{
    let prodId=req.body.productID;
    console.log(prodId);
    Product.findByIdAndDelete(prodId).then(result=>{
        console.log("deleted Product:",result);
        res.redirect("/productslist");
    });
   
}