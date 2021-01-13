const createError = require('http-errors');

function notFoundError(req, res, next) {
    next(createError(404));
}

function errorLoger (error, req, res, next) {
    console.error('error catched on logger', error.message);
    next(error);
}

function errorResponse (error, req, res, next) {
    let status, message = error.message;
    if (error.response) {
        status = error.response.status;
        message = error.response.data;
    }
    
    res.status(status || 500);
    res.json({
        message,
    })
}

exports.notFoundError = notFoundError;
exports.errorLoger = errorLoger;
exports.errorResponse = errorResponse;
