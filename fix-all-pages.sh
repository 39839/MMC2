#!/bin/bash

# Script to add dropdown-fix.css to all pages and remove py-2 wrapper

echo "Fixing all HTML pages..."

# List of page files
pages=(
    "about.html"
    "insurance.html"
    "careers.html"
    "dermatology.html"
    "nutrition-wellness.html"
    "occupational-health.html"
    "sports-medicine.html"
    "urgent-primary-care.html"
)

cd "/Users/yairben-dor/XCode/MMC-main/pages"

for page in "${pages[@]}"; do
    if [ -f "$page" ]; then
        echo "Processing $page..."
        
        # Add dropdown-fix.css if not present
        if ! grep -q "dropdown-fix.css" "$page"; then
            sed -i '' 's|<link rel="stylesheet" href="../css/style.css">|<link rel="stylesheet" href="../css/style.css">\n    <link rel="stylesheet" href="../css/dropdown-fix.css">|' "$page"
            echo "  ✓ Added dropdown-fix.css"
        fi
        
        # Remove py-2 wrapper from dropdown
        if grep -q '<div class="py-2">' "$page"; then
            # This is a more complex replacement, handle manually per file
            echo "  ⚠ Manual fix needed for py-2 wrapper"
        fi
        
    else
        echo "  ✗ File not found: $page"
    fi
done

echo "Done!"
