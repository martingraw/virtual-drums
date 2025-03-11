#!/bin/bash

# GitHub Pages cleanup script for Virtual Drums project
# This script fixes header-related issues for GitHub Pages

echo "Fixing header-related issues for GitHub Pages..."

# Remove the _headers file (GitHub Pages might not process it correctly)
if [ -f "_headers" ]; then
    rm -f _headers
    echo "Removed _headers file"
fi

# Create a .nojekyll file to disable Jekyll processing
touch .nojekyll
echo "Created .nojekyll file to disable Jekyll processing"

# Update index.html to include necessary headers directly in the HTML
if [ -f "index.html" ]; then
    # Create a temporary file
    tmp_file=$(mktemp)
    
    # Add the Content-Security-Policy meta tag after the viewport meta tag
    awk '/<meta name="viewport"/{print; print "    <meta http-equiv=\"Content-Security-Policy\" content=\"frame-ancestors *\">\n    <meta http-equiv=\"X-Frame-Options\" content=\"ALLOWALL\">"; next}1' index.html > "$tmp_file"
    
    # Replace the original file
    mv "$tmp_file" index.html
    
    echo "Updated index.html with necessary headers"
fi

# Remove this script after running
echo "Cleanup complete! Your folder is now ready for GitHub Pages."
echo "Changes made:"
echo "1. Removed _headers file"
echo "2. Created .nojekyll file"
echo "3. Added necessary headers directly to index.html"
echo ""
echo "Please re-upload these files to GitHub."

# This script will remove itself after running
rm -f github-cleanup.sh
