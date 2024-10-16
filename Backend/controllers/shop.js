const Product=require("../models/product");
const Order=require("../models/orders");
const GenerateInvoice=require("../middlewares/invoice");

const User=require("../models/users");

exports.getProdducts=(req,res,next)=>{
    console.log("view products page rendered");
    const page=Number(req.query.page) || 1;
    const pageLimit=8;
    let NoProducts;
    Product.find()
    .countDocuments()
    .then(totalProducts=>{
            NoProducts=totalProducts;
            Product.find()
            .skip((page-1)*pageLimit)
            .limit(pageLimit)
            .then((products)=>{
                return  res.render('shop/index',{
                    pagetitle:"View Products",
                    activeLink:"view-products",
                    prods:products,
                    isAuthenticated:req.session.authenticate,
                    pagination:{
                        currentPage:page,
                        nextPage:+page+1,
                        prevPage:+page-1,
                        hasNextPage:page*pageLimit<totalProducts,
                        hasPrevPage:page>1
                    }
                });
            })

    })
    .catch(err=>{
        const error=new Error(err)
        error.httpStatusCode=500
        next(error);
    })
   
};

exports.getShopHome=(req,res,next)=>{
    console.log("shop home page rendered");
    const page=Number(req.query.page) || 1;
    const pageLimit=8;
    let NoProducts;
    Product.find()
    .countDocuments()
    .then(totalProducts=>{
            NoProducts=totalProducts;
            Product.find()
            .skip((page-1)*pageLimit)
            .limit(pageLimit)
            .then((products)=>{
                return  res.render('shop/index',{
                    pagetitle:"View Products",
                    activeLink:"view-products",
                    prods:products,
                    isAuthenticated:req.session.authenticate,
                    pagination:{
                        currentPage:page,
                        nextPage:+page+1,
                        prevPage:+page-1,
                        hasNextPage:page*pageLimit<totalProducts,
                        hasPrevPage:page>1
                    }
                });
            })

    })
    .catch(err=>{
        const error=new Error(err)
        error.httpStatusCode=500
        next(error);
    })
}

exports.getShopCart=(req,res,next)=>{
    console.log("Cart page is rendered"); 
    let total=0;
    req.user.populate("cart.items.productId")
    .then(user=>{
        const products=user.cart.items;
        products.forEach(p => {
            total+=p.productId.price*p.quantity
        });
        res.render('shop/cart',
            {   pageTitle:"my cart",
                activeLink:"cart",
                products:products,
                isAuthenticated:req.session.authenticate,
                total:total,
                tax:Math.ceil((total*4)/100),
                delivery:total>200?0:49.00     
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
                        // console.log(p);
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



exports.postOrders=(req,res,next)=>{
    console.log("checkoutpage after posting from cart");
    const shipTo=JSON.parse(req.body.shipTo);
    const paymentDetails=JSON.parse(req.body.payment);
    // console.log(shipTo)
    // console.log(paymentDetails)
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
                    name:req.user.username,
                    email:req.user.useremail
                },
                products:products,
                shipTo:shipTo,
                payment:paymentDetails,
                time:new Date()
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

exports.getInvoice=(req,res,next)=>{
    const orderId=req.params.orderId;
    return Order
    .findOne({_id:orderId})
    .then(order=>{
        // console.log(order);
        if(order.user.userId.toString()!==req.user._id.toString()){
            return console.log("you cannot print other orders")
        }
        //code for pdf generation helper function
        return GenerateInvoice(order,res);
    })
    .catch(err=>{
        next(err);
    })
}

exports.getCheckout=(req,res,next)=>{
    User.findOne({_id:req.user._id})
    .then(user=>{
        return res.render('shop/checkout',{
            pagetitle:"Add Address",
            activeLink:"checkout",
            isAuthenticated:req.session.authenticate,
            status:{
                productsAdded:true,
                addressAdded:false,
                payment:false,
                success:false
            },
            addressArray:user.address
        });
    })
    .catch(err=>{
        next(err);
    })
}

exports.postPayment=(req,res,next)=>{
    const shipAddress=JSON.parse(req.body['ship-address']);
    // console.log(shipAddress)
    let total=0;
    req.user.populate("cart.items.productId")
    .then(user=>{
        const products=user.cart.items;
        products.forEach(p => {
            total+=p.productId.price*p.quantity
        });
        res.render('shop/payment',{
            pagetitle:"payment",
            activeLink:"payment",
            products:products,
            isAuthenticated:req.session.authenticate,
            address:shipAddress,
            subtotal:total,
            tax:Math.ceil((total*4)/100),
            delivery:total>200?0:49.00 ,
            status:{
                productsAdded:true,
                addressAdded:true,
                payment:false,
                success:false
            }
            
        });
    })
    .catch(err=>{
        const error=new Error(err)
            error.httpStatusCode=500
            next(error);
    })


    
    
}