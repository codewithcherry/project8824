exports.getLogin=(req,res,next)=>{
    res.render('auth/login',{
        pageTitle:"Login Page",
        activeLink:"login"
    })
}

exports.postLogin=(req,res,next)=>{
    res.redirect("/");
}