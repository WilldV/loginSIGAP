const passport = require('passport')
const router = require('express').Router()
const localStorage = require('localStorage');

router.get('/',(req, res) => {
    res.redirect('/login')
})

router.get('/login',(req, res) => {
    res.render('index', {message: req.flash('login')})
})

router.get('/facturas', isLogged,(req, res) => {
    res.send('Logeado')
    //res.redirect('https://sigap-control-recibos-front.herokuapp.com/')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        failureFlash : true // allow flash messages
    }, function (err, user, info) {
        if (err) {
            return next(err)}
        if (!user) {
            return res.redirect('/login'); }
        req.logIn(user, async function (err) {
            if (err) { return next(err); }
            return res.redirect('/facturas');
        });
    })(req, res, next);
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
})

function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        return res.redirect('/login');
    }
}
module.exports = router;