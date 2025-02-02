"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeOrder = exports.postPrintNote = exports.getOrderNotes = exports.getOrders = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const wooCommerceApi = axios_1.default.create({
    baseURL: "https://oneg-habika.co.il/wp-json/wc/v3",
    params: {
        consumer_key: process.env.WC_CONSUMER_KEY,
        consumer_secret: process.env.WC_CONSUMER_SECRET,
    },
});
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const perPage = Math.max(1, parseInt(req.query.per_page) || 20);
        const response = yield wooCommerceApi.get("/orders", {
            params: {
                page,
                per_page: perPage,
                orderby: "date",
                order: "desc",
                status: "processing",
            },
        });
        const totalOrders = parseInt(response.headers["x-wp-total"], 10) || 0;
        const totalPages = parseInt(response.headers["x-wp-totalpages"], 10) || 1;
        if (!Array.isArray(response.data)) {
            throw new Error(`Invalid response data format. Expected array, got ${typeof response.data}`);
        }
        const responseData = {
            orders: response.data,
            totalOrders,
            totalPages,
            currentPage: page,
            perPage,
            actualOrdersCount: response.data.length,
        };
        res.status(200).json(responseData);
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            res.status(((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) || 500).json({
                message: "Failed to fetch orders",
                details: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message,
                status: (_c = error.response) === null || _c === void 0 ? void 0 : _c.status,
            });
        }
        else {
            res.status(500).json({
                message: "An unknown error occurred",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }
});
exports.getOrders = getOrders;
const getOrderNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { orderId } = req.params;
    try {
        const response = yield wooCommerceApi.get(`/orders/${orderId}/notes`);
        res.status(200).json(response.data);
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error) && ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
            res.status(404).json({ message: "Order not found or has no notes" });
            return;
        }
        console.error(`Error fetching notes for order ${orderId}:`, error);
        res.status(500).json({ message: "Failed to fetch order notes" });
    }
});
exports.getOrderNotes = getOrderNotes;
const postPrintNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { orderId } = req.params;
    const { note } = req.body;
    if (!note) {
        res.status(400).json({ message: "Note content is required" });
        return;
    }
    try {
        const noteData = {
            note,
        };
        const response = yield wooCommerceApi.post(`/orders/${orderId}/notes`, noteData);
        res.status(201).json(response.data);
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error) && ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
            res
                .status(404)
                .json({ message: "Order not found or unable to post note" });
            return;
        }
        console.error("PrintSync Error:", error);
        res.status(500).json({ message: "Failed to post note in PrintSync" });
    }
});
exports.postPrintNote = postPrintNote;
const completeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { newStatus } = req.body;
    if (!newStatus) {
        res.status(400).json({ message: "Status is required." });
    }
    try {
        yield wooCommerceApi.put(`/orders/${orderId}`, {
            status: newStatus,
        });
        res.json({ message: "Order completed" });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error completing order ${orderId}:`, error.message);
            res.status(500).json({ message: "Failed to complete order" });
        }
        else {
            console.error(`Unknown error completing order ${orderId}:`, error);
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
});
exports.completeOrder = completeOrder;
