import { Request } from 'express';
export interface User {
    id: number;
    username: string;
    password: string;
    role: string;
    created_at: Date;
}
export interface FileMetadata {
    id: number;
    filename: string;
    original_name: string;
    path: string;
    size: number;
    mimetype: string;
    uploaded_by: number;
    uploaded_at: Date;
}
export interface AuthRequest extends Request {
    user?: {
        id: number;
        username: string;
        role: string;
    };
}
export interface LoginRequest {
    username: string;
    password: string;
}
export interface RegisterRequest {
    username: string;
    password: string;
}
export interface UploadResponse {
    message: string;
    files: {
        id: number;
        filename: string;
        original_name: string;
    }[];
}
//# sourceMappingURL=types.d.ts.map