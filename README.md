# Home Backup System

A full-stack web application for secure family file storage and sharing, built with Angular (frontend) and Express.js with PostgreSQL (backend).

## 🚀 Features

### Frontend (Angular)
- **User Authentication**: Login and registration system
- **File Upload**: Drag-and-drop interface with progress tracking
- **File Management**: View and delete uploaded files
- **Dashboard**: Overview of storage usage, file counts, and recent uploads
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Real-time Feedback**: Loading indicators, success/error modals

### Backend (Express.js + PostgreSQL)
- **RESTful API**: Complete API for file operations and user management
- **Authentication**: JWT-based authentication with Basic Auth for file access
- **File Upload**: Secure file upload with type and size validation
- **Database Integration**: PostgreSQL with proper indexing
- **API Documentation**: Swagger UI documentation
- **Security**: Password hashing, CORS configuration, file validation

## 🏗️ Architecture

```
home-backup-system/
├── home-backup/          # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── dashboard/     # Main dashboard
│   │   │   │   ├── login/         # Authentication
│   │   │   │   ├── register/      # User registration
│   │   │   │   ├── header/        # Navigation
│   │   │   │   └── modals/        # Error/Success modals
│   │   │   ├── services/          # API services
│   │   │   └── shared/            # Shared utilities
│   │   └── environments/          # Environment configs
│   ├── Dockerfile                 # Frontend container
│   └── package.json
│
└── home-backup-api/      # Express.js Backend
    ├── src/
    │   ├── routes/                # API routes
    │   │   ├── auth.ts           # Authentication endpoints
    │   │   └── upload.ts         # File upload endpoints
    │   ├── models.ts             # Database models
    │   ├── middleware.ts         # Auth middleware
    │   ├── server.ts             # Main server
    │   └── types.ts              # TypeScript interfaces
    ├── schema.sql                # Database schema
    ├── Dockerfile                # Backend container
    └── package.json
```

## 🛠️ Technology Stack

### Frontend
- **Angular 21**: Modern web framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **RxJS**: Reactive programming
- **Vitest**: Testing framework

### Backend
- **Express.js**: Web framework for Node.js
- **TypeScript**: Type-safe development
- **PostgreSQL**: Relational database
- **JWT**: JSON Web Tokens for authentication
- **Multer**: File upload middleware
- **bcryptjs**: Password hashing
- **Swagger**: API documentation

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **Docker** (optional, for containerized deployment)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd home-backup-system
```

### 2. Setup Backend

```bash
cd home-backup-api

# Install dependencies
npm install

# Setup database
createdb home_backup
psql -U your_username -d home_backup -f schema.sql

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start development server
npm run dev
```

### 3. Setup Frontend

```bash
cd ../home-backup

# Install dependencies
npm install

# Start development server
npm start
```

### 4. Access the Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs

## 🔧 Configuration

### Environment Variables (Backend)

Create a `.env` file in `home-backup-api/`:

```env
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=home_backup
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

### API URL (Frontend)

Update `home-backup/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'  // Adjust as needed
};
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### File Operations
- `POST /api/upload-files` - Upload files
- `GET /api/upload-files/count` - Get file count
- `GET /api/upload-files/recent` - Get recent uploads
- `GET /api/upload-files/storage` - Get storage info
- `GET /api/upload-files/:id/view` - View file inline
- `DELETE /api/upload-files/:id` - Delete file

## 🐳 Docker Deployment

### Backend
```bash
cd home-backup-api
docker build -t home-backup-api .
docker run -p 3000:3000 --env-file .env home-backup-api
```

### Frontend
```bash
cd home-backup
docker build -t home-backup .
docker run -p 4200:4200 home-backup
```

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **JWT Authentication**: Token-based authentication
- **File Validation**: Type and size restrictions
- **CORS Configuration**: Proper cross-origin handling
- **Input Validation**: Server-side validation
- **SQL Injection Protection**: Parameterized queries

## 📁 File Upload Specifications

- **Supported Formats**: Images (JPEG, PNG, GIF, WebP), Videos (MP4, AVI), Documents (PDF, DOC, DOCX), Text files, Archives
- **Maximum File Size**: 10MB per file
- **Storage**: Local filesystem with database metadata
- **Naming**: Unique filenames to prevent conflicts

## 🧪 Testing

### Frontend
```bash
cd home-backup
npm test
```

### Backend
```bash
cd home-backup-api
npm test
```

## 📖 Development

### Code Style
- **Prettier**: Code formatting
- **ESLint**: Code linting (if configured)
- **TypeScript**: Strict type checking

### Project Structure
- **Components**: Reusable UI components
- **Services**: API communication and business logic
- **Shared**: Common utilities and services
- **Routes**: API endpoint definitions
- **Models**: Database interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For questions or issues, please open an issue in the repository.

---

**Note**: This application is designed for family use with proper authentication. Ensure proper security measures when deploying to production.