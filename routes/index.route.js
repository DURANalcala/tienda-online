const router = require('express').Router()
const ctl = require("../controllers")
const { pool } = require('../db')
const { authMid } = require('../middlewares/auth')
const md5 = require('blueimp-md5');


router.get("/", async (req, res) => {
    const [products] = await pool.query('SELECT * FROM product');
    res.render('index', { products, title: 'Main page' })
})


router.get('/accessDenied', (req, res) => {
    res.render('accessDenied', { title: '401 access denied' })
})

router.get('/shoppingCart', authMid, ctl.shoppingCartController.shoppingCart)

router.post('/addToShoppingCart', authMid, ctl.shoppingCartController.addToshoppingCart)
router.post('/removeFromShoppingCart', authMid, ctl.shoppingCartController.deleteFromShoppingCart)

router.get('/md5/:con', (req, res) => {
    res.send(md5(req.params.con))
})

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

router.get('/orders/', authMid, async (req, res) => {
    const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ?', [req.session.user.user_id]);
    /* Promise.all(orders.map(async (order) => {
        const [orders] = await pool.query('SELECT * FROM order_Details od LEFT JOIN product p ON p.product_id = od.product_id  WHERE od.order_id = ?', [order.order_id])
        return orders
    }))
    .then(orders => {
        const sm = orders.reduce((p, c) => {
            if(!p[c.order_id]) {
                p[c.order_id] = 
            };
            p[c.product_id].q++
            return p
        }, {});
        const products = Object.values(sm)
        console.log(orders)
        res.render('orders', { orders })
    }) */
    res.render('orders', { orders })
})




module.exports = router
