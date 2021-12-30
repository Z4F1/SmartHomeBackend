const jwt = require("jsonwebtoken")

async function CheckToken(req, res, next){
    //Check token
    if(!req.headers["token"]){
        req.authorized = false
    }else {
        try {
            const data = await jwt.verify(req.headers["token"], process.env.SECRETKEY)

            delete data.exp
            delete data.iat

            req.userdata = data
            req.authorized = true
        } catch (error) {
            req.authorized = false
        }
    }
    next()
}

function NeedsAuthorization(req, res, next){
    if(req.authorized){
        next()
    }else {
        res.status(401)
        next(new Error("Not authorized."))
    }
}

async function Sign(data){
    const token = await jwt.sign(data, process.env.SECRETKEY, {
        expiresIn: "300m"
    })
    return token
}

module.exports = {CheckToken, NeedsAuthorization, Sign}