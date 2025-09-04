#!/bin/bash

echo "Starting Email Template Preview System..."
echo "========================================"
echo ""
echo "Installing dependencies..."
npm install

echo ""
echo "Starting preview server..."
echo "Server will be available at: http://localhost:3000"
echo "Preview interface: http://localhost:3000/preview.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
