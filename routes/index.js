const passport = require('passport')
const router = require('express').Router()
//const sigap = require('../database/connection')
var pgp = require("pg-promise")(/*options*/);
var sigap = pgp('postgres://modulo4:modulo4@67.205.143.180:5432/tcs2');
router.get('/', (req, res) => {
    res.redirect('/login')
})

router.get('/newpassword', (req, res) => {
    sigap.func('verificar_password', ['RCUBA', 123])
        .then(data => {
            console.log('DATA:', data); // print data;
        })
        .catch(error => {
            console.log('ERROR:', error); // print the error;
        });
    res.render('newPassword')
})

router.post('/newpassword', (req, res) => {
    const body = req.body
    console.log(body);

    sigap.one('SELECT * FROM USUARIO where user_name = $1', body.username)
        .then(function (data) {
            if (data.pass == body.lastPassword) {
                if (body.newPassword == body.confirmPassword) {
                    sigap.one('UPDATE USUARIO set pass = $1 where user_name = $2', [body.newPassword, body.username])
                        .then(function (data2) {
                            req.flash('login', "Contraseña cambiada correctamente")
                            res.redirect('/login')
                        })
                        .catch(function (err2) {
                            console.log(err2);

                            res.render('newPassword', { message: "Ha ocurrido un error" })
                        })
                } else {
                    res.render('newPassword', { message: "Las contraseñas nuevas no son iguales." })
                }
            } else {
                res.render('newPassword', { message: "Contraseña incorrecta." })
            }
        })
        .catch(function (error) {
            if (error.received == 0) {
                res.render('newPassword', { message: "No existe el usuario" })
            } else {
                console.log('as');
                console.log(error);

                res.render('newPassword', { message: "Ha ocurrido un error" })
            }
        })
})

router.get('/login', isLogged, (req, res) => {
    res.render('index', { message: req.flash('login') })
})

router.get('/facturas', isLogged, (req, res) => {
    res.redirect('/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        failureFlash: true // allow flash messages
    }, function (err, user, info) {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.redirect('/login');
        }
        req.logIn(user, async function (err) {
            if (err) { return next(err); }
            return res.redirect('/facturas');
        });
    })(req, res, next);
})

router.get('/logout', (req, res) => {
    console.log('Saliendo');

    req.logout();
    res.redirect('/login');
})

function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
        console.log(req.session);
        return res.redirect('http://localhost:4000')
        //return res.redirect('https://sigap-control-recibos-front.herokuapp.com/')
    }
    return next();

}
module.exports = router;