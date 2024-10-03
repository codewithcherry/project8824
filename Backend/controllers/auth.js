const User=require("../models/users");
const bcrypt=require("bcryptjs");

exports.getSignup=(req,res,next)=>{
    let Message=req.flash("error")
    let errorMessage=null
    if(Message.length>0){
        errorMessage=Message[0]
    }
    res.render("auth/signup",{
        pageTitle:"Signup Page",
        activeLink:"signup",
        isAuthenticated:req.session.authenticate,
        errorMessage:errorMessage
    })
}

exports.postSignup=(req,res,next)=>{
    userEmail=req.body.email,
    userPassword=req.body.password,
    userConfirmPassword=req.body.confirmPassword

    User.findOne({useremail:userEmail})
    .then( userDoc=>{
        if(userDoc){
            req.flash('error',"User exists with same email address");
            res.redirect("/signup");
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
                req.flash("error","Account Created Successfully,Login using credentials");
                res.redirect("/login")
            })
            
        }        
    })
    .catch(err=>{
        console.log(err);
    })
}

exports.getLogin=(req,res,next)=>{
    let Message=req.flash("error")
    let errorMessage=null
    if(Message.length>0){
        errorMessage=Message[0]
    }
    res.render('auth/login',{
        pageTitle:"Login Page",
        activeLink:"login",
        errorMessage:errorMessage
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ useremail: email })
        .then(user => {
            if (!user) {
                req.flash("error",'User not found');
                return res.redirect("/login");  // Return here to stop further execution
            }

            // Compare the password
            return bcrypt.compare(password, user.password)
                .then(ismatch => {
                    if (ismatch) {
                        req.flash("error","Password matched");
                        req.session.authenticate = true;
                        req.session.user = user;

                        // Save session and redirect
                        req.session.save((err) => {
                            if (err) {
                                console.error('Session save error:', err);
                                return res.redirect('/login');  // Return to stop further execution
                            }
                            return res.redirect("/");  // Return here to stop further execution
                        });
                    } else {
                        req.flash("error","Password does not match");
                        return res.redirect('/login');  // Return here to stop further execution
                    }
                });
        })
        .catch(err => {
            console.error('Error in login process:', err);
            res.status(500).send('Internal Server Error');
        });
};


exports.getLogout=(req,res,next)=>{
    // res.clearCookie('authenticate');
    req.session.destroy();
    res.redirect("/");
}