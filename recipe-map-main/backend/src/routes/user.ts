import express from 'express';
import pool from '../database/connection';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, weight, height, age, gender, activity_level, goal, created_at, updated_at FROM users WHERE id = $1',
      [req.user!.id]
    );

    if (result.rows.length === 0) {
      return next(createError('User not found', 404));
    }

    const response: ApiResponse = {
      success: true,
      data: result.rows[0],
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { weight, height, age, gender, activity_level, goal } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET weight = COALESCE($1, weight),
           height = COALESCE($2, height),
           age = COALESCE($3, age),
           gender = COALESCE($4, gender),
           activity_level = COALESCE($5, activity_level),
           goal = COALESCE($6, goal),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING id, username, email, weight, height, age, gender, activity_level, goal, updated_at`,
      [weight, height, age, gender, activity_level, goal, req.user!.id]
    );

    const response: ApiResponse = {
      success: true,
      data: result.rows[0],
      message: 'Profile updated successfully',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
