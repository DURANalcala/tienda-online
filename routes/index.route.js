const router = require('express').Router()
const productRouter = require('./product.route')
const usersRouter = require('./users.route')
const ctl = require("../controllers")
const { pool } = require('../db')


router.get("/", async (req, res) => {
    const [products] = await pool.query('SELECT * FROM product');
    res.render('index', { products })
})


router.get('/accessDenied', (req, res) => {
    res.render('accessDenied')
})

router.get('/shoppingCart', ctl.shoppingCartController.shoppingCart)

router.post('/addToShoppingCart', ctl.shoppingCartController.addToshoppingCart)

router.get('/pagar', (req, res) => {
    res.render('pagar', { data: { name: 'john' } })
})

router.use(productRouter)
router.use(router)

module.exports = router
