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

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ useremail: email })
        .then(user => {
            if (!user) {
                console.log('User not found');
                return res.redirect("/login");  // Return here to stop further execution
            }

            // Compare the password
            return bcrypt.compare(password, user.password)
                .then(ismatch => {
                    if (ismatch) {
                        console.log("Password matched");
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
                        console.log("Password does not match");
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