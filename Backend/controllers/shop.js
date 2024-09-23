const Product=require("../models/product");
const Cart=require("../models/cart")

const User=require("../models/users");

exports.getProdducts=(req,res,next)=>{
    console.log("view products page rendered");
    Product.find().then((products)=>{
        return  res.render('shop/index',{pagetitle:"View Products",prods:products});
    })
    .catch(err=>{
        return console.log(err);
    })
   
};

exports.getShopHome=(req,res,next)=>{
    console.log("shop home page rendered");
    Product.find().then((products)=>{
        return  res.render('shop/index',{pagetitle:"View Products",prods:products});
    })
    .catch(err=>{
        return console.log(err);
    })
}

exports.getShopCart=(req,res,next)=>{
    console.log("Cart page is rendered");
    req.user.populate("cart.items.productId")
    .then(user=>{
        const products=user.cart.items;
        res.render('shop/cart',{pageTitle:"my cart",products:products});
    })
    
}

exports.postShopCart=(req,res,next)=>{
    const prodID=req.body.productId;
    Product.findById(prodID).then(product=>{
        return req.user.addToCart(product)
                .then(p=>{
                    console.log(p);
                    res.redirect("/cart");
                })
                .catch(err=>console.log(err));
    })
    
    
}

exports.postDeleteCartProduct=(req,res,next)=>{
    const prodID=req.body.productId;
    req.user.deleteItemFromCart(prodID)
    .then(result=>{
        res.redirect("/cart")
        })
    .catch(err=>console.log(err))
}

exports.getOrders=(req,res,next)=>{
    console.log("Orders page rendered");
    res.render('shop/orders',{pageTitle:"My Orders"})
}

exports.getShopCheckout=(req,res,next)=>{
    console.log("checkout page rendered");
    res.render("shop/checkout",{pageTitle:"Checkout Page"});
}

exports.getOrders=(req,res,next)=>{
    req.user.getOrders().then(result=>{
        res.render("shop/orders",{pageTitle:"Orders",orders:result});
    })
}

exports.postCartToOrders=(req,res,next)=>{
    console.log("checkoutpage after posting from cart");
    req.user.addToOrders().then(result=>{
        res.redirect("/orders")
    })
}

exports.getProductDetails=(req,res,next)=>{
    const prodId=req.params.productId;
    Product.findById(prodId).then(product=>{
        res.render("shop/product-details",{pageTitle:"product details",productData:product});
    });
    
    
}