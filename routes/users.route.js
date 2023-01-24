const router = require('express').Router()
const ctls = require('../controllers')
const { onlyAdmin, onlyInventario, authMid, only } = require('../middlewares/auth');

router.get("/login", (req, res) => {
    console.log(req.session)
    res.render('login')
})

router.get("/signup", ctls.userController.signUp_get)

router.post('/signup', ctls.userController.signUp_post)

router.get('/logout', (req,res) => {
    req.session.user = null
    res.redirect('/')
})

router.post('/login', ctls.userController.login)

router.get('/contadorDashboard', authMid, only('contador') , ctls.userController.contadorDashboard)

router.get('/adminDashboard', authMid, onlyAdmin ,(req, res) => {
    res.render('admin-dashboard')
})

router.post('/aceptarFactura', authMid, only('contador'), ctls.userController.aceptarFactura)
router.post('/rechazarFactura', authMid, only('contador'), ctls.userController.rechazarFactura)
router.post('/devolucion', authMid, only('contador'), ctls.userController.devolucion)


router.get('/users', authMid, onlyAdmin , ctls.userController.usersDashboard)

router.get('/registrarEmpleado', authMid, onlyAdmin , ctls.userController.registrarEmpleado_get)

router.post('/registrarEmpleado', authMid, onlyAdmin, ctls.userController.registrarEmpleado)

router.get('/inventarioDashboard', authMid, onlyInventario , ctls.userController.inventarioDashboard)

router.post('/bloquearUsuario', authMid, onlyAdmin , ctls.userController.bloquearUsuario)

router.post('/desbloquearUsuario', authMid, onlyAdmin , ctls.userController.desbloquearUsuario)

module.exports = router
