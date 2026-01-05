"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                res.status(401).json({ message: 'Invalid token' });
                return;
            }
            req.user = user;
            next();
        });
    }
    else {
        res.status(401).json({ message: 'Authorization header missing' });
    }
};
exports.authenticateJWT = authenticateJWT;
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=middleware.js.map