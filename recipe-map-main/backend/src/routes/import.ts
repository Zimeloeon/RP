import express from 'express';
import { importService } from '../services/importService';
import { authenticateToken } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

const router = express.Router();

/**
 * Import all JSON files from the import directory
 * POST /api/import/all
 */
router.post('/all', authenticateToken, async (req, res, next) => {
  try {
    console.log('Starting import of all files...');
    
    const result = await importService.importAllFiles();
    
    const response: ApiResponse<typeof result> = {
      success: result.success,
      data: result,
      message: result.message,
    };

    // Return appropriate status code
    const statusCode = result.success ? 200 : 400;
    res.status(statusCode).json(response);
    
  } catch (error) {
    console.error('Import all files error:', error);
    next(createError('Failed to import files', 500));
  }
});

/**
 * Import a specific file by name
 * POST /api/import/file/:filename
 */
router.post('/file/:filename', authenticateToken, async (req, res, next) => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      return next(createError('Filename is required', 400));
    }
    
    // Ensure filename has .json extension
    const jsonFilename = filename.endsWith('.json') ? filename : `${filename}.json`;
    
    console.log(`Starting import of file: ${jsonFilename}`);
    
    const result = await importService.importFile(jsonFilename);
    
    const response: ApiResponse<typeof result> = {
      success: result.success,
      data: result,
      message: result.message,
    };

    // Return appropriate status code
    const statusCode = result.success ? 200 : 400;
    res.status(statusCode).json(response);
    
  } catch (error) {
    console.error('Import file error:', error);
    next(createError('Failed to import file', 500));
  }
});

/**
 * Get import status/stats
 * GET /api/import/status
 */
router.get('/status', authenticateToken, async (req, res, next) => {
  try {
    // This could be expanded to show current import status, file listing, etc.
    const response: ApiResponse<{ message: string }> = {
      success: true,
      data: { message: 'Import service is available' },
      message: 'Import service status retrieved successfully',
    };

    res.json(response);
    
  } catch (error) {
    console.error('Import status error:', error);
    next(createError('Failed to get import status', 500));
  }
});

export default router;