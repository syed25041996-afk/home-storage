import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import uploadRoutes from './routes/upload';
import { errorHandler } from './middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Home Backup API',
    version: '1.0.0',
    description: 'API for family file uploads with authentication',
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(options);

// Middleware
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', uploadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});