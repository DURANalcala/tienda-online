
module.exports = class ProductController {

    constructor(pool) {
        this.pool= pool
    }

    addProduct = async (req, res) => {
        try {
            const { price, name, quantity, description } = req.body;
            const fields = Object.values(req.body)
            fields.forEach(f => {
               console.log(req.body)
               if (f.length <= 0) {
                   throw new Error('Todos los campos deben ser llenados')
               }
            })
            const img_url = req.file?.path || '/img/default-image.png';
            const [{insertId}] = await this.pool.query(`INSERT INTO product 
               (name, price, quantity, description, img_url) 
               VALUES (?, ?, ?, ?, ?)
           `, [name, price, quantity, description, img_url])
           res.redirect('/products') 
        } catch (error) {
            console.log(error)
            req.session.errors = [error.message]
            res.redirect('/addProduct')
        }
    }

    editProductPost = async (req, res) => {
        try {
            const { product_id, price, name, quantity, description } = req.body
            console.log(req.body, req.file)
            await this.pool.query
            (`
                UPDATE 
                product 
                SET name = ?, price = ?, quantity = ?, description = ?, img_url = ?
                WHERE product_id = ?`, 
                [name, price, quantity, description, req.file.path, product_id]
            )
            res.redirect('/products')
        } catch (error) {
            console.log(error)
        }
    }

    editProductGet = async (req, res) => {
        try {
            const { productid } = req.params
            const [[product]] = await this.pool.query('SELECT * from product WHERE product_id = ?', [productid])
            res.render('editProduct', { product })
        } catch (error) {
            console.log(error)
        }
    }

    detailsProduct = async (req, res) => {
        const { productid } = req.params
        const [[product]] = await this.pool.query('SELECT * from product WHERE product_id = ?', [productid])
        res.render('detailsProduct', { product })
    }

    getProducts = async (req, res) => {
        const [products] = await pool.query('SELECT * from product')
        res.render('inventario-dashboard-products', { products })
    }

}