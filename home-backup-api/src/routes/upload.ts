import { Response, Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { authenticateBasic } from '../middleware';
import { FileModel } from '../models';
import { AuthRequest } from '../types';

const router = Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req: AuthRequest, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('File type not allowed!'));
  }
};

const upload = multer({
  storage: storage,
  // limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
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
router.post('/upload-files', authenticateBasic, upload.array('files'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const files = req.files as Express.Multer.File[];
    const uploadedFiles = [];

    for (const file of files) {
      const fileRecord = await FileModel.create(
        file.filename,
        file.originalname,
        file.path,
        file.size,
        file.mimetype,
        req.user!.id
      );
      uploadedFiles.push({
        id: fileRecord.id,
        filename: fileRecord.filename,
        original_name: fileRecord.original_name
      });
    }

    res.status(201).json({ message: 'Files uploaded successfully', files: uploadedFiles });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;