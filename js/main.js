// Montgomery Medical Clinic - Main JavaScript with Perfect Dropdown

let dropdownInitialized = false;
let headerFeaturesInitialized = false;

function initDropdown() {
    if (dropdownInitialized) {
        return true;
    }

    const servicesWrapper = document.querySelector('.services-dropdown-wrapper');
    const servicesButton = document.getElementById('services-button');
    const servicesDropdown = document.getElementById('services-dropdown');
    const servicesArrow = document.getElementById('services-arrow');

    if (!servicesWrapper || !servicesButton || !servicesDropdown) {
        return false;
    }

    let isOpen = false;
    let hoverTimeout = null;

    // Function to show dropdown
    function showDropdown() {
        clearTimeout(hoverTimeout);
        servicesDropdown.classList.add('active');
        if (servicesArrow) {
            servicesArrow.style.transform = 'rotate(180deg)';
        }
        isOpen = true;
    }

    // Function to hide dropdown
    function hideDropdown() {
        hoverTimeout = setTimeout(() => {
            servicesDropdown.classList.remove('active');
            if (servicesArrow) {
                servicesArrow.style.transform = 'rotate(0deg)';
            }
            isOpen = false;
        }, 150);
    }

    // Desktop hover events
    servicesWrapper.addEventListener('mouseenter', () => {
        if (window.innerWidth > 1024) {
            showDropdown();
        }
    });

    servicesWrapper.addEventListener('mouseleave', () => {
        if (window.innerWidth > 1024) {
            hideDropdown();
        }
    });

    // Keep dropdown open when hovering over it
    servicesDropdown.addEventListener('mouseenter', () => {
        if (window.innerWidth > 1024) {
            clearTimeout(hoverTimeout);
        }
    });

    servicesDropdown.addEventListener('mouseleave', () => {
        if (window.innerWidth > 1024) {
            hideDropdown();
        }
    });

    // Mobile/tablet click events
    servicesButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        if (window.innerWidth <= 1024) {
            if (isOpen) {
                hideDropdown();
            } else {
                showDropdown();
            }
        }
    });

    // Close on outside click
    document.addEventListener('click', (event) => {
        if (!servicesWrapper.contains(event.target) && !servicesDropdown.contains(event.target)) {
            if (isOpen) {
                servicesDropdown.classList.remove('active');
                if (servicesArrow) {
                    servicesArrow.style.transform = 'rotate(0deg)';
                }
                isOpen = false;
            }
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOpen) {
            servicesDropdown.classList.remove('active');
            if (servicesArrow) {
                servicesArrow.style.transform = 'rotate(0deg)';
            }
            isOpen = false;
        }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && isOpen) {
            servicesDropdown.classList.remove('active');
            if (servicesArrow) {
                servicesArrow.style.transform = 'rotate(0deg)';
            }
            isOpen = false;
        }
    });

    dropdownInitialized = true;
    return true;
}

function initHeaderFeatures() {
    const dropdownReady = initDropdown();

    if (headerFeaturesInitialized) {
        return;
    }

    const mobileMenuButton = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const header = document.querySelector('header');

    if (!dropdownReady || !mobileMenuButton || !mobileMenu || !header) {
        return;
    }

    headerFeaturesInitialized = true;

    const icon = mobileMenuButton.querySelector('svg path');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');

        if (icon) {
            if (mobileMenu.classList.contains('hidden')) {
                icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            } else {
                icon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            }
        }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            if (icon) {
                icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
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

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || href.length === 0) {
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        easing: 'ease-in-out'
    });

    setupSmoothScroll();
    initHeaderFeatures();
});

document.addEventListener('mmc:header-ready', initHeaderFeatures);

// Toggle function for expandable sections (Occupational Health page)
function toggleDropdown(sectionId) {
    const content = document.getElementById(`${sectionId}-content`);
    const arrow = document.getElementById(`${sectionId}-arrow`);
    
    if (!content || !arrow) return;
    
    // Toggle the hidden class
    content.classList.toggle('hidden');
    
    // Rotate the arrow
    if (content.classList.contains('hidden')) {
        arrow.style.transform = 'rotate(0deg)';
    } else {
        arrow.style.transform = 'rotate(180deg)';
    }
}
