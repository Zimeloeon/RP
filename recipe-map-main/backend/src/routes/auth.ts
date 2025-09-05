import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbService } from '../services/database';
import { validateSchema, loginSchema, registerSchema } from '../middleware/validation';
import { createError } from '../middleware/errorHandler';
import { ApiResponse, AuthResponse } from '../types';

const router = express.Router();

// Register
router.post('/register', validateSchema(registerSchema), async (req, res, next) => {
  try {
    const {
      username,
      email,
      password,
      weight,
      height,
      age,
      gender,
      activity_level
    } = req.body;

    // Check if user already exists
    const existingUserByEmail = await dbService.findUserByEmail(email);
    if (existingUserByEmail) {
      throw createError('Email already exists', 400);
    }

    const existingUserByUsername = await dbService.findUserByUsername(username);
    if (existingUserByUsername) {
      throw createError('Username already exists', 400);
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    const user = await dbService.createUser({
      username,
      email,
      password_hash,
      weight,
      height,
      age,
      gender,
      activity_level: activity_level || 1.5,
      goal: 'maintain'
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as jwt.SignOptions
    );

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        token,
        user,
      },
      message: 'User registered successfully',
    };

    res.status(201).json(response);
  } catch (error: any) {
    if (error.code === '23505') {
      return next(createError('Username or email already exists', 409));
    }
    next(error);
  }
});

// Login
router.post('/login', validateSchema(loginSchema), async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await dbService.findUserByUsername(username);

    if (!user) {
      return next(createError('Invalid credentials', 401));
    }

    // In mock data mode, bypass password verification for easier testing
    const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';
    let isValidPassword = false;
    
    if (USE_MOCK_DATA) {
      // In mock mode, any password is accepted for existing users
      isValidPassword = true;
    } else {
      isValidPassword = await bcrypt.compare(password, user.password_hash);
    }

    if (!isValidPassword) {
      return next(createError('Invalid credentials', 401));
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET || 'default-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as jwt.SignOptions
    );

    const { password_hash, ...userWithoutPassword } = user;

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        token,
        user: userWithoutPassword,
      },
      message: 'Login successful',
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
