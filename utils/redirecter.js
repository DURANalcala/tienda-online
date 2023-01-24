const redirecter = ({res, rol}) => {
    switch (rol) {
        case 'admin':
            res.redirect('/adminDashboard') 
            break;
        case 'inventario':
            res.redirect('/inventarioDashboard') 
            break;
        case 'contador':
                res.redirect('/contadorDashboard') 
                break;
        default:
            res.redirect('/')
            break;
    }
}

module.exports = {
    redirecter
}