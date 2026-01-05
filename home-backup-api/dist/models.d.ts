import { User, FileMetadata } from './types';
export declare class UserModel {
    static create(username: string, password: string, role?: string): Promise<User>;
    static findByUsername(username: string): Promise<User | null>;
    static findById(id: number): Promise<User | null>;
}
export declare class FileModel {
    static create(filename: string, originalName: string, path: string, size: number, mimetype: string, uploadedBy: number): Promise<FileMetadata>;
    static findByUserId(userId: number): Promise<FileMetadata[]>;
}
//# sourceMappingURL=models.d.ts.map