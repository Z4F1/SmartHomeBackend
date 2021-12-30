const express = require("express")
const app = express()
const mongoose = require("mongoose")

require("dotenv").config()

const morgan = require("morgan")
const helmet = require("helmet")

const middlewares = require("./middleware")
const api = require("./api")

mongoose.connect(process.env.DB)

app.use(morgan("\x1b[40m\x1b[0m\x1b[1m[:date[clf]] \t\x1b[36m Code: :status \t\x1b[35m Time: :response-time ms \t\x1b[33m Length: :res[content-length] \t\x1b[34mRequested: \":method :url HTTP/:http-version\"\x1b[0m"))
app.use(helmet())
app.use(express.json())

app.get("/", (req, res) => {
    res.json({
        message: "Backend"
    })
})

app.use("/api", api)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

app.listen(process.env.PORT, () => {
    console.log("Listening to port %s", process.env.PORT)
})