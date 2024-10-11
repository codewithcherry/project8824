const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const csrfProtection = require("csurf");
const session = require('express-session');
const mongoStore = require("connect-mongo");
const multer = require("multer");
const flash = require("connect-flash");

const { uri } = require("./utils/dbcredentials");
const _404ErrorController = require("./controllers/404controller");
const User = require("./models/users");

// Routes
const authRouter = require("./routes/authRouter");
const adminRouter = require('./routes/adminRoutes');
const shopRouter = require("./routes/shopRoutes");

// Initialize Express App
const app = express();

// View Engine Setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// MongoDB Session Store
const store = mongoStore.create({
    mongoUrl: uri,  // MongoDB connection URL
    collectionName: 'sessions',  // Collection where session data will be stored
    ttl: 14 * 24 * 60 * 60  // Time-to-live for sessions in seconds (14 days)
});

// Configure Multer for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname);
    }
});

//configure filter of types of files to be uploaded

const fileFilter=(req,file,cb)=>{
  if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg'){
    cb(null,true)
  }
  else{
    console.log("upload only png/jpg/jpeg" )
    cb(null,false)
  }
}

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage:storage ,fileFilter:fileFilter}).single('image'));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: 'your-secret-key', // Use a strong secret in production
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 14 } // 14 days
}));

app.use(csrfProtection());
app.use(flash());

// Pass CSRF token and other variables to every view
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.isAuthenticated = req.session.authenticate || false;
    next();
});

// Fetch user data and attach it to the req object if logged in
app.use(async (req, res, next) => {
    if (req.session.user) {
        try {
            const user = await User.findById(req.session.user._id);
            if (user) {
                req.user = user;  // Attach the user document to req.user
            }
        } catch (err) {
            console.error('Error fetching user:', err);
        }
    }
    next();  // Continue to the next middleware/route handler
});

// Routes
app.use(authRouter);
app.use(adminRouter);
app.use(shopRouter);

// 404 Error Handler
app.use(_404ErrorController.error404Controller);

// 500 Error Handler
app.use((error, req, res, next) => {
    console.error(error.message);
    res.status(500).render("500", {
        pageTitle: "500 Error",
        activeLink: "error",
        isAuthenticated: req.session.authenticate || false
    });
});

// Connect to MongoDB and start the server
mongoose.connect(uri)
    .then(() => {
        console.log("Server started with MongoDB connection");
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });
