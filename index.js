const express = require("express")
const app = express()
const port = process.env.PORT || 4000
const morgan = require('morgan')
const session = require('express-session')
const { pool } = require('./db')
const path = require('path')
const md5 = require('blueimp-md5')
const { validatePassword } = require("./utils/validators")
const { addToshoppingCart, shoppingCartController } = require("./controllers/shoppingCart")
const { authMid, onlyAdmin, onlyInventario } = require("./middlewares/auth")
const { redirecter } = require("./utils/redirecter")
const { upload } = require('./libs/multer')

app.use(express.static(path.join(__dirname, '/public')))
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.set('view engine', 'ejs')
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false}))

app.use((req, res, next) => {
    res.locals.user = req.session.user
    res.locals.errors = req.session.errors
    next()
})
app.get("/", async (req, res) => {
    const [products] = await pool.query('SELECT * FROM product');
    res.render('index', { products })
})

app.get("/login", (req, res) => {
    console.log(req.session)
    res.render('login')
})

app.get("/signup", async (req, res) => {
    const [ciudades] = await pool.query('SELECT * FROM ciudades');
    const [estados] = await pool.query('SELECT * FROM estados');
    const [municipios] = await pool.query('SELECT * FROM municipios');
    const [parroquias] = await pool.query('SELECT * FROM parroquias');
    const direccionData = { ciudades, estados, municipios, parroquias }
   // console.log(direccionData)
    res.render('signup', { direccionData })
})

app.post('/signup', async (req,res) => {
    try {
        const { p_nombre, 
            s_nombre, 
            p_apellido,
             s_apellido,  
             email, 
             password, 
             cedula, 
             telf,
             direccion_1,
             casa
            } = req.body;
         const fields = Object.values(req.body)
         fields.forEach(f => {
            console.log(req.body)
            if (f.length <= 0) {
                throw new Error('Todos los campos deben ser llenados')
            }
            if(!validatePassword(password)) {
                throw new Error('El password debe tener al menos 3 numeros')
            }
         })
         const hashedPassword = md5(password)
        const [{insertId}] = await pool.query('INSERT INTO direcciones (id_estado, id_ciudad, id_municipio, id_parroquia, direccion_1, casa ) VALUES (?, ?, ?, ?, ?, ?)',
       [1, 1, 1, 1, direccion_1, casa])
      const [row] = await pool.query('INSERT INTO users (p_nombre, s_nombre, p_apellido, s_apellido, status, email, password, cedula, telf, direccion_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
     [p_nombre, s_nombre, p_apellido,s_apellido, 'ACTIVO', email,hashedPassword,cedula,telf, insertId])
      
     res.redirect('/login')
    } catch (error) {
        console.log(error)
        req.session.errors = [error.message]
        res.redirect('/signup')
    }
    
})

app.get('/logout', (req,res) => {
    req.session.user = null
    res.redirect('/')
})

app.post('/login', async (req,res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = md5(password)
        if (email.length <= 0 || password.length <= 0) throw new Error('Todos los campos deben ser llenados');       
        const [[user]] = await pool.query('SELECT * from users WHERE email = ?', [email])
        if(!user) throw new Error('Email incorrecto');
        if(user.password.toString() !== hashedPassword) throw new Error('Contraseña incorrecta');
        const [[{rol_name}]] = await pool.query(`
        SELECT r.name AS rol_name FROM users_roles ur
        LEFT JOIN users u ON u.user_id = ur.user_id
        LEFT JOIN roles r ON r.rol_id = ur.rol_id
        WHERE ur.user_id = ?
    `, [user.user_id])  
        req.session.user = {...user, rol: rol_name}
        req.session.errors = []
        if(req.session.user.status === 'BLOQUEADO') throw new Error('Tu cuenta ha sido bloqueada');
        redirecter({res, rol: req.session.user.rol})
        //res.redirect('/')
    } catch (error) {
        req.session.errors = [error.message]
        res.redirect('/login')
    }
    
})


app.get('/detailsProduct/:productid', async (req, res) => {
    const { productid } = req.params
    const [[product]] = await pool.query('SELECT * from product WHERE product_id = ?', [productid])
    res.render('detailsProduct', { product })
})

app.get('/adminDashboard', authMid, onlyAdmin ,(req, res) => {
    res.render('admin-dashboard')
})

app.get('/users', authMid, onlyAdmin , async (req, res) => {
    const [users] = await pool.query('SELECT * from users')
    res.render('admin-dashboard-users', { users })
})

app.get('/registrarEmpleado', authMid, onlyAdmin , async (req, res) => {
    const [roles] = await pool.query('SELECT * from roles')
    res.render('registrar-empleado', { roles })
})

app.post('/registrarEmpleado', async (req,res) => {
    try {
        const user = req.session.user
        const { p_nombre, 
            s_nombre, 
            p_apellido,
             s_apellido,  
             email, 
             password, 
             cedula, 
             telf,
             direccion_1,
             casa,
             rol
            } = req.body;
         const fields = Object.values(req.body)
         fields.forEach(f => {
            console.log(req.body)
            if (f.length <= 0) {
                throw new Error('Todos los campos deben ser llenados')
            }
            if(!validatePassword(password)) {
                throw new Error('El password debe tener al menos 3 numeros')
            }
         })
         const hashedPassword = md5(password)
        const [{insertId}] = await pool.query('INSERT INTO direcciones (id_estado, id_ciudad, id_municipio, id_parroquia, direccion_1, casa ) VALUES (?, ?, ?, ?, ?, ?)',
       [1, 1, 1, 1, direccion_1, casa])
      const [row] = await pool.query('INSERT INTO users (p_nombre, s_nombre, p_apellido, s_apellido, status, email, password, cedula, telf, direccion_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
     [p_nombre, s_nombre, p_apellido,s_apellido, 'ACTIVO', email,hashedPassword,cedula,telf, insertId])
     await pool.query('INSERT INTO users_roles (user_id, rol_id) VALUES (?, ?)',[row.insertId, rol])
     res.redirect('/login')
    } catch (error) {
        console.log(error)
        req.session.errors = [error.message]
        res.redirect('/registrarEmpleado')
    }
    
})

app.get('/inventarioDashboard', authMid, onlyInventario , (req, res) => {
    res.render('inventario-dashboard')
})

app.get('/addProduct', authMid, onlyInventario , (req, res) => {
    res.render('add-product')
})

app.post('/addProduct', authMid, onlyInventario, upload.single('product_img') , async (req, res) => {
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
        const [{insertId}] = await pool.query(`INSERT INTO product 
           (name, price, quantity, description, img_url) 
           VALUES (?, ?, ?, ?, ?)
       `, [name, price, quantity, description, img_url])
       res.redirect('/products') 
    } catch (error) {
        console.log(error)
        req.session.errors = [error.message]
        res.redirect('/addProduct')
    }
})



app.get('/products', authMid, onlyInventario , async (req, res) => {
    const [products] = await pool.query('SELECT * from product')
    res.render('inventario-dashboard-products', { products })
})

app.get('/accessDenied', (req, res) => {
    res.render('accessDenied')
})

app.get('/shoppingCart', shoppingCartController(pool))

app.post('/addToShoppingCart', addToshoppingCart(pool))

app.get('/pagar', (req, res) => {
    res.render('pagar', { data: { name: 'john' } })
})

app.post('/bloquearUsuario', authMid, onlyAdmin ,async (req, res) => {
    try {
        const { user_id } = req.body
        await pool.query(`UPDATE users SET status = 'BLOQUEADO' WHERE user_id = ?`, [user_id])
        res.redirect('/users')
    } catch (error) {
        console.log(error)
    }
})

app.post('/desbloquearUsuario', authMid, onlyAdmin ,async (req, res) => {
    try {
        const { user_id } = req.body
        await pool.query(`UPDATE users SET status = 'ACTIVO' WHERE user_id = ?`, [user_id])
        res.redirect('/users')
    } catch (error) {
        console.log(error)
    }
})

app.post('/editProduct', authMid, onlyInventario, upload.single('product_img') ,async (req, res) => {
    try {
        const { product_id, price, name, quantity, description } = req.body
        console.log(req.body, req.file)
        await pool.query
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
})

app.get('/editProduct/:productid', authMid, onlyInventario ,async (req, res) => {
    try {
        const { productid } = req.params
        const [[product]] = await pool.query('SELECT * from product WHERE product_id = ?', [productid])
        res.render('editProduct', { product })
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => {
    console.log("server on http://localhost:" + port)
})