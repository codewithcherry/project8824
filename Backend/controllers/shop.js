const Product=require("../models/product");
const Cart=require("../models/cart")

exports.getProdducts=(req,res,next)=>{
    console.log("view products page rendered");
    Product.fetchAll((products)=>{
        res.render('shop/view-products',{pagetitle:"View Products",prods:products});
    })
   
};

exports.getShopHome=(req,res,next)=>{
    console.log("shop home page rendered");
    Product.fetchAll((products)=>{
        res.render('shop/index',{pagetitle:"View Products",prods:products});
    })
}

exports.getShopCart=(req,res,next)=>{
    console.log("Cart page is rendered");
    Cart.FetchCartProducts(data=>{
        res.render('shop/cart',{pageTitle:"my cart",products:data.products,amount:data.amount});
    })
    
}

exports.postShopCart=(req,res,next)=>{
    const prodID=req.body.productId;
    console.log(prodID);
    Product.findProduct(prodID,(product)=>{
        Cart.addCartProduct(product.id,product.price);
        res.redirect("/cart");
    })
    
}

exports.getOrders=(req,res,next)=>{
    console.log("Orders page rendered");
    res.render('shop/orders',{pageTitle:"My Orders"})
}

exports.getShopCheckout=(req,res,next)=>{
    console.log("checkout page rendered");
    res.render("shop/checkout",{pageTitle:"Checkout Page"});
}

exports.getProductDetails=(req,res,next)=>{
    const prodId=req.params.productId;
    Product.findProduct(prodId,product=>{
        res.render("shop/product-details",{pageTitle:"product details",productData:product});
    });
    
    
}