function isAllowedEmail(email) {
    return email.toLowerCase().endsWith("@gmail.com");
}

module.exports = isAllowedEmail;