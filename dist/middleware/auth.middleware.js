"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_utils_1 = require("../utils/response.utils");
const tokenBlacklist_1 = require("../utils/tokenBlacklist");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
function verifyToken(req, res, next) {
    try {
        const authHeader = req.header("Authorization") || req.header("authorization");
        const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.replace("Bearer ", "");
        if (!token) {
            return (0, response_utils_1.errorResponse)(res, 401, "Access denied");
        }
        if (tokenBlacklist_1.tokenBlacklist.has(token)) {
            return (0, response_utils_1.errorResponse)(res, 401, "Token is invalidated");
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded && decoded._id) {
            req.userId = decoded._id;
            next();
        }
        else {
            return (0, response_utils_1.errorResponse)(res, 401, "Invalid token payload.");
        }
    }
    catch (error) {
        return (0, response_utils_1.errorResponse)(res, 401, "Invalid token");
    }
}
