const express = require("express")
const app = express()
const port = process.env.PORT || 4000
const morgan = require('morgan')
const session = require('express-session')
const { pool } = require('./db')
const path = require('path')
const { validatePassword } = require("./utils/validators")
const { authMid, onlyAdmin, onlyInventario } = require("./middlewares/auth")
const { redirecter } = require("./utils/redirecter")
const { upload } = require('./libs/multer')
const router = require("./routes/index.route")

app.use(express.static(path.join(__dirname, '/public')))
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

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

app.listen(port, () => {
    console.log("server on http://localhost:" + port)
})