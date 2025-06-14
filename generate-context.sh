#!/bin/bash

# Generate a comprehensive context file for the jorgevs.com website
# This script creates a file containing the directory structure and key file contents

OUTPUT_FILE="jorgevs-site-context.txt"
SITE_ROOT="/Users/jorgevs/Documents/Dev/web_dev/jorgevs.com"

# Make sure we're in the site root directory
cd "$SITE_ROOT"

echo "Generating comprehensive context file for jorgevs.com website..."
echo "Output will be saved to: $OUTPUT_FILE"

# Start with a clean file
echo "# JORGEVS.COM WEBSITE CONTEXT" > $OUTPUT_FILE
echo "# Generated on $(date)" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Add site structure overview
echo "## SITE STRUCTURE" >> $OUTPUT_FILE
echo "\`\`\`" >> $OUTPUT_FILE
find . -type f -not -path "*/\.*" -not -path "*/node_modules/*" | sort >> $OUTPUT_FILE
echo "\`\`\`" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Add directory tree visualization
echo "## DIRECTORY TREE" >> $OUTPUT_FILE
echo "\`\`\`" >> $OUTPUT_FILE
find . -type d -not -path "*/\.*" -not -path "*/node_modules/*" | sort | awk '{ print length($0) "\t" $0 }' | sort -n | cut -f2- | sed 's/[^\/]*\//|--/g' >> $OUTPUT_FILE
echo "\`\`\`" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

# Function to add a file's content to the output
add_file_content() {
  local file_path=$1
  local relative_path=${file_path#$SITE_ROOT/}
  
  echo "## FILE: $relative_path" >> $OUTPUT_FILE
  echo "\`\`\`" >> $OUTPUT_FILE
  cat "$file_path" >> $OUTPUT_FILE
  echo "\`\`\`" >> $OUTPUT_FILE
  echo "" >> $OUTPUT_FILE
}

# Add key HTML files
echo "## HTML FILES" >> $OUTPUT_FILE
add_file_content "$SITE_ROOT/index.html"
add_file_content "$SITE_ROOT/about/index.html"
add_file_content "$SITE_ROOT/listen/index.html"
add_file_content "$SITE_ROOT/contact/index.html"
add_file_content "$SITE_ROOT/etc/index.html"

# Add key JS files
echo "## JAVASCRIPT FILES" >> $OUTPUT_FILE
add_file_content "$SITE_ROOT/assets/js/main.js"
add_file_content "$SITE_ROOT/assets/js/background.js"
add_file_content "$SITE_ROOT/assets/js/script.js"
add_file_content "$SITE_ROOT/assets/js/navigation.js"
add_file_content "$SITE_ROOT/assets/js/metadata-rotator.js"
add_file_content "$SITE_ROOT/assets/js/config/rotations.js"
add_file_content "$SITE_ROOT/assets/js/components/animations.js"
add_file_content "$SITE_ROOT/assets/js/components/header.js"
add_file_content "$SITE_ROOT/assets/js/components/footer.js"

# Add key CSS files
echo "## CSS FILES" >> $OUTPUT_FILE
add_file_content "$SITE_ROOT/assets/css/style.css"
add_file_content "$SITE_ROOT/assets/css/background-direct.css"

# List images in a structured way (don't include the actual image content)
echo "## IMAGES STRUCTURE" >> $OUTPUT_FILE
echo "### Background Images" >> $OUTPUT_FILE
echo "\`\`\`" >> $OUTPUT_FILE
ls -la "$SITE_ROOT/assets/images/background/" >> $OUTPUT_FILE
echo "\`\`\`" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

echo "### Geometry Images" >> $OUTPUT_FILE
echo "\`\`\`" >> $OUTPUT_FILE
ls -la "$SITE_ROOT/assets/images/geometry/" >> $OUTPUT_FILE
echo "\`\`\`" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

echo "Context generation complete! File saved as: $OUTPUT_FILE"
