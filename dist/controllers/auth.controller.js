"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenBlacklist_1 = require("../utils/tokenBlacklist");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const login = (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD) {
        const token = jsonwebtoken_1.default.sign({ _id: process.env.ADMIN_ID }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "480m" });
        res.json({ token });
    }
    else {
        res.status(401).json({ message: "Invalid credentials" });
    }
};
exports.login = login;
const logout = (req, res) => {
    const authHeader = req.header("Authorization") || req.header("authorization");
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.replace("Bearer ", "");
    if (!token) {
        res.status(400).json({ message: "Token is required" });
        return;
    }
    tokenBlacklist_1.tokenBlacklist.add(token);
    res.json({ message: "Logged out successfully" });
};
exports.logout = logout;
