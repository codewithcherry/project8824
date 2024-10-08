const Product=require("../models/product");
const Order=require("../models/orders");

const User=require("../models/users");

exports.getProdducts=(req,res,next)=>{
    console.log("view products page rendered");
    Product.find().then((products)=>{
        return  res.render('shop/index',{
            pagetitle:"View Products",
            activeLink:"view-products",
            prods:products,
            isAuthenticated:req.session.authenticate
        });
    })
    .catch(err=>{
        const error=new Error(err)
        error.httpStatusCode=500
        next(error);
    })
   
};

exports.getShopHome=(req,res,next)=>{
    console.log("shop home page rendered");
    Product.find().then((products)=>{
        return  res.render('shop/index',
            {pagetitle:"View Products",
                activeLink:"home",
                prods:products,
                isAuthenticated:req.session.authenticate
            });
    })
    .catch(err=>{
        const error=new Error(err)
            error.httpStatusCode=500
            next(error);
    })  
}

exports.getShopCart=(req,res,next)=>{
    console.log("Cart page is rendered"); 
    req.user.populate("cart.items.productId")
    .then(user=>{
        const products=user.cart.items;
        res.render('shop/cart',
            {   pageTitle:"my cart",
                activeLink:"cart",
                products:products,
                isAuthenticated:req.session.authenticate
            });
    })
    .catch(err=>{
        const error=new Error(err)
            error.httpStatusCode=500
            next(error);
    })
    
}

exports.postShopCart=(req,res,next)=>{
    if(!req.user){
          // Redirect with a query parameter to show the modal
          return res.redirect("/?showModal=true");
    }
    else{
        const prodID=req.body.productId;
        Product.findById(prodID).then(product=>{
            return req.user.addToCart(product)
                    .then(p=>{
                        console.log(p);
                        res.redirect("/cart");
                    })
                    .catch(err=>{
                        const error=new Error(err)
                        error.httpStatusCode=500
                        next(error);
                    });
        })
    }  
}

exports.postDeleteCartProduct=(req,res,next)=>{
    const prodID=req.body.productId;
    req.user.deleteItemFromCart(prodID)
    .then(result=>{
        res.redirect("/cart")
        })
    .catch(err=>{
        const error=new Error(err)
        error.httpStatusCode=500
       next(error);
    })
}

exports.getOrders=(req,res,next)=>{
    console.log("Orders page rendered");
    res.render('shop/orders',
        {   pageTitle:"My Orders",
            activeLink:"orders",
            isAuthenticated:req.session.authenticate
        })
}

exports.getShopCheckout=(req,res,next)=>{
    console.log("checkout page rendered");
    res.render("shop/checkout",
        {   pageTitle:"Checkout Page",
            isAuthenticated:req.session.authenticate
        });
}

exports.getOrders = (req, res, next) => {
    Order.find({ "user.userId": req.user._id })
        .then((orders) => {
            res.render("shop/orders", {
                pageTitle: "Orders",
                activeLink: "orders",
                orders: orders, // Send full orders array
                isAuthenticated:req.session.authenticate
            });
        })
        .catch((err) => {
            const error=new Error(err)
            error.httpStatusCode=500
            next(error);
        });
};



exports.postCartToOrders=(req,res,next)=>{
    console.log("checkoutpage after posting from cart");

    req.user.populate("cart.items.productId").then((user)=>{
        const products = user.cart.items.map((item) => {
            return {
                productId: { ...item.productId._doc },  // Spread the full product details
                quantity: item.quantity
            };
        });
            const order=new Order({
                user:{
                    userId:req.user._id,
                    name:req.user.username
                },
                products:products
            })
            return order.save();
    }).then(()=>{
          return  req.user.clearCart();
    })
    .then(()=>{
        res.redirect("/orders")
    })
    .catch(err=>{
                        const error=new Error(err)
                        error.httpStatusCode=500
                        next(error);
    })

}

exports.getProductDetails=(req,res,next)=>{
    const prodId=req.params.productId;
    Product.findById(prodId).then(product=>{
        res.render("shop/product-details",
            {   pageTitle:"product details",
                productData:product,
                isAuthenticated:req.session.authenticate
            });
    })
    .catch(err=>{
        const error=new Error(err)
         error.httpStatusCode=500
        next(error);
    });
    
    
}