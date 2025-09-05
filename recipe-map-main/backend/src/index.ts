import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { initializeDatabase } from './database/init';
import { errorHandler } from './middleware/errorHandler';
import { dbService } from './services/database';
import { importService } from './services/importService';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import ingredientRoutes from './routes/ingredient';
import recipeRoutes from './routes/recipe';
import supplementRoutes from './routes/supplement';
import nutritionRoutes from './routes/nutrition';
import intakeRoutes from './routes/intake';
import importRoutes from './routes/import';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/supplements', supplementRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/intake', intakeRoutes);
app.use('/api/import', importRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const healthStatus = await dbService.healthCheck();
    res.json(healthStatus);
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    });
  }
});

// Error handling middleware
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    // Only initialize PostgreSQL database if not using mock data
    if (process.env.USE_MOCK_DATA !== 'true') {
      await initializeDatabase();
      console.log('Database initialized successfully');
    } else {
      console.log('Using mock data - skipping database initialization');
    }
    
    // Auto-import data on startup if enabled
    if (process.env.AUTO_IMPORT_ON_STARTUP === 'true') {
      console.log('Auto-import enabled - importing data from import directory...');
      try {
        const importResult = await importService.importAllFiles();
        if (importResult.success) {
          console.log('Startup import completed successfully:', importResult.message);
        } else {
          console.warn('Startup import completed with warnings:', importResult.message);
        }
      } catch (error) {
        console.error('Startup import failed:', error);
        // Don't stop server startup if import fails
      }
    }
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`Mock data mode: ${process.env.USE_MOCK_DATA === 'true' ? 'ENABLED' : 'DISABLED'}`);
      console.log(`Auto-import on startup: ${process.env.AUTO_IMPORT_ON_STARTUP === 'true' ? 'ENABLED' : 'DISABLED'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
