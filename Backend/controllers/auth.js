exports.getLogin=(req,res,next)=>{
    res.render('auth/login',{
        pageTitle:"Login Page",
        activeLink:"login"
    })
}

exports.postLogin=(req,res,next)=>{
    res.cookie('authenticate', 'true', {
         maxAge: 3600000,
         httpOnly: true 
        }
        );

    req.session.authenticate=true;
    console.log(req.session)
    res.redirect("/");
}

exports.getLogout=(req,res,next)=>{
    res.clearCookie('authenticate');
    res.redirect("/");
}