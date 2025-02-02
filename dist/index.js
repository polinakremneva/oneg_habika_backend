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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const orders_route_1 = __importDefault(require("./routes/orders.route")); // Import orders routes
const auth_route_1 = __importDefault(require("./routes/auth.route")); // Import auth routes
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Middleware to serve static files
            app.use(express_1.default.static("public"));
            // Middleware to parse JSON
            app.use(express_1.default.json());
            // Middleware to handle CORS
            app.use((0, cors_1.default)());
            // API routes
            app.use("/api/orders", orders_route_1.default); // Attach orders routes
            app.use("/api/auth", auth_route_1.default); // Attach auth routes
            // Catch-all route for serving frontend
            app.get("*", (req, res) => {
                res.sendFile(path_1.default.join(__dirname, "public", "index.html"));
            });
            // Start the server
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
        }
        catch (error) {
            console.error("Failed to start the server:", error);
            process.exit(1); // Exit with failure
        }
    });
}
main();
