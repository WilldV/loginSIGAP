//modulos
const path = require('path')
const hbs = require('express-handlebars');
const session = require('express-session')
const flash = require('connect-flash');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const express = require('express');
const app = express();

//archivos
const routes = require('./routes')

const passport = require('./middlewares/passport')

//configuracion
app.set('PORT', process.env.PORT || '4000')

app.set('views', path.join(__dirname, 'views'))

app.engine('hbs', hbs());

app.set('view engine', 'hbs')

//middlewares
app.use(cookieParser())

app.use(bodyParser.urlencoded({extended: false}))

app.use(session({
    secret: 'sigap',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//rutas
app.use(routes)

app.listen(app.get('PORT'), () => {
    console.log('Server on port: '+ app.get('PORT'));
})