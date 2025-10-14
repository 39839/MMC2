#!/usr/bin/env python3
"""
Script to update all HTML pages in the pages directory to use the new header and footer includes.
"""

import os
import re

def update_page(filepath):
    """Update a single HTML page to use header and footer includes."""
    print(f"Processing: {filepath}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to match everything from the opening <body> tag through the closing </header> tag
    header_pattern = r'<body[^>]*>.*?</header>'
    
    # Pattern to match everything from <footer to </body>
    footer_pattern = r'<footer.*?</body>'
    
    # Replace header section with placeholder
    header_replacement = '''<body class="bg-light-gray text-dark-gray">

    <!-- Header Placeholder -->
    <div id="header-placeholder"></div>'''
    
    content = re.sub(header_pattern, header_replacement, content, flags=re.DOTALL)
    
    # Replace footer section with placeholder
    footer_replacement = '''    <!-- Footer Placeholder -->
    <div id="footer-placeholder"></div>
    
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script src="../js/header-footer-loader.js"></script>
    <script src="../js/main.js"></script>
    <script>
        AOS.init({
            duration: 800,
            once: true,
        });
    </script>

</body>'''
    
    content = re.sub(footer_pattern, footer_replacement, content, flags=re.DOTALL)
    
    # Write the updated content back to the file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Updated: {filepath}")

def main():
    """Main function to process all HTML files in the pages directory."""
    pages_dir = '/Users/yairben-dor/XCode/MMC-main/pages'
    
    # Get all HTML files in the pages directory
    html_files = [f for f in os.listdir(pages_dir) if f.endswith('.html')]
    
    print(f"Found {len(html_files)} HTML files to process")
    print("=" * 50)
    
    for filename in html_files:
        filepath = os.path.join(pages_dir, filename)
        try:
            update_page(filepath)
        except Exception as e:
            print(f"✗ Error processing {filename}: {str(e)}")
    
    print("=" * 50)
    print("✓ All pages have been updated!")
    print("\nThe header and footer have been extracted to:")
    print("  - /Users/yairben-dor/XCode/MMC-main/includes/header.html")
    print("  - /Users/yairben-dor/XCode/MMC-main/includes/footer.html")
    print("\nAll pages now load the header and footer dynamically using:")
    print("  - /Users/yairben-dor/XCode/MMC-main/js/header-footer-loader.js")

if __name__ == '__main__':
    main()
