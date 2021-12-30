const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
}

const errorHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode)
    res.json(process.env.NODE_ENV == "development" ? {
            message: error.message, stack: error.stack
        } : {
            message: error.message
        })
}
  
module.exports = {
    notFound,
    errorHandler,
}