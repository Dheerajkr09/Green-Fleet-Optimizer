#!/usr/bin/env bash
# Build script for Render.com deployment
# Installs Node.js dependencies, builds React frontend, then installs Python dependencies

set -o errexit

echo "=== Installing Node.js dependencies ==="
npm install

echo "=== Building React frontend ==="
npm run build

echo "=== Installing Python dependencies ==="
pip install -r requirements.txt

echo "=== Build complete! ==="
