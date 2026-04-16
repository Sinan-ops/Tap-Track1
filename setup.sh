#!/bin/bash

# Tap-Track Setup Script

echo "🚀 Setting up Tap-Track..."

# Create .env files
echo "📝 Creating environment files..."

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "✓ Backend .env created"
else
    echo "✓ Backend .env already exists"
fi

if [ ! -f "frontend/.env" ]; then
    cp frontend/.env.example frontend/.env
    echo "✓ Frontend .env created"
else
    echo "✓ Frontend .env already exists"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."

if [ ! -d "backend/node_modules" ]; then
    cd backend
    npm install
    cd ..
    echo "✓ Backend dependencies installed"
else
    echo "✓ Backend dependencies already installed"
fi

if [ ! -d "frontend/node_modules" ]; then
    cd frontend
    npm install
    cd ..
    echo "✓ Frontend dependencies installed"
else
    echo "✓ Frontend dependencies already installed"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start PostgreSQL"
echo "2. Create database: createdb tap_track"
echo "3. Run schema: psql -U postgres -d tap_track -f database/schema.sql"
echo "4. Start backend: npm run dev --workspace=backend"
echo "5. Start frontend: npm run dev --workspace=frontend"
echo ""
echo "Or use Docker Compose: docker-compose up -d"
