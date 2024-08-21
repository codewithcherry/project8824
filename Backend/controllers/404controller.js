exports.error404Controller=(req,res,next)=>{
    console.log("404 error page rendered");
    res.render('404',{pagetitle:"Not responding | 404 Error"});
}