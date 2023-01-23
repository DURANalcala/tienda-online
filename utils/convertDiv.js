function convertDiv(from = 'USD', to = 'BS', amount) {
    if (from === 'USD' && to === 'BS') {
        return  parseFloat( ( parseFloat(amount) * 20.00 ).toFixed(4) )
    }
}

module.exports = {
    convertDiv
}