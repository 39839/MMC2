#!/usr/bin/env python3
"""
Script to embed the header and footer directly into all HTML pages.
This ensures the header/footer work when opening files directly (file:// protocol).
"""

import os
import re

def read_file(filepath):
    """Read file content."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(filepath, content):
    """Write content to file."""
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def update_page_with_header_footer(filepath, header_content, footer_content, is_homepage=False):
    """Update a page by embedding the header and footer directly."""
    print(f"Processing: {filepath}")
    
    content = read_file(filepath)
    
    # Determine the base path for links
    if is_homepage:
        # For home page, links are direct
        processed_header = header_content.replace('href="#"', 'href="index.html"', 1)  # Logo
        processed_header = processed_header.replace('src="#"', 'src="images/Logo.png"', 1)  # Logo img
        
        # Update all navigation links for home page
        processed_header = processed_header.replace('class="nav-link nav-home"', 'class="nav-link nav-home active"')
        processed_header = processed_header.replace('href="#" class="nav-link nav-home', 'href="index.html" class="nav-link nav-home')
        processed_header = processed_header.replace('href="#" class="dropdown-link nav-urgent', 'href="pages/urgent-primary-care.html" class="dropdown-link nav-urgent')
        processed_header = processed_header.replace('href="#" class="dropdown-link nav-sports', 'href="pages/sports-medicine.html" class="dropdown-link nav-sports')
        processed_header = processed_header.replace('href="#" class="dropdown-link nav-derma', 'href="pages/dermatology.html" class="dropdown-link nav-derma')
        processed_header = processed_header.replace('href="#" class="dropdown-link nav-wellness', 'href="pages/nutrition-wellness.html" class="dropdown-link nav-wellness')
        processed_header = processed_header.replace('href="#" class="dropdown-link nav-occupational', 'href="pages/occupational-health.html" class="dropdown-link nav-occupational')
        processed_header = processed_header.replace('href="#" class="nav-link nav-about', 'href="pages/about.html" class="nav-link nav-about')
        processed_header = processed_header.replace('href="#" class="nav-link nav-insurance', 'href="pages/insurance.html" class="nav-link nav-insurance')
        
        # Update mobile menu links
        processed_header = processed_header.replace('class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-home', 'href="index.html" class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-home')
        processed_header = processed_header.replace('class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-urgent', 'href="pages/urgent-primary-care.html" class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-urgent')
        processed_header = processed_header.replace('class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-sports', 'href="pages/sports-medicine.html" class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-sports')
        processed_header = processed_header.replace('class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-derma', 'href="pages/dermatology.html" class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-derma')
        processed_header = processed_header.replace('class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-wellness', 'href="pages/nutrition-wellness.html" class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-wellness')
        processed_header = processed_header.replace('class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-occupational', 'href="pages/occupational-health.html" class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-occupational')
        processed_header = processed_header.replace('class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-about', 'href="pages/about.html" class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-about')
        processed_header = processed_header.replace('class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-insurance', 'href="pages/insurance.html" class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-insurance')
        
        # Update footer
        processed_footer = footer_content.replace('src="#"', 'src="images/Logo.png"', 1)
        processed_footer = processed_footer.replace('href="#" class="hover:text-white transition-colors footer-nav-urgent', 'href="pages/urgent-primary-care.html" class="hover:text-white transition-colors footer-nav-urgent')
        processed_footer = processed_footer.replace('href="#" class="hover:text-white transition-colors footer-nav-sports', 'href="pages/sports-medicine.html" class="hover:text-white transition-colors footer-nav-sports')
        processed_footer = processed_footer.replace('href="#" class="hover:text-white transition-colors footer-nav-derma', 'href="pages/dermatology.html" class="hover:text-white transition-colors footer-nav-derma')
        processed_footer = processed_footer.replace('href="#" class="hover:text-white transition-colors footer-nav-wellness', 'href="pages/nutrition-wellness.html" class="hover:text-white transition-colors footer-nav-wellness')
        processed_footer = processed_footer.replace('href="#" class="hover:text-white transition-colors footer-nav-occupational', 'href="pages/occupational-health.html" class="hover:text-white transition-colors footer-nav-occupational')
        processed_footer = processed_footer.replace('href="#" class="text-gray-400 hover:text-brand-orange transition-colors font-semibold footer-nav-careers', 'href="pages/careers.html" class="text-gray-400 hover:text-brand-orange transition-colors font-semibold footer-nav-careers')
    else:
        # For subpages, links need ../
        processed_header = header_content.replace('href="#"', 'href="../index.html"', 1)  # Logo
        processed_header = processed_header.replace('src="#"', 'src="../images/Logo.png"', 1)  # Logo img
        
        # Update navigation links for subpage
        processed_header = processed_header.replace('href="#" class="nav-link nav-home', 'href="../index.html" class="nav-link nav-home')
        processed_header = processed_header.replace('href="#" class="dropdown-link nav-urgent', 'href="urgent-primary-care.html" class="dropdown-link nav-urgent')
        processed_header = processed_header.replace('href="#" class="dropdown-link nav-sports', 'href="sports-medicine.html" class="dropdown-link nav-sports')
        processed_header = processed_header.replace('href="#" class="dropdown-link nav-derma', 'href="dermatology.html" class="dropdown-link nav-derma')
        processed_header = processed_header.replace('href="#" class="dropdown-link nav-wellness', 'href="nutrition-wellness.html" class="dropdown-link nav-wellness')
        processed_header = processed_header.replace('href="#" class="dropdown-link nav-occupational', 'href="occupational-health.html" class="dropdown-link nav-occupational')
        processed_header = processed_header.replace('href="#" class="nav-link nav-about', 'href="about.html" class="nav-link nav-about')
        processed_header = processed_header.replace('href="#" class="nav-link nav-insurance', 'href="insurance.html" class="nav-link nav-insurance')
        
        # Update mobile menu links for subpage
        processed_header = processed_header.replace('class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-home', 'href="../index.html" class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-home')
        processed_header = processed_header.replace('class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-urgent', 'href="urgent-primary-care.html" class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-urgent')
        processed_header = processed_header.replace('class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-sports', 'href="sports-medicine.html" class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-sports')
        processed_header = processed_header.replace('class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-derma', 'href="dermatology.html" class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-derma')
        processed_header = processed_header.replace('class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-wellness', 'href="nutrition-wellness.html" class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-wellness')
        processed_header = processed_header.replace('class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-occupational', 'href="occupational-health.html" class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-occupational')
        processed_header = processed_header.replace('class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-about', 'href="about.html" class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-about')
        processed_header = processed_header.replace('class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-insurance', 'href="insurance.html" class="py-2 px-4 text-dark-gray font-semibold hover:bg-light-gray rounded mobile-nav-insurance')
        
        # Set active class for current page
        filename = os.path.basename(filepath)
        if 'about.html' in filename:
            processed_header = processed_header.replace('href="about.html" class="nav-link nav-about"', 'href="about.html" class="nav-link nav-about active"')
        elif 'urgent-primary-care.html' in filename:
            processed_header = processed_header.replace('href="urgent-primary-care.html" class="dropdown-link nav-urgent"', 'href="urgent-primary-care.html" class="dropdown-link nav-urgent active"')
        elif 'sports-medicine.html' in filename:
            processed_header = processed_header.replace('href="sports-medicine.html" class="dropdown-link nav-sports"', 'href="sports-medicine.html" class="dropdown-link nav-sports active"')
        elif 'dermatology.html' in filename:
            processed_header = processed_header.replace('href="dermatology.html" class="dropdown-link nav-derma"', 'href="dermatology.html" class="dropdown-link nav-derma active"')
        elif 'nutrition-wellness.html' in filename:
            processed_header = processed_header.replace('href="nutrition-wellness.html" class="dropdown-link nav-wellness"', 'href="nutrition-wellness.html" class="dropdown-link nav-wellness active"')
        elif 'occupational-health.html' in filename:
            processed_header = processed_header.replace('href="occupational-health.html" class="dropdown-link nav-occupational"', 'href="occupational-health.html" class="dropdown-link nav-occupational active"')
        elif 'insurance.html' in filename:
            processed_header = processed_header.replace('href="insurance.html" class="nav-link nav-insurance"', 'href="insurance.html" class="nav-link nav-insurance active"')
        elif 'careers.html' in filename:
            # No active state for careers in main nav
            pass
        
        # Update footer for subpage
        processed_footer = footer_content.replace('src="#"', 'src="../images/Logo.png"', 1)
        processed_footer = processed_footer.replace('href="#" class="hover:text-white transition-colors footer-nav-urgent', 'href="urgent-primary-care.html" class="hover:text-white transition-colors footer-nav-urgent')
        processed_footer = processed_footer.replace('href="#" class="hover:text-white transition-colors footer-nav-sports', 'href="sports-medicine.html" class="hover:text-white transition-colors footer-nav-sports')
        processed_footer = processed_footer.replace('href="#" class="hover:text-white transition-colors footer-nav-derma', 'href="dermatology.html" class="hover:text-white transition-colors footer-nav-derma')
        processed_footer = processed_footer.replace('href="#" class="hover:text-white transition-colors footer-nav-wellness', 'href="nutrition-wellness.html" class="hover:text-white transition-colors footer-nav-wellness')
        processed_footer = processed_footer.replace('href="#" class="hover:text-white transition-colors footer-nav-occupational', 'href="occupational-health.html" class="hover:text-white transition-colors footer-nav-occupational')
        processed_footer = processed_footer.replace('href="#" class="text-gray-400 hover:text-brand-orange transition-colors font-semibold footer-nav-careers', 'href="careers.html" class="text-gray-400 hover:text-brand-orange transition-colors font-semibold footer-nav-careers')
    
    # Find and replace header placeholder or existing header
    if '<!-- Header Placeholder -->' in content:
        # Replace placeholder
        header_pattern = r'<!-- Header Placeholder -->.*?<div id="header-placeholder"></div>'
        content = re.sub(header_pattern, processed_header, content, flags=re.DOTALL)
    else:
        # Replace existing header (from body to /header)
        header_pattern = r'(<body[^>]*>).*?(</header>)'
        content = re.sub(header_pattern, r'\1\n\n' + processed_header + r'\n\n', content, flags=re.DOTALL)
    
    # Find and replace footer placeholder or existing footer
    if '<!-- Footer Placeholder -->' in content:
        # Replace placeholder
        footer_pattern = r'<!-- Footer Placeholder -->.*?<div id="footer-placeholder"></div>'
        content = re.sub(footer_pattern, processed_footer, content, flags=re.DOTALL)
    else:
        # Replace existing footer (from footer to end, but before scripts)
        footer_pattern = r'(<footer.*?</footer>)'
        content = re.sub(footer_pattern, processed_footer, content, flags=re.DOTALL)
    
    # Remove the header-footer-loader.js script reference if it exists
    content = content.replace('<script src="js/header-footer-loader.js"></script>', '')
    content = content.replace('<script src="../js/header-footer-loader.js"></script>', '')
    
    write_file(filepath, content)
    print(f"✓ Updated: {filepath}")

def main():
    """Main function."""
    base_dir = '/Users/yairben-dor/XCode/MMC-main'
    
    # Read the master header and footer
    print("Reading master header and footer...")
    header_content = read_file(os.path.join(base_dir, 'includes', 'header.html'))
    footer_content = read_file(os.path.join(base_dir, 'includes', 'footer.html'))
    
    print("=" * 60)
    print("Updating all pages with embedded header and footer...")
    print("=" * 60)
    
    # Update home page
    update_page_with_header_footer(
        os.path.join(base_dir, 'index.html'),
        header_content,
        footer_content,
        is_homepage=True
    )
    
    # Update all subpages
    pages_dir = os.path.join(base_dir, 'pages')
    for filename in os.listdir(pages_dir):
        if filename.endswith('.html'):
            update_page_with_header_footer(
                os.path.join(pages_dir, filename),
                header_content,
                footer_content,
                is_homepage=False
            )
    
    print("=" * 60)
    print("✓ All pages have been updated with embedded header and footer!")
    print("\nThe header and footer are now directly in each file.")
    print("To update all pages in the future, just run this script again.")

if __name__ == '__main__':
    main()
