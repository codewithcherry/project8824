// this is the root file which will executed to start the node server
const express=require('express');
const path=require('path');


const mongoose=require("mongoose");
const {uri}=require("./utils/dbcredentials.js")

const bodyParser=require("body-parser");
const _404ErrorController=require("./controllers/404controller.js")
const User=require("./models/users.js");
// const cookieParser=require("cookie-parser");
const session=require('express-session');
const mongoStore=require("connect-mongo");

const csrfProtection=require("csurf");

const flash=require("connect-flash");

const store= mongoStore.create({
        mongoUrl: uri,  // MongoDB connection URL
        collectionName: 'sessions',  // Collection where session data will be stored
        ttl: 14 * 24 * 60 * 60  // Time-to-live for sessions in seconds (14 days)
    })


const app=express();

app.set('view engine','pug');
app.set('views',"./views");

const authRouter=require("./routes/authRouter.js");
const adminRouter=require('./routes/adminRoutes.js');
const shopRouter=require("./routes/shopRoutes.js");

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"public")));

//setup cookie parser through out the routes
// app.use(cookieParser());
//setup and configure session
app.use(session(
    {
        secret: 'your-secret-key', // Use a strong secret in production
        resave: false,
        saveUninitialized: false,
        store:store,
        cookie:{
            maxAge: 1000 * 60 * 60 * 24 * 14, 
        }

    }
))

app.use(csrfProtection())
app.use(flash());

// Pass CSRF token to every view (optional but recommended)
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();  // This makes the token available in views
  next();
});

app.use((req, res, next) => {
    if (req.session.user) {
      // Fetch the full Mongoose user object from the database
      User.findById(req.session.user._id)
        .then(user => {
          if (user) {
            req.user = user;  // Attach the full user document to req.user
          }
          next();  // Continue to the next middleware/route handler
        })
        .catch(err => {
          console.log('Error fetching user:', err);
          next();  // Continue even if there's an error
        });
    } else {
      next();  // If no session, proceed without setting req.user
    }
  });
  


app.use(authRouter);
app.use(adminRouter);
app.use(shopRouter);


app.use((error,req,res,next)=>{
  console.log(error.message)
  res.render("500",{
        pageTitle:"500 error",
        activeLink:"error",
        isAuthenticated:req.session.authenticate  || false,
    })
});

app.use(_404ErrorController.error404Controller);

// mongoClientConnect(client=>{   
//     app.listen(3000);
// })  

mongoose.connect(uri).then(()=>{
    console.log("server started with mongodb connection")
    // User.findOne().then(user=>{
    //     if(!user){
    //         const user=new User({
    //             username:"demoUser",
    //             useremail:"demo@test.com",
    //             cart:{items:[]}
    //         })
    //         user.save()
    //         .then(result=>{
    //             console.log("user created");
    //         });
    //     }
    // })
    app.listen(3000);
})
.catch((err)=>{
  console.log(err);
})

