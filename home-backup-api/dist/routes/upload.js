"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const middleware_1 = require("../middleware");
const models_1 = require("../models");
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
router.post('/upload-files', middleware_1.authenticateBasic, (0, multer_1.default)({ storage: storage }).array('files'), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }
        const files = req.files;
        const uploadedFiles = [];
        // Define allowed file types
        const allowedMimeTypes = [
            // Images
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            // Documents
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            // Text files
            'text/plain',
            'text/csv',
            'text/html',
            // Archives
            'application/zip',
            'application/x-rar-compressed',
            'application/x-tar',
            'application/gzip',
            // Audio/Video (optional - comment out if not needed)
            // 'audio/mpeg',
            // 'video/mp4',
            // 'video/mpeg',
        ];
        // Define max file size (10MB)
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
        for (const file of files) {
            // Check file type
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return res.status(400).json({
                    message: `File type not allowed: ${file.originalname}`,
                    details: {
                        filename: file.originalname,
                        mimeType: file.mimetype,
                        allowedTypes: allowedMimeTypes.slice(0, 10), // Show first 10 for reference
                        suggestion: 'Please upload a valid image, document, or archive file'
                    }
                });
            }
            // Check file size
            if (file.size > MAX_FILE_SIZE) {
                const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
                return res.status(400).json({
                    message: `File too large: ${file.originalname}`,
                    details: {
                        filename: file.originalname,
                        fileSize: `${fileSizeMB} MB`,
                        maxAllowedSize: `${maxSizeMB} MB`,
                        suggestion: 'Please compress the file or upload a smaller version'
                    }
                });
            }
            // Check for potentially dangerous files
            const dangerousExtensions = ['.exe', '.bat', '.cmd', '.sh', '.js', '.php', '.py'];
            const fileExtension = path_1.default.extname(file.originalname).toLowerCase();
            if (dangerousExtensions.includes(fileExtension)) {
                return res.status(400).json({
                    message: 'Potentially dangerous file detected',
                    details: {
                        filename: file.originalname,
                        extension: fileExtension,
                        reason: 'Executable or script files are not allowed for security reasons'
                    }
                });
            }
            // Validate filename length
            if (file.originalname.length > 255) {
                return res.status(400).json({
                    message: 'Filename too long',
                    details: {
                        filename: file.originalname,
                        length: file.originalname.length,
                        maxLength: 255,
                        suggestion: 'Please rename the file with a shorter name'
                    }
                });
            }
            // Check for empty files
            if (file.size === 0) {
                return res.status(400).json({
                    message: 'Empty file detected',
                    details: {
                        filename: file.originalname,
                        suggestion: 'The file appears to be empty. Please upload a valid file.'
                    }
                });
            }
            // If all validations pass, save the file
            const fileRecord = await models_1.FileModel.create(file.filename, file.originalname, file.path, file.size, file.mimetype, req.user.id);
            uploadedFiles.push({
                id: fileRecord.id,
                filename: fileRecord.filename,
                original_name: fileRecord.original_name,
                size: fileRecord.size,
                mimeType: fileRecord.mimetype,
                uploaded_at: fileRecord.uploaded_at
            });
        }
        res.status(201).json({
            message: `${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''} uploaded successfully`,
            files: uploadedFiles,
            summary: {
                totalFiles: uploadedFiles.length,
                totalSize: uploadedFiles.reduce((sum, file) => sum + file.size, 0)
            }
        });
    }
    catch (error) {
        console.error('Upload error:', error);
        // Handle specific database errors
        if (error.code === '23505') { // PostgreSQL unique violation
            return res.status(409).json({
                message: 'File with this name already exists',
                details: error.detail
            });
        }
        if (error.code === '23503') { // PostgreSQL foreign key violation
            return res.status(400).json({
                message: 'Invalid user reference',
                details: 'The user associated with this upload does not exist'
            });
        }
        if (error.name === 'SequelizeValidationError' || error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                details: error.errors ? error.errors.map((e) => e.message) : error.message
            });
        }
        // Handle disk space errors
        if (error.code === 'ENOSPC') {
            return res.status(507).json({
                message: 'Insufficient disk space',
                details: 'The server has run out of storage space. Please try again later or contact administrator.'
            });
        }
        // Handle file system errors
        if (error.code === 'ENOENT') {
            return res.status(500).json({
                message: 'Upload directory not accessible',
                details: 'The server upload directory is not properly configured'
            });
        }
        // Default error response
        res.status(500).json({
            message: 'File upload failed',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
            errorId: Date.now() // Optional: for tracking in logs
        });
    }
});
// Get number of uploaded files for the authenticated user
router.get('/upload-files/count', middleware_1.authenticateBasic, async (req, res) => {
    try {
        const userId = req.user.id;
        const fileCount = await models_1.FileModel.countByUserId(userId);
        res.status(200).json({ count: fileCount });
    }
    catch (error) {
        console.error('Count error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Get Recently uploaded files for the authenticated user
router.get('/upload-files/recent', middleware_1.authenticateBasic, async (req, res) => {
    try {
        const userId = req.user.id;
        const files = await models_1.FileModel.findByUserId(userId);
        res.status(200).json({ files });
    }
    catch (error) {
        console.error('Fetch recent files error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//Get total storage of the server and storage used by the authenticated user using df command (available disk space and remaining disk space)
router.get('/upload-files/storage', middleware_1.authenticateBasic, async (req, res) => {
    try {
        const userId = req.user.id;
        const files = await models_1.FileModel.findByUserId(userId);
        const storageUsed = files.reduce((total, file) => total + file.size, 0);
        // Get total storage of the server using df command
        const exec = require('child_process').exec;
        exec('df -k .', (error, stdout) => {
            if (error) {
                console.error('Error fetching disk space:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
            const lines = stdout.trim().split('\n');
            const diskInfo = lines[lines.length - 1].split(/\s+/);
            const totalStorage = parseInt(diskInfo[1], 10) * 1024; // in bytes
            const remainingStorage = parseInt(diskInfo[3], 10) * 1024; // in bytes
            res.status(200).json({ storageUsed, totalStorage, remainingStorage });
        });
    }
    catch (error) {
        console.error('Fetch storage used error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=upload.js.map