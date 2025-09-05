#!/bin/bash

# Start the backend with mock data enabled
echo "Starting backend with mock data..."
echo "This allows testing the frontend without requiring PostgreSQL database"

# Copy the mock env file
cp .env.mock .env

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Start the development server
echo "Starting server on port 3001..."
npm run dev
