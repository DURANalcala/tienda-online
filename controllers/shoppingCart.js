
const shoppingCartController = (pool) => async (req, res) => {
    const [sc] = await pool.query('SELECT p.* from shopping_cart sc INNER JOIN product p ON p.product_id = sc.product_id')
    const sm = sc.reduce((p, c) => {
        if(!p[c.product_id]) {
            p[c.product_id] = { q: 0, ...c }
        };
        p[c.product_id].q++
        return p
    }, {});
    console.log(sc, sm)
    const products = Object.values(sm)
    res.render('shoppingCart', { products })
}

const addToshoppingCart = (pool) => async (req, res) => {
    try {
        const {user_id, product_id, quantity} = req.body
        await pool.query('insert into shopping_cart (user_id, product_id, quantity) values (?, ?, ?)', [user_id, product_id, quantity])  
        res.send({msg: 'everything is fine'})  
    } catch (error) {
        req.session.errors = [error.message]   
    }
}

module.exports = {
    shoppingCartController,
    addToshoppingCart
}
