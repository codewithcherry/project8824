// this is the root file which will executed to start the node server

const express=require('express');

const path=require('path');

// const rootdir=require('../Backend/utils/utilpath') this code is not used because of template engine

const bodyParser=require("body-parser");

const _404ErrorController=require("./controllers/404controller.js")

const app=express();

app.set('view engine','pug');
app.set('views',"./views");

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,"public")));

const addProductsrouter=require('./routes/add-product.js');
const viewProductsrouter=require("./routes/view-products.js")
const homerouter=require('./routes/home.js');

app.use(addProductsrouter);
app.use(viewProductsrouter);
app.use(homerouter);


app.use(_404ErrorController.error404Controller);

app.listen(3000);