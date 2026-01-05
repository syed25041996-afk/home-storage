"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileModel = exports.UserModel = void 0;
const db_1 = __importDefault(require("./db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserModel {
    static async create(username, password, role = 'member') {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const query = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *';
        const values = [username, hashedPassword, role];
        const result = await db_1.default.query(query, values);
        return result.rows[0];
    }
    static async findByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await db_1.default.query(query, [username]);
        return result.rows[0] || null;
    }
    static async findById(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await db_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
}
exports.UserModel = UserModel;
class FileModel {
    static async create(filename, originalName, path, size, mimetype, uploadedBy) {
        const query = 'INSERT INTO files (filename, original_name, path, size, mimetype, uploaded_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [filename, originalName, path, size, mimetype, uploadedBy];
        const result = await db_1.default.query(query, values);
        return result.rows[0];
    }
    static async findByUserId(userId) {
        const query = 'SELECT * FROM files WHERE uploaded_by = $1 ORDER BY uploaded_at DESC';
        const result = await db_1.default.query(query, [userId]);
        return result.rows;
    }
}
exports.FileModel = FileModel;
//# sourceMappingURL=models.js.map