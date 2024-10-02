module.exports=(req,res,next)=>{
    if(!req.session.authenticate){
        return res.redirect("/login");
    }
    next();
}