/**
 * PostgreSQL Database Connection Pool
 * 
 * Establishes and configures a connection pool for the PostgreSQL database.
 * Uses environment variables for configuration with sensible defaults for
 * development environments.
 * 
 * Configuration:
 * - Connection pooling with up to 20 concurrent connections
 * - 30-second idle timeout to free unused connections
 * - 2-second connection timeout to fail fast on connection issues
 * - Environment-based configuration for different deployment stages
 * 
 * Environment Variables:
 * - DB_HOST: Database server hostname (default: localhost)
 * - DB_PORT: Database server port (default: 5432)
 * - DB_NAME: Database name (default: nutrient_tracker)
 * - DB_USER: Database username (default: postgres)
 * - DB_PASSWORD: Database password (default: password)
 * 
 * @module DatabaseConnection
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * PostgreSQL connection pool configuration
 * 
 * Creates a connection pool with optimized settings for the nutrition
 * tracking application. The pool manages database connections efficiently
 * to handle multiple concurrent requests.
 */
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',           // Database server hostname
  port: parseInt(process.env.DB_PORT || '5432'),     // PostgreSQL default port
  database: process.env.DB_NAME || 'nutrient_tracker', // Application database name
  user: process.env.DB_USER || 'postgres',           // Database username
  password: process.env.DB_PASSWORD || 'password',   // Database password
  max: 20,                                            // Maximum number of clients in pool
  idleTimeoutMillis: 30000,                          // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000,                     // Timeout connection attempts after 2 seconds
});

export default pool;
