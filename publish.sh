#!/bin/bash

# Script to publish rollup-plugin-shopify-components to npm

echo "🚀 Publishing rollup-plugin-shopify-components..."

# Check if we're in the right directory
if [ ! -f "rollup-plugin-shopify-components.js" ]; then
    echo "❌ Error: rollup-plugin-shopify-components.js not found!"
    echo "Please run this script from the plugin directory."
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    exit 1
fi

# Check if README.md exists
if [ ! -f "README.md" ]; then
    echo "❌ Error: README.md not found!"
    exit 1
fi

# Check if user is logged in to npm
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ Error: Not logged in to npm!"
    echo "Please run: npm login"
    exit 1
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📦 Current version: $CURRENT_VERSION"

# Ask for new version
echo "Enter new version (or press Enter to keep current):"
read NEW_VERSION

if [ -z "$NEW_VERSION" ]; then
    NEW_VERSION=$CURRENT_VERSION
fi

# Update version in package.json
npm version $NEW_VERSION --no-git-tag-version

echo "📝 Publishing version $NEW_VERSION..."

# Publish to npm
npm publish

if [ $? -eq 0 ]; then
    echo "✅ Successfully published rollup-plugin-shopify-components@$NEW_VERSION"
    echo "🔗 https://www.npmjs.com/package/rollup-plugin-shopify-components"
else
    echo "❌ Failed to publish package"
    exit 1
fi

echo "🎉 Done!" 