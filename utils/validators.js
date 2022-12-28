
function validatePassword(password) {
    return /\d{3}/.test(password)
}

module.exports = {
    validatePassword
}