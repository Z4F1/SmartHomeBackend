const router = require("express").Router()

const User = require("./UsersModel")

const Auth = require("../auth")
const UserModel = require("./UsersModel")

router.post("/", async (req, res, next) => {
    try {
        const userEntry = new User(req.body)
        const user = await userEntry.save()

        res.json(user)
    } catch (error) {
        next(error)
    }
})

router.post("/login", async (req, res, next) => {
    try {
        const user = await UserModel.findOne({ username: req.body.username })
        
        if(user != null){
            const isMatch = await user.comparePassword(req.body.password)
        
            if(isMatch){
                const token = await Auth.Sign({_id: user._id})
                res.json(token)
            }else {
                res.status(401)
                throw new Error("Wrong credentials.")
            }
        }else {
            res.status(401)
            throw new Error("Wrong credentials.")
        }
    } catch (error) {
        next(error)
    }
})

router.use(Auth.NeedsAuthorization)

router.get("/", async(req, res, next) => {
    try {
        const user = await UserModel.findOne(req.userdata, "_id username name createdAt updatedAt")
        res.json(user)
    } catch (error) {
        next(error)
    }
})

router.put("/", async (req, res, next) => {
    try {
        const oldUser = await UserModel.findOne(req.userdata)
        Object.assign(oldUser, req.body)

        const user = await oldUser.save()

        res.json(user)
    }catch(error){
        next(error)
    }
})

module.exports = router