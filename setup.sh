#!/bin/bash

echo "🚀 Setting up rollup-plugin-shopify-components..."

# Check if we're in the right directory
if [ ! -f "rollup-plugin-shopify-components.js" ]; then
    echo "❌ Error: rollup-plugin-shopify-components.js not found!"
    echo "Please run this script from the plugin directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Make publish script executable
chmod +x publish.sh

# Setup test project
echo "🧪 Setting up test project..."
cd test-project
npm install

echo "✅ Setup complete!"
echo ""
echo "To test the plugin:"
echo "1. cd test-project"
echo "2. npm run build"
echo "3. npm run dev (for watching)"
echo ""
echo "To publish the plugin:"
echo "1. cd .."
echo "2. ./publish.sh" 