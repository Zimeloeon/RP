# Mock Data Mode

This backend now supports a mock data mode that allows you to test the frontend without requiring a PostgreSQL database.

## Quick Start with Mock Data

1. **Start the backend with mock data:**
   ```bash
   cd backend
   ./start-mock.sh
   ```

2. **Or manually start with mock data:**
   ```bash
   cd backend
   cp .env.mock .env
   npm install
   npm run dev
   ```

3. **Start the frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Mock Data Features

### Pre-loaded Data
- **Users:** 2 test users (testuser/password123, admin/password123)
- **Ingredients:** 5 common ingredients with full nutritional data
- **Recipes:** 2 sample recipes
- **Supplements:** 3 supplements with fat content data
- **Intake Entries:** Sample daily intake entries

### API Endpoints
All the same API endpoints work with mock data:
- `/api/auth/login` - Login with test credentials
- `/api/auth/register` - Register new users (stored in memory)
- `/api/ingredients` - Browse ingredients with new fat fields
- `/api/recipes` - Browse and manage recipes
- `/api/supplements` - Browse supplements with fat content
- `/api/intake` - Track daily intake

### Test Credentials
- **Username:** testuser, **Password:** password123
- **Username:** admin, **Password:** password123

## New Features Added

### Fat Content Tracking
- **Ingredients:** Added polyunsaturated fat field
- **Supplements:** Added total fat, saturated fat, unsaturated fat, and polyunsaturated fat fields
- **Admin Interface:** Full CRUD operations for all fat fields

### Improved Admin Panel
- Complete ingredient form with all nutritional fields
- Supplement form with fat content tracking
- Recipe management (create, edit, delete)
- Real-time data validation

## Configuration

### Environment Variables
```bash
# Enable/disable mock data mode
USE_MOCK_DATA=true

# When USE_MOCK_DATA=false, these are required:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nutrient_tracker
DB_USER=postgres
DB_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
```

## Development Benefits

1. **No Database Setup:** Test immediately without PostgreSQL
2. **Consistent Data:** Same test data every restart
3. **Fast Development:** Quick iteration cycles
4. **Full Features:** All CRUD operations work
5. **Real API:** Same endpoints as production

## Switching to Real Database

1. Set `USE_MOCK_DATA=false` in `.env`
2. Configure database connection settings
3. Ensure PostgreSQL is running
4. Restart the backend

The backend will automatically detect the mode and use the appropriate data source.
