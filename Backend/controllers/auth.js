const User=require("../models/users");
const bcrypt=require("bcryptjs");
const sendEmail=require("../services/mailer");
const crypto=require('crypto');

const {validationResult}=require("express-validator");

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
        errorMessage:errorMessage,
        oldInput:{
            email:"",
            password:"",
            confirmPassword:""
        }
    })
}

exports.postSignup=(req,res,next)=>{
    userEmail=req.body.email;
    userPassword=req.body.password;  
    userConfirmPassword=req.body.confirmPassword 
    let errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).render("auth/signup",{
        pageTitle:"Signup Page",
        activeLink:"signup",
        isAuthenticated:req.session.authenticate,
        errorMessage:errors.array()[0].msg,
        oldInput:{
            email:userEmail,
            password:userPassword,
            confirmPassword:userConfirmPassword
        }
        })
    }
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
                
                res.redirect("/login")

                // Sending welcome email
                sendEmail(
                    userEmail,
                    "Welcome to My Shop!",
                    "<h1>Welcome to My Shop!</h1><p>We’re excited to have you on board. Enjoy shopping with us!</p><p>Regards, <br> My Shop Team</p>"
                );

                req.flash("error","Account Created Successfully,Login using credentials");
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

exports.getChangePassword=(req,res,next)=>{
    console.log("change-password page rendered");
    let Message=req.flash("error")
    let errorMessage=null
    if(Message.length>0){
        errorMessage=Message[0]
    }
    res.render('auth/changePassword',{
        pageTitle:"Change Password",
        activeLink:"login",
        errorMessage:errorMessage
    })
}

exports.postResetPassword = (req, res, next) => {
    const userEmail = req.body.email;
    let Message=req.flash("error")
    let errorMessage=null
    if(Message.length>0){
        errorMessage=Message[0]
    }
    // Find the user by email
    User.findOne({ useremail: userEmail })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/change-password');
        }
  
        // Generate a reset token
        crypto.randomBytes(32, (err, buffer) => {
          if (err) {
            console.log(err);
            return res.redirect('/change-password');
          }
  
          const token = buffer.toString('hex'); // Token in hexadecimal format
  
          // Set reset token and expiry time (e.g., 1 hour from now)
          user.resetToken = token;
          user.tokenExpiryTime = Date.now() + 3600000; // 1 hour in milliseconds
  
          // Save the user with the new fields
          return user.save().then(() => {
            // Send an email with the reset link
            const resetLink = `http://localhost:3000/new-password/${token}`;
            sendEmail(
              user.useremail,
              'Password Reset',
              `<p>You requested a password reset</p>
               <p>Click this <a href="${resetLink}">link</a> to set a new password.</p>`
            );
            req.flash('error', 'A password reset link has been sent to your email.');
            res.redirect('/login');
          });
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  exports.getNewPassword=(req,res,next)=>{
    const token = req.params.token;
    let Message=req.flash("error")
    let errorMessage=null
    if(Message.length>0){
        errorMessage=Message[0]
    }
    res.render("auth/newPassword",{
        pageTitle:"New Password",
        activeLink:"login",
        errorMessage:errorMessage,
        token:token
    })
  }

  exports.postNewPassword = (req, res, next) => {
    const token = req.params.token;
    const newPassword = req.body.password;
    let Message = req.flash("error");
    let errorMessage = null;
    if (Message.length > 0) {
      errorMessage = Message[0];
    }
  
    User.findOne({
      resetToken: token,
      tokenExpiryTime: { $gt: Date.now() } // Check if the token is still valid
    })
      .then(user => {
        if (!user) {
          req.flash("error", "Invalid or expired token. Please try again.");
          return res.redirect("/change-password");
        }
        return bcrypt.hash(newPassword, 12).then(hashedPassword => {
          user.password = hashedPassword;
          user.resetToken = null;
          user.tokenExpiryTime = null;
          return user.save();
        });
      })
      .then(() => {
        req.flash("error", "Password updated successfully. You can now log in.");
        res.redirect('/login');
      })
      .catch(err => {
        console.log("Error:", err);
        req.flash("error", "Something went wrong. Please try again later.");
        res.redirect("/change-password");
      });
  };
  