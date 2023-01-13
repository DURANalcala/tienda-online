const router = require('express').Router()
const ctl = require("../controllers")
const { pool } = require('../db')
const { authMid } = require('../middlewares/auth')


router.get("/", async (req, res) => {
    const [products] = await pool.query('SELECT * FROM product');
    res.render('index', { products, title: 'Main page' })
})


router.get('/accessDenied', (req, res) => {
    res.render('accessDenied', { title: '401 access denied' })
})

router.get('/shoppingCart', authMid, ctl.shoppingCartController.shoppingCart)

router.post('/addToShoppingCart', authMid, ctl.shoppingCartController.addToshoppingCart)

router.post('/pagar')
router.get('/pagar', async (req, res) => {
    const [metodos_de_pago] = await pool.query('SELECT * FROM metos_de_pago');
    res.render('pagar', { metodos_de_pago })
})

router.post('/selectEstado', (req, res) => {
    console.log(req.body)
    res.send({ msg: 'selected', body: req.body })
})


module.exports = router
