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

    if (!servicesWrapper || !servicesButton || !servicesDropdown) {
        return false;
    }

    let isOpen = false;
    let closeTimer = null;

    // Position dropdown using fixed positioning
    function positionDropdown() {
        const buttonRect = servicesButton.getBoundingClientRect();
        const dropdownWidth = servicesDropdown.offsetWidth || 360;
        
        // Calculate center position
        const buttonCenter = buttonRect.left + (buttonRect.width / 2);
        
        // Calculate dropdown left position (centered under button)
        let dropdownLeft = buttonCenter - (dropdownWidth / 2);
        
        // Ensure dropdown doesn't go off screen
        const minLeft = 16;
        const maxLeft = window.innerWidth - dropdownWidth - 16;
        dropdownLeft = Math.max(minLeft, Math.min(dropdownLeft, maxLeft));
        
        // Position directly below button
        const dropdownTop = buttonRect.bottom + 8;
        
        // Apply positioning
        servicesDropdown.style.left = `${dropdownLeft}px`;
        servicesDropdown.style.top = `${dropdownTop}px`;
    }

    function openDropdown() {
        clearTimeout(closeTimer);
        positionDropdown();
        
        servicesDropdown.classList.add('show');
        servicesDropdown.style.display = 'block';
        servicesDropdown.offsetHeight; // Force reflow
        servicesDropdown.style.opacity = '1';
        servicesDropdown.style.visibility = 'visible';
        servicesDropdown.style.pointerEvents = 'auto';
        
        isOpen = true;
    }

    function closeDropdown() {
        servicesDropdown.classList.remove('show');
        servicesDropdown.style.opacity = '0';
        servicesDropdown.style.visibility = 'hidden';
        servicesDropdown.style.pointerEvents = 'none';
        
        closeTimer = setTimeout(() => {
            if (!isOpen) {
                servicesDropdown.style.display = 'none';
            }
        }, 300);
        
        isOpen = false;
    }

    // Desktop hover
    servicesWrapper.addEventListener('mouseenter', () => {
        if (window.innerWidth > 1024) {
            openDropdown();
        }
    });

    servicesWrapper.addEventListener('mouseleave', (event) => {
        if (window.innerWidth > 1024) {
            const toElement = event.relatedTarget;
            if (!servicesDropdown.contains(toElement)) {
                closeDropdown();
            }
        }
    });

    servicesDropdown.addEventListener('mouseenter', () => {
        if (window.innerWidth > 1024) {
            clearTimeout(closeTimer);
        }
    });

    servicesDropdown.addEventListener('mouseleave', (event) => {
        if (window.innerWidth > 1024) {
            const toElement = event.relatedTarget;
            if (!servicesWrapper.contains(toElement)) {
                closeDropdown();
            }
        }
    });

    // Mobile/tablet click
    servicesButton.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        if (window.innerWidth <= 1024) {
            if (isOpen) {
                closeDropdown();
            } else {
                openDropdown();
            }
        }
    });

    // Close on outside click
    document.addEventListener('click', (event) => {
        if (!servicesWrapper.contains(event.target) && !servicesDropdown.contains(event.target)) {
            if (isOpen) {
                closeDropdown();
            }
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOpen) {
            closeDropdown();
        }
    });

    // Reposition on scroll/resize
    let repositionTimer;
    function handleRepositioning() {
        if (isOpen) {
            clearTimeout(repositionTimer);
            repositionTimer = setTimeout(positionDropdown, 10);
        }
    }
    
    window.addEventListener('resize', handleRepositioning);
    window.addEventListener('scroll', handleRepositioning, { passive: true });

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
