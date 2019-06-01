const passport = require('passport')
const router = require('express').Router()
//const sigap = require('../database/connection')
var pgp = require("pg-promise")(/*options*/);
var sigap = pgp('postgres://modulo4:modulo4@67.205.143.180:5432/tcs2');
router.get('/', (req, res) => {
    res.redirect('/login')
})

router.get('/newpassword', (req, res) => {
    res.render('newPassword')
})

router.post('/newpassword', (req, res) => {
    const body = req.body

    sigap.one('SELECT * FROM USUARIO where user_name = $1', body.username)
        .then(function (data) {
            sigap.any('SELECT * FROM comparar_password($1::character varying,$2::character varying)', [body.username, body.lastPassword])
                .then(data => {
                console.log('DATA:', data); // print data;
                if (body.newPassword == body.confirmPassword) {
                    if(data[0].comparar_password == 1){
                        sigap.one('UPDATE USUARIO set pass = $1::character varying where user_name = $2::character varying', [body.newPassword, body.username])
                        .then(function (data2) {
                            req.flash('login', "Contraseña cambiada correctamente")
                            res.redirect('/login')
                        })
                        .catch(function (err2) {
                            if (err2.received==0) {
                                res.redirect('/login')
                            }
                        })
                    }else{
                        res.render('newPassword', { message: "Contraseña incorrecta." })
                    }
                } else {
                    res.render('newPassword', { message: "Las contraseñas nuevas no son iguales." })
                }
            })
                .catch(error => {
                console.log('ERROR:', error); // print the error;
            });
        })
        .catch(function (error) {
            if (error.received == 0) {
                res.render('newPassword', { message: "No existe el usuario" })
            } else {
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
        return res.redirect('https://sigap-control-recibos-front.herokuapp.com/')
    }
    return next();

}
module.exports = router;