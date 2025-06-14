#!/bin/bash

echo "Installing jvsvault.dev with legacy peer deps..."
cd ../jvsvault.dev

# Install with legacy peer deps to bypass Vite version conflict
npm install --legacy-peer-deps

# Run the dev server
npm run dev