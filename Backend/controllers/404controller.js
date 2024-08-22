exports.error404Controller=(req,res,next)=>{
    
    res.render('404',{pagetitle:"Not responding | 404 Error"});
}