//  MIDDLEWARE PARA PROTEGER LAS RUTAS  
const passport = require('passport');
const authMw = (req, res, next) => {
    if(req.isAuthenticated){
        next();
    }
    res.redirect('/signin')
}
module.exports = authMw