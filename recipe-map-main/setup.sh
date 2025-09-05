#!/bin/bash

echo "🍎 Nutrient Tracker Application Setup"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Please run this script from the recipe-map directory"
    exit 1
fi

# Check for Node.js and npm
if ! command -v node >/dev/null 2>&1; then
    echo "❌ Node.js is not installed."
    echo "   Please install Node.js v18+ from: https://nodejs.org/"
    exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
    echo "❌ npm is not installed."
    echo "   Please install npm (usually comes with Node.js)"
    exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//')
echo "✅ Node.js version: $NODE_VERSION"
echo "✅ npm version: $(npm --version)"

# Check for PostgreSQL
if ! command -v psql >/dev/null 2>&1; then
    echo "⚠️  PostgreSQL client not found."
    echo "   Please install PostgreSQL and ensure it's running"
    echo "   Create a database named 'nutrient_tracker'"
else
    echo "✅ PostgreSQL client found"
fi

echo ""
echo "📋 Setup Instructions:"
echo "1. Ensure PostgreSQL is running with a database 'nutrient_tracker'"
echo "2. Update backend/.env with your database credentials"
echo "3. Run the following commands:"
echo ""
echo "   # Install and start backend:"
echo "   cd backend"
echo "   npm install"
echo "   npm run dev"
echo ""
echo "   # In another terminal, install and start frontend:"
echo "   cd frontend"
echo "   npm install"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:5173 in your browser"
echo "5. Login with: username=admin, password=admin123"
echo ""
echo "📚 For detailed setup instructions, see README.md"
