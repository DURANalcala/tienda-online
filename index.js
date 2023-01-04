const express = require("express")
const app = express()
const port = process.env.PORT || 4000
const morgan = require('morgan')
const session = require('express-session')
const path = require('path')
const router = require("./routes/index.route")
const expressEjsLayouts = require("express-ejs-layouts")

app.use(express.static(path.join(__dirname, '/public')))
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
app.use('css', express.static(path.join(__dirname, '/public/css')))
app.use('js', express.static(path.join(__dirname, '/public/js')))
app.use('img', express.static(path.join(__dirname, '/public/img')))
app.use('node_modules', express.static(path.join(__dirname, '/node_modules')))


app.use(expressEjsLayouts)

app.locals.chartjs = require('chart.js')

app.set('view engine', 'ejs')
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false}))

app.use((req, res, next) => {
    res.locals.user = req.session.user
    res.locals.errors = req.session.errors
    next()
})

app.use('/', router)
app.use(require('./routes/product.route'))
app.use(require('./routes/users.route'))


app.listen(port, () => {
    console.log("server on http://localhost:" + port)
})
