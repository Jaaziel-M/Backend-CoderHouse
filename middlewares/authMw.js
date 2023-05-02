const authMw = (req, res, next) => {
    if(req.isAuthenticated()){
        console.log("Entró al if ")
        next();
    }
    console.log("NO Entró al if ")
    res.redirect('/signin')
}
module.exports = authMw;
