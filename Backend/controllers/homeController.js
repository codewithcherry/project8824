exports.homeController=(req,res,next)=>{
    console.log("Home page"); 
    res.render('home',{pagetitle:"Home"});
}