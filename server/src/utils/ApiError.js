class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            data: this.data,
            success: this.success,
            message: this.message,
            errors: this.errors
        };
    }
}

export {ApiError}