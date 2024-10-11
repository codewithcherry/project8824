const Product = require("../models/product");
const { validationResult } = require("express-validator");

// Controller to render Add Product Page
exports.addProductController = (req, res, next) => {
    console.log("Add product page rendered");
    res.render("admin/add-product", {
        pagetitle: "Add Products",
        activeLink: "add-product",
        isAuthenticated: req.session.authenticate,
        errorMessage: null,
        oldData: {
            title: '',
            description: '',
            price: ''
        }
    });
};

// Controller to handle Product Submission (Create New Product)
exports.postProductController = (req, res, next) => {
    const { title, description, price } = req.body;
    const image = req.file;
    // console.log(image);

    if(!image){
        return res.status(400).render("admin/add-product", {
            pagetitle: "Add Products",
            activeLink: "add-product",
            isAuthenticated: req.session.authenticate,
            errorMessage: "image is not added!",
            oldData: { title:title, description:description, price:price }
        });
    }
    const imageUrl=image.path
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("admin/add-product", {
            pagetitle: "Add Products",
            activeLink: "add-product",
            isAuthenticated: req.session.authenticate,
            errorMessage: errors.array()[0].msg,
            oldData: { title, description, price }
        });
    }

    const product = new Product({
        title:title,
        description:description,
        price:price,
        image:imageUrl,
        userId: req.user._id
    });

    product.save()
        .then(result => {
            res.redirect('/home');
        })
        .catch(err => {
            const error = new Error(err);
            console.log(error.message);
            error.httpStatusCode = 500;
            next(error);
        });
};

// Controller to display all Products for Admin
exports.getadminProductslist = (req, res, next) => {
    Product.find()
        .then(products => {
            return res.render('admin/productslist', {
                pagetitle: "View Products",
                activeLink: "productslist",
                prods: products,
                isAuthenticated: req.session.authenticate
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(error);
        });
};

// Controller to render Edit Product Page
exports.getEditProduct = (req, res, next) => {
    const prodID = req.params.productID;
    const editmode = req.query.edit;

    if (!editmode) {
        console.log("Redirect to home page, editmode=false");
        return res.redirect("/");
    }

    Product.findById(prodID)
        .then(product => {
            res.render("admin/edit-products", {
                pageTitle: "Edit Product",
                product,
                isAuthenticated: req.session.authenticate
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(error);
        });
};

// Controller to handle Product Update (Edit Product)
exports.postEditProductDetails = (req, res, next) => {
    const prodID = req.body.productId;
    const { title: updatedTitle, description: updatedDescription, price: updatedPrice ,imageUrl: imageUrl} = req.body;
    const image=req.file;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render("admin/edit-products", {
            pagetitle: "Edit Products",
            activeLink: "add-product",
            isAuthenticated: req.session.authenticate,
            errorMessage: errors.array()[0].msg,
            product: { title: updatedTitle, description: updatedDescription, price: updatedPrice, _id: prodID }
        });
    }

    Product.findById(prodID)
        .then(product => {
            product.title = updatedTitle;
            product.description = updatedDescription;
            product.price = updatedPrice;
            if(image){
                product.image=image.path;
            }
            else{
                product.image=imageUrl
            }
            return product.save();
        })
        .then(() => {
            res.redirect("/productslist");
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(error);
        });
};

// Controller to handle Product Deletion
exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productID;
    console.log(prodId);

    Product.findByIdAndDelete(prodId)
        .then(result => {
            console.log("Deleted Product");
            res.redirect("/productslist");
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            next(error);
        });
};
