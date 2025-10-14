// Montgomery Medical Clinic - Simplified Main JavaScript

let headerEnhancementsInitialized = false;
let dropdownDocumentHandlerAttached = false;

function initHeaderEnhancements() {
    if (headerEnhancementsInitialized) {
        return;
    }

    const servicesButton = document.getElementById('services-button');
    const servicesDropdown = document.getElementById('services-dropdown');
    const mobileMenuButton = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.querySelector('header');

    if (!servicesButton || !servicesDropdown || !mobileMenuButton || !mobileMenu || !header) {
        return;
    }

    headerEnhancementsInitialized = true;

    let isDropdownOpen = false;

    const showDropdown = () => {
        servicesDropdown.style.display = 'block';
        servicesDropdown.offsetHeight; // Force reflow for transition
        servicesDropdown.style.opacity = '1';
        servicesDropdown.style.visibility = 'visible';
        servicesDropdown.style.pointerEvents = 'auto';
        servicesDropdown.style.transform = 'translateX(-50%) translateY(0)';
    };

    const hideDropdown = () => {
        servicesDropdown.style.opacity = '0';
        servicesDropdown.style.visibility = 'hidden';
        servicesDropdown.style.pointerEvents = 'none';
        servicesDropdown.style.transform = 'translateX(-50%) translateY(-10px)';
        setTimeout(() => {
            if (!isDropdownOpen) {
                servicesDropdown.style.display = '';
            }
        }, 300); // Match transition duration
    };

    servicesButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (window.innerWidth <= 1024) {
            isDropdownOpen = !isDropdownOpen;
            if (isDropdownOpen) {
                showDropdown();
            } else {
                hideDropdown();
            }
        }
    });

    if (!dropdownDocumentHandlerAttached) {
        document.addEventListener('click', (event) => {
            if (
                isDropdownOpen &&
                !servicesButton.contains(event.target) &&
                !servicesDropdown.contains(event.target)
            ) {
                isDropdownOpen = false;
                hideDropdown();
            }
        });
        dropdownDocumentHandlerAttached = true;
    }

    const iconPath = mobileMenuButton.querySelector('svg path');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');

        if (iconPath) {
            if (mobileMenu.classList.contains('hidden')) {
                iconPath.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            } else {
                iconPath.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            }
        }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            if (iconPath) {
                iconPath.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            }
        });
    });

    const updateHeaderShadow = () => {
        if (window.pageYOffset > 100) {
            header.classList.add('shadow-lg');
        } else {
            header.classList.remove('shadow-lg');
        }
    };

    window.addEventListener('scroll', updateHeaderShadow);
    updateHeaderShadow();
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('MMC Website Loaded');
    
    if (typeof AOS !== 'undefined') {
        setTimeout(() => {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100,
                easing: 'ease-in-out'
            });
        }, 150);
    }

    document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
        anchor.addEventListener('click', function (event) {
            const href = this.getAttribute('href');
            if (href && href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    event.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    initHeaderEnhancements();

    if (typeof showSlides === 'function') {
        showSlides();
    }
});

document.addEventListener('mmc:header-ready', initHeaderEnhancements);

// Expose test function for debugging
window.testDropdown = function() {
    const dropdown = document.getElementById('services-dropdown');
    if (dropdown) {
        console.log('Testing dropdown visibility...');
        dropdown.style.cssText = `
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
            transform: translateX(-50%) translateY(0) !important;
        `;
        console.log('Dropdown should now be visible');
        
        const links = dropdown.querySelectorAll('.dropdown-link');
        console.log(\`Found \${links.length} dropdown links:\`);
        links.forEach(link => console.log('- ' + link.textContent.trim()));
    } else {
        console.error('Dropdown element not found!');
    }
};
