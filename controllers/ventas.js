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
           'INSERT INTO `factura` (`factura_id`, `precio_total`, `ref_pago`, `user_id`, `IVA`, `tres_porciento_dolares`, `p_t_$`) VALUES (?, ?, ?, ?, ?, ?, ?);'
           , 
           'INSERT INTO `factura` (`factura_id`, `precio_total`, `ref_pago`, `user_id`, `IVA`, `p_t_bs`) VALUES (?, ?, ?, ?, ?, ?);'
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
           const [{ insertId }] = await this.pool.query(sql, valuesForTable)
            const cabezeraSql = "INSERT INTO `cabezera_empresa` (`nombre_empresa`, `direccion_empresa`, `factura_id`) VALUES (?, ?, ?)"
            
            const historialSQL = "INSERT INTO `historial` (`factura_id`, `user_id`) VALUES (?, ?)"
            //await this.pool.query(cabezeraSql, ['Tina', 'direccion empresa', insertId])
            //await this.pool.query(historialSQL, [insertId, user.user_id])
            res.redirect(`/factura/${insertId}`)
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
