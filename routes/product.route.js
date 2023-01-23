const router = require('express').Router()
const ctls = require('../controllers')
const { upload } = require('../libs/multer')
const { authMid, onlyInventario } = require('../middlewares/auth')

router.get('/addProduct', authMid, onlyInventario, (req, res) => {
    res.render('add-product')
})

router.post('/addProduct', authMid, onlyInventario, upload.single('product_img') , ctls.productController.addProduct)


router.get('/products', authMid, onlyInventario , ctls.productController.getProducts)

router.post('/editProduct', authMid, onlyInventario, upload.single('product_img') , ctls.productController.editProductPost)

router.get('/editProduct/:productid', authMid, onlyInventario , ctls.productController.editProductGet)

router.get('/detailsProduct/:productid', ctls.productController.detailsProduct)

router.get('/categories/:category', ctls.productController.categoriesProduct)

module.exports = router
