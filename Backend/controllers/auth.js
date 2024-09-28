const User=require("../models/users");

exports.getLogin=(req,res,next)=>{
    res.render('auth/login',{
        pageTitle:"Login Page",
        activeLink:"login"
    })
}

exports.postLogin=(req,res,next)=>{
    // res.cookie('authenticate', 'true', {
    //      maxAge: 3600000,
    //      httpOnly: true 
    //     }
    //     );

    User.findById("66f194792f116614db11c787")
    .then(user=>{
        req.session.authenticate=true;
        req.session.user=user;
        req.session.save((err) => {
            if (err) {
              console.error('Session save error:', err);
              return res.redirect('/login'); // Redirect to login in case of error
            }
            res.redirect("/"); // Redirect after session is successfully saved
          });
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.getLogout=(req,res,next)=>{
    // res.clearCookie('authenticate');
    req.session.destroy();
    res.redirect("/");
}