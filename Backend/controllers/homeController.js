exports.homeController=(req,res,next)=>{
    console.log("Home page"); 
    res.render('shop/home',{pagetitle:"Home"});
}