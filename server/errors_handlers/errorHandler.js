const AppError = require("./AppError");

const mongooseErrorHandler = err => {
    let message = err.message;
    switch (err.name) {
        case "CastError":
            message = `Invalid ${err.path}: ${err.value}`;
            break;
        case 11000:
            message = `Duplicate field value. Please use another value!`;
            break;
        case "ValidationError":
            let errorMsg = Object.values(err.errors).map(el => el.message);
            message = `Invalid input data. ${errorMsg.join(". ")}`;
            break;
    }
    return new AppError(message, 400);
};

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";
    const error = mongooseErrorHandler(err);
    return res.status(error.statusCode).json({ message: error.message });
};

module.exports = errorHandler;
