const jwt = require('jsonwebtoken');
const LocalStorage = require('node-localstorage').LocalStorage;


function TokenStorage() {
    this.localStorage;
    if (typeof localStorage === "undefined" || localStorage === null) {
        this.localStorage = new LocalStorage('./scratch');
    }
}
TokenStorage.prototype.store = function (token) {
    // we use specific key for storing access token
    this.localStorage.setItem('token', token);
}
TokenStorage.prototype.get = function () {
    // we get access token back by using specific key
    return this.localStorage.getItem('token');
}
TokenStorage.prototype.remove = function () {
    return this.localStorage.removeItem('token');
}


function authUser(req, res, next) {
    const tokenStorage = new TokenStorage();
    const token = tokenStorage.get();

    if (!token) {
        return res.render('accessDenied');
        return res.status(401).json({
            "status": "failed",
            "code": 401,
            "messages": ["Access denied", "You must be logged in to view this page"]
        });
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();

    } catch (err) {
        const tokenStorage = new TokenStorage();
        tokenStorage.remove();
        return res.render('tokenExpired');
        return res.status(400).json({
            "status": "failed",
            "code": 400,
            "messages": ["Bad request", "Token is invalid"]
        });
    }

}

function ifLoggedInDontShowLoginPage(req, res, next) {
    const tokenStorage = new TokenStorage();
    const token = tokenStorage.get();
    if (!token) {
        return next();
    }
    // change this to the dashboard
    return res.redirect('dashboard')
}



module.exports = { authUser, ifLoggedInDontShowLoginPage, TokenStorage }