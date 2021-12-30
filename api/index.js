const router = require("express").Router()
const Auth = require("./auth")

const users = require("./users")

router.use(Auth.CheckToken)

router.use("/users", users)

module.exports = router