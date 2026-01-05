"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const models_1 = require("../models");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
// Ensure uploads directory exists
const uploadsDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|pdf|doc|docx/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new Error('File type not allowed!'));
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter
});
/**
 * @swagger
 * /api/upload-files:
 *   post:
 *     summary: Upload files
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Files uploaded successfully
 *       400:
 *         description: No files uploaded or invalid files
 *       401:
 *         description: Unauthorized
 */
router.post('/upload-files', middleware_1.authenticateJWT, upload.array('files'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }
        const files = req.files;
        const uploadedFiles = [];
        for (const file of files) {
            const fileRecord = await models_1.FileModel.create(file.filename, file.originalname, file.path, file.size, file.mimetype, req.user.id);
            uploadedFiles.push({
                id: fileRecord.id,
                filename: fileRecord.filename,
                original_name: fileRecord.original_name
            });
        }
        res.status(201).json({ message: 'Files uploaded successfully', files: uploadedFiles });
    }
    catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=upload.js.map