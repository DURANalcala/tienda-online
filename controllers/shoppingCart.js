
const shoppingCartController = (pool) => async (req, res) => {
    const [sc] = await pool.query('SELECT p.* from shopping_cart sc LEFT JOIN product p ON p.product_id = sc.product_id WHERE sc.user_id = ?', [req.session.user.user_id])
    const sm = sc.reduce((p, c) => {
        if(!p[c.product_id]) {
            p[c.product_id] = { q: 0, ...c }
        };
        p[c.product_id].q++
        return p
    }, {});
    const products = Object.values(sm)
    let subtotal = 0;
    products.forEach(p => {
        subtotal += (p.price * p.q)
    })
    const iva = parseFloat(((subtotal * 16 ) / 100).toFixed(4))
    const tres_porciento_dolares = parseFloat(((subtotal * 3 ) / 100).toFixed(4))
    const total = iva + subtotal + tres_porciento_dolares;
    
    res.render('shoppingCart', { products, subtotal, iva, total, tres_porciento_dolares })
}

const addToshoppingCart = (pool) => async (req, res) => {
    try {
        const { product_id, quantity} = req.body;
        const user_id = req.session.user.user_id;
        await pool.query('insert into shopping_cart (user_id, product_id, quantity) values (?, ?, ?)', [user_id, product_id, quantity])  
        res.redirect('back') 
    } catch (error) {
        req.session.errors = [error.message]   
    }
}


module.exports = {
    shoppingCartController,
    addToshoppingCart
}
