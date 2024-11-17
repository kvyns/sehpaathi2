// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const { createServer } = require('http');

// Initialize Express app
const app = express();
let server;

// Custom console logger with colors
const logger = {
    info: (...args) => console.log('\x1b[36m%s\x1b[0m', ...args),
    error: (...args) => console.error('\x1b[31m%s\x1b[0m', ...args),
    success: (...args) => console.log('\x1b[32m%s\x1b[0m', ...args),
    warn: (...args) => console.log('\x1b[33m%s\x1b[0m', ...args)
};

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'", 'https:', 'data:'],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: 'same-site' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 100 : 1000,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV === 'development'
});
app.use(limiter);

// Compression
app.use(compression({
    level: 6,
    threshold: 100 * 1024, // 100kb
    filter: (req, res) => {
        if (req.headers['x-no-compression']) return false;
        return compression.filter(req, res);
    }
}));

// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:5174').split(',');
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({
    limit: '100mb',
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined', {
        stream: { write: message => logger.info(message.trim()) }
    }));
}

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/files', require('./routes/files'));
app.use('/api/chat', require('./routes/chat'));
app.use('/docs', require('./routes/docs'));
app.use('/health', require('./routes/health'));

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sehpaathi - Engineering Education Platform</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .container {
                    max-width: 800px;
                    margin: 2rem auto;
                    padding: 2rem;
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 15px;
                    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
                }
                h1 {
                    color: #2c3e50;
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                    text-align: center;
                }
                .description {
                    color: #34495e;
                    text-align: center;
                    margin-bottom: 2rem;
                    font-size: 1.1rem;
                }
                .links {
                    display: flex;
                    justify-content: center;
                    gap: 1.5rem;
                    margin-top: 2rem;
                }
                .link-button {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.8rem 1.5rem;
                    background: #3498db;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }
                .link-button:hover {
                    background: #2980b9;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
                }
                .status {
                    margin-top: 2rem;
                    padding: 1rem;
                    background: #2ecc71;
                    color: white;
                    border-radius: 8px;
                    text-align: center;
                }
                .features {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                    margin-top: 2rem;
                }
                .feature {
                    padding: 1.5rem;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 10px;
                    text-align: center;
                }
                .feature h3 {
                    color: #2c3e50;
                    margin-bottom: 0.5rem;
                }
                .feature p {
                    color: #7f8c8d;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎓 Sehpaathi</h1>
                <p class="description">
                    Transforming engineering education through AI-powered learning and collaboration.
                </p>
                
                <div class="features">
                    <div class="feature">
                        <h3>AI-Powered Learning</h3>
                        <p>24/7 intelligent assistance for your educational journey</p>
                    </div>
                    <div class="feature">
                        <h3>Resource Management</h3>
                        <p>Centralized hub for all your study materials</p>
                    </div>
                    <div class="feature">
                        <h3>Collaboration</h3>
                        <p>Connect with peers and share knowledge seamlessly</p>
                    </div>
                </div>

                <div class="links">
                    <a href="/docs" class="link-button">📚 API Documentation</a>
                    <a href="/health" class="link-button">💓 System Status</a>
                </div>

                <div class="status">
                    ✨ Server is running and ready to empower your learning journey
                </div>
            </div>
        </body>
        </html>
    `);
});

// Custom error handler for JSON parsing
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        logger.error('JSON Parsing Error:', err);
        return res.status(400).json({
            error: 'Invalid JSON payload',
            message: process.env.NODE_ENV === 'development' ? err.message : 'Bad Request'
        });
    }
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
        requestId: req.id
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource does not exist'
    });
});

// Graceful shutdown handler
const gracefulShutdown = () => {
    logger.info('Received shutdown signal. Starting graceful shutdown...');
    
    if (server) {
        server.close((err) => {
            if (err) {
                logger.error('Error during server shutdown:', err);
                process.exit(1);
            }
            
            logger.info('Server closed successfully');
            process.exit(0);
        });

        // Force shutdown after timeout
        setTimeout(() => {
            logger.error('Could not close connections in time, forcefully shutting down');
            process.exit(1);
        }, 10000);
    }
};

// Process handlers
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    gracefulShutdown();
});

process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Rejection:', error);
    gracefulShutdown();
});

// Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        server = createServer(app);
        server.listen(PORT, () => {
            console.log('\n');
            logger.success('🚀 Server is running!');
            logger.info(`⚡️ Environment: ${process.env.NODE_ENV || 'development'}`);
            logger.info(`📚 Documentation: ${process.env.BASE_URL || `http://localhost:${PORT}`}/docs`);
            logger.info(`💓 Health Check: ${process.env.BASE_URL || `http://localhost:${PORT}`}/health`);
            console.log('\n');
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;