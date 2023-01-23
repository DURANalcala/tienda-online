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

/* router.post('/pagar', authMid, (req, res) => {
   const { total } = req.body
   res.redirect(`/pagar/${total}`)
})
 */
router.post('/pagar', authMid, async (req, res) => {
    const [metodos_de_pago] = await pool.query('SELECT * FROM metos_de_pago');
    const [bancos] = await pool.query('SELECT * FROM bancos');
    const { total, iva, tres_porciento_dolares } = req.body
    res.render('pagar', { metodos_de_pago, bancos, total, iva, tres_porciento_dolares })
})

router.post('/pagarProducto', authMid, async (req, res) => {
    const [metodos_de_pago] = await pool.query('SELECT * FROM metos_de_pago');
    const [bancos] = await pool.query('SELECT * FROM bancos');
    const { subtotal } = req.body
    const iva = parseFloat(((subtotal * 16 ) / 100).toFixed(4))
    const tres_porciento_dolares = parseFloat(((subtotal * 3 ) / 100).toFixed(4))
    const total = iva + subtotal + tres_porciento_dolares;
    res.render('pagar', { metodos_de_pago, bancos, total, iva, tres_porciento_dolares })
})

router.post('/registrarVenta',authMid,  ctl.ventasController.registrarVenta)

router.get('/factura/:id', authMid, (req, res) => {
    const id = req.params.id
    res.render('factura')
})

router.post('/selectEstado', (req, res) => {
    console.log(req.body)
    res.send({ msg: 'selected', body: req.body })
})


module.exports = router
