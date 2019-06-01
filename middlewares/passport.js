
sigap = require('../database/connection')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.serializeUser((user, done) => {
    done(null, user.id_usuario);
});

passport.deserializeUser((id, done) => {

    sigap.one('SELECT id_usuario, user_name FROM USUARIO WHERE id_usuario = $1', id)
        .then(function (data) {
            return done(null, data)
        }).catch(function (error) {
            return done(error)
        })
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, username, password, done) {
    sigap.one('SELECT * FROM USUARIO WHERE user_name = $1', username)
        .then(function (data) {
            sigap.any('SELECT * FROM comparar_password($1::character varying,$2::character varying)', [username, password])
                .then(data2 => {
                console.log('DATA:', data2); // print data;
                    if(data2[0].comparar_password == 1){
                        return done(null, data)
                    }else{
                        return done(null, false, req.flash('login', 'Contraseña incorrecta.'))
                    }
               
            })
        })
        .catch(function (error) {
            if (error.received == 0) {
                return done(null, false, req.flash('login', 'Nombre de usuario no registrado.'))
            } else {
                return done(error)
            }
        });
}
));



module.exports = passport;