const router = require('express').Router()
const ctl = require("../controllers")
const { pool } = require('../db')


router.get("/", async (req, res) => {
    const [products] = await pool.query('SELECT * FROM product');
    res.render('index', { products, title: 'Main page' })
})


router.get('/accessDenied', (req, res) => {
    res.render('accessDenied', { title: '401 access denied' })
})

router.get('/shoppingCart', ctl.shoppingCartController.shoppingCart)

router.post('/addToShoppingCart', ctl.shoppingCartController.addToshoppingCart)

router.get('/pagar', (req, res) => {
    res.render('pagar', { data: { name: 'john' } })
})


module.exports = router
