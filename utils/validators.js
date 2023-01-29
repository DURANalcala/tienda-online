
function validatePassword(password) {
    return /\d{3}/.test(password)
}

function validateEmail(email) {
    return /^\w+@\w+\.\w{2,3}$/.test(email) || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}


function AllFieldsAreRequired(body) {
    Object.values(body)
}

function validateIfItsNumber(text) {
    return /^[0-9]*(\.?)[ 0-9]+$/.test(text)
}

module.exports = {
    validatePassword,
    validateEmail,
    validateIfItsNumber
}