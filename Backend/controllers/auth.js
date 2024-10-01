const User=require("../models/users");
const bcrypt=require("bcryptjs");

exports.getSignup=(req,res,next)=>{
    res.render("auth/signup",{
        pageTitle:"Signup Page",
        activeLink:"signup",
        isAuthenticated:req.session.authenticate
    })
}

exports.postSignup=(req,res,next)=>{
    userEmail=req.body.email,
    userPassword=req.body.password,
    userConfirmPassword=req.body.confirmPassword

    User.findOne({email:userEmail})
    .then( userDoc=>{
        if(userDoc){
            res.redirect("/login");
        }
        else{
            return bcrypt
            .hash(userPassword,12)
            .then(hashedPassword=>{
                const user=new User({
                    username:userEmail.slice(0,userEmail.length-10),
                    useremail:userEmail,
                    password:hashedPassword,
                    cart:{items:[]}
                })
                return user.save();
            })
            .then(result=>{
                res.redirect("/login")
            })
            
        }        
    })
    .catch(err=>{
        console.log(err);
    })
}

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