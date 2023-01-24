//const { pool } = require("../db")

async function authMid(req, res, next) {
    const user = req.session.user
    if(req.session.user) {
        next()
    } else {
        res.redirect('login')
    }
}

function only(rol) {
    return (req, res, next) => {
        const user = req.session.user
        if (user.rol === rol) {
            next()
        } else {
            res.redirect('accessDenied')
        }
    } 
}

async function onlyAdmin(req, res, next) {
    const user = req.session.user
    if (user.rol === 'admin') {
        next()
    } else {
        res.redirect('accessDenied')
    }
}

async function onlyInventario(req, res, next) {
    const user = req.session.user
    if (user.rol === 'inventario') {
        next()
    } else {
        res.redirect('accessDenied')
    }
}

module.exports = {authMid,onlyAdmin, onlyInventario, only}
