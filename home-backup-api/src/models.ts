import pool from './db';
import { User, FileMetadata } from './types';
import bcrypt from 'bcryptjs';

export class UserModel {
  static async create(username: string, password: string, role: string = 'member'): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *';
    const values = [username, hashedPassword, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUsername(username: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
}

export class FileModel {
  static async create(filename: string, originalName: string, path: string, size: number, mimetype: string, uploadedBy: number): Promise<FileMetadata> {
    const query = 'INSERT INTO files (filename, original_name, path, size, mimetype, uploaded_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [filename, originalName, path, size, mimetype, uploadedBy];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId: number): Promise<FileMetadata[]> {
    const query = 'SELECT * FROM files WHERE uploaded_by = $1 ORDER BY uploaded_at DESC';
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}