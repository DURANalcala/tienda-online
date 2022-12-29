const pool = require('../db')
const Users = require('./users')
const Products = require('./product')
const { shoppingCartController, addToshoppingCart } = require('./shoppingCart')
const userController = new Users(pool)
const productController = new Products(pool)

module.exports = { 
    userController,
    productController,
    shoppingCartController: { shoppingCart: shoppingCartController(pool), addToshoppingCart: addToshoppingCart(pool) }
}