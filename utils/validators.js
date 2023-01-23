
function validatePassword(password) {
    return /\d{3}/.test(password)
}

function validateEmail(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

function AllFieldsAreRequired(body) {
    Object.values(body)
}

module.exports = {
    validatePassword,
    validateEmail
}