class ExpressError extends Error {
    constructor(status){
        super()
        this.status = status
    }
}

module.exports = ExpressError