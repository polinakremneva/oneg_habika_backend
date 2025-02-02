"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
function successResponse(res, data, status = 200, message = "Success") {
    return void res.status(status).json({ message, data });
}
function errorResponse(res, status, message, error) {
    return void res.status(status).json({ message, error });
}
