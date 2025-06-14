#!/bin/bash

echo "Fixing jvsvault.dev dependencies..."

# Navigate to jvsvault.dev directory
cd ../jvsvault.dev

# Remove node_modules and package-lock.json
echo "Removing node_modules and package-lock.json..."
rm -rf node_modules
rm -f package-lock.json

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Reinstall dependencies
echo "Installing dependencies..."
npm install

# Try to run dev server
echo "Starting dev server..."
npm run dev