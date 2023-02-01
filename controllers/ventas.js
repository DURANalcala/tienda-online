const { convertDiv } = require("../utils/convertDiv")



module.exports = class VentasController {

    constructor(pool) {
        this.pool= pool
    }

    registrarVenta = async (req, res) => {
        try {
            const rand = (range) => Math.round(Math.random() * range)
            const {
                tipo_de_pago,
                precio_total,
                ref_pago,
                iva,
                pt_b,
                pt_d,
                tres_porciento_dolares
            } = req.body
            const user = req.session.user
            const TIPO_DE_PAGO_DOLARES = tipo_de_pago === 'USD'
            const ifTruReturn = (condition, ifTrue, ifFalse) => condition ? ifTrue : ifFalse;
           const sql = ifTruReturn( tipo_de_pago === "USD",
           'INSERT INTO factura (factura_id, precio_total, ref_pago, user_id, IVA, tres_porciento_dolares, p_t_$) VALUES (?, ?, ?, ?, ?, ?, ?);'
           , 
           'INSERT INTO factura (factura_id, precio_total, ref_pago, user_id, IVA, p_t_bs) VALUES (?, ?, ?, ?, ?, ?);'
           )
           
          const valuesForTable = ifTruReturn(TIPO_DE_PAGO_DOLARES, 
            [   rand(10000), 
                precio_total, 
                rand(10000), 
                user.user_id, 
                iva,
                tres_porciento_dolares,
                pt_d
            ],
            [   rand(10000), 
                convertDiv('USD', 'BS', precio_total), 
                ref_pago, 
                user.user_id, 
                iva,
                pt_b
            ]
            )
            /*const [sc] = await pool.query('SELECT p.* from shopping_cart sc LEFT JOIN product p ON p.product_id = sc.product_id WHERE sc.user_id = ?', [req.session.user.user_id])
            const sm = sc.reduce((p, c) => {
                if(!p[c.product_id]) {
                    p[c.product_id] = { q: 0, ...c }
                };
                p[c.product_id].q++
                return p
            }, {});
            const product = sm[0].q
            */
            const cabezeraSql = "INSERT INTO `cabezera_empresa` (`nombre_empresa`, `direccion_empresa`, `factura_id`) VALUES (?, ?, ?)"
            const [sc] = await this.pool.query('SELECT p.* from shopping_cart sc LEFT JOIN product p ON p.product_id = sc.product_id WHERE sc.user_id = ?', [req.session.user.user_id])
            const sm = sc.reduce((p, c) => {
                if(!p[c.product_id]) {
                    p[c.product_id] = { q: 0, ...c }
                };
                p[c.product_id].q++
                return p
            }, {});
            const products = Object.values(sm)
            console.log("ventas", products)
            const historialSQL = "INSERT INTO `historial` (`factura_id`, `user_id`) VALUES (?, ?)"
            const orderSql = "INSERT INTO `orders` (`precio_total`, `fecha`, `user_id`) VALUES (?, current_timestamp(), ?)"
            const orderDetailsSql = "INSERT INTO `order_Details` (`product_id`, `price`, `cantidad`, `order_id`) VALUES (?, ?, ?, ?)"
            //await this.pool.query(cabezeraSql, ['Tina', 'direccion empresa', insertId])
            //await this.pool.query(historialSQL, [insertId, user.user_id])
           const [{ insertId: orderId }] = await this.pool.query(orderSql, [precio_total, user.user_id])
           let self = this
           const [{ insertId: facturaId }] = await this.pool.query(sql, valuesForTable)
           Promise.all(products.map(async (x) => {
               const row = await self.pool.query(orderDetailsSql, [x.product_id, x.price, x.q, orderId])
               return row
           }))
           .then((value) => {
                res.redirect(`/factura/${facturaId}`)
           })
           //res.redirect('/')
        } catch (error) {
            console.log(error)
            req.session.errors = [error.message]
            res.redirect('back')
        }
    }

    getOrders = async (req, res) => {
        try {
           const [orders] = await this.pool.query("SELECT codigo_factura, ref_pago, IVA, tres_porciento_dolares, precio_total, pt_$, pt_b, fecha  FROM historial WHERE user_id = ?", [req.session.user.user_id]);
           res.render('orders', { orders })
        } catch (error) {
            console.log(error)
            req.session.errors = [error.message]
            res.redirect('back')
        }
    }

}
