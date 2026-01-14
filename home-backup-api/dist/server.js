"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const upload_1 = __importDefault(require("./routes/upload"));
const middleware_1 = require("./middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
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
const specs = (0, swagger_jsdoc_1.default)(options);
// ✅ FIX: Allow both localhost AND your IP
// const corsOptions = {
//   // This is the URL of your FRONTEND (where the user types in the browser)
//   origin: 'https://home.tail2b1f38.ts.net',
//   methods: 'GET,POST,PUT,DELETE',
//   credentials: true
// };
// Allow CORS for all origins
// app.use(cors(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Swagger UI
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api', upload_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Error handling middleware
app.use(middleware_1.errorHandler);
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});
//# sourceMappingURL=server.js.map