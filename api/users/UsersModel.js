const mongoose = require("mongoose")
const { Schema } = mongoose
const bcrypt = require("bcrypt")

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        }
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function(next){
    let user = this

    if(!user.isModified("password")) return next()

    try {
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS))
        const hash = await bcrypt.hash(user.password, salt)

        user.password = hash
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods.comparePassword = async function(pass){
    let user = this

    return new Promise(async (res, rej) => {
        try {
            const isMatch = await bcrypt.compare(pass, user.password)

            res(isMatch)
        } catch (error) {
            rej(error)
        }
    })
}

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel