# Home Backup API

A TypeScript Express API for family file uploads with authentication, built with PostgreSQL.

## Features

- User registration and login with JWT authentication
- Secure file upload with type and size validation
- PostgreSQL database integration
- Swagger API documentation
- TypeScript for type safety
- CORS support for Angular frontend

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up PostgreSQL database:
   - Create a database named `home_backup`
   - Run the schema.sql file to create tables:
     ```bash
     psql -U your_username -d home_backup -f schema.sql
     ```

4. Configure environment variables:
   - Copy `.env` and update the values:
     ```
     PORT=3000
     JWT_SECRET=your_super_secret_jwt_key_here
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=home_backup
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     ```

## Usage

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

The API will be available at `http://localhost:3000`

## API Documentation

API documentation is available at `http://localhost:3000/api-docs` when the server is running.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### File Upload

- `POST /api/upload-files` - Upload files (requires authentication)

## File Upload

- Supported formats: JPEG, JPG, PNG, GIF, MP4, AVI, PDF, DOC, DOCX
- Maximum file size: 5MB per file
- Files are stored in the `uploads/` directory
- Metadata is stored in the database

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- File type and size validation
- CORS configured for Angular frontend

## Project Structure

```
src/
├── db.ts              # Database connection
├── middleware.ts      # Authentication and error handling middleware
├── models.ts          # Database models
├── routes/
│   ├── auth.ts        # Authentication routes
│   └── upload.ts      # File upload routes
├── server.ts          # Main server file
└── types.ts           # TypeScript interfaces
```

## Technologies Used

- Express.js
- TypeScript
- PostgreSQL
- JWT for authentication
- Multer for file uploads
- Swagger for API documentation
- bcryptjs for password hashing