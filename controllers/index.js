const {pool} = require('../db')
const Users = require('./users')
const Products = require('./product')
const Ventas = require('./ventas')

const { shoppingCartController, addToshoppingCart } = require('./shoppingCart')
const userController = new Users(pool)
const productController = new Products(pool)
const ventasController = new Ventas(pool)


module.exports = { 
    userController,
    productController,
    ventasController,
    shoppingCartController: { shoppingCart: shoppingCartController(pool), addToshoppingCart: addToshoppingCart(pool) }
}