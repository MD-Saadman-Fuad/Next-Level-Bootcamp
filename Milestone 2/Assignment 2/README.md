# DevPulse

DevPulse is a collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

## Features
- **User Roles & Access Control**: Differentiates between `contributor` and `maintainer` roles.
- **Secure Authentication**: Includes signup and login with hashed passwords (bcrypt) and JWT authentication.
- **Issues Management**: Allows bug reporting and feature requests.
- **No-JOIN Raw SQL Integrity**: Interacts with PostgreSQL using raw SQL queries with direct pool interactions and zero JOIN operations.
- **Conflict Management**: Contributors cannot edit issues once they move away from the `open` status.

## Tech Stack
- **Runtime**: Node.js (LTS)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (native `pg` driver only)
- **Libraries**: `bcrypt`, `jsonwebtoken`, `http-status-codes`, `cors`, `dotenv`
- **Bundler**: `tsup`
- **Development Runner**: `ts-node-dev`

## Database Schema

### `users` Table
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR, NOT NULL)
- `email` (VARCHAR, UNIQUE, NOT NULL)
- `password` (VARCHAR, NOT NULL)
- `role` (VARCHAR, DEFAULT 'contributor')
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

### `issues` Table
- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR(150), NOT NULL)
- `description` (TEXT, NOT NULL)
- `type` (VARCHAR, NOT NULL)
- `status` (VARCHAR, DEFAULT 'open')
- `reporter_id` (INTEGER, NOT NULL)
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate and receive a JWT token

### Issues
- `POST /api/issues` - Create a new issue (bug/feature request)
- `GET /api/issues` - Retrieve all issues with sorting/filtering
- `GET /api/issues/:id` - Retrieve details of a specific issue
- `PATCH /api/issues/:id` - Update issue details (owner contributor or maintainer)
- `DELETE /api/issues/:id` - Delete an issue (maintainer only)

## Setup Steps

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd devpulse
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://username:password@host:port/database_name?sslmode=require
   JWT_SECRET=your_jwt_secret
   BCRYPT_SALT_ROUNDS=10
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Build the Production Dist**:
   ```bash
   npm run build
   ```

6. **Start the Production Build**:
   ```bash
   npm start
   ```


