let contactBarResizeObserver = null;
let resizeListenerAttached = false;
let resizeDebounceTimer = null;

// Load header and footer components
document.addEventListener('DOMContentLoaded', function() {
    // Determine if we're on the home page or a subpage
    const isHomePage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname.endsWith('/') ||
                       window.location.pathname.split('/').pop() === '';
    
    const basePath = isHomePage ? '' : '../';
    
    // Load header
    fetch(basePath + 'includes/header.html')
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.innerHTML = data;
                updateHeaderLinks(basePath, isHomePage);
                initializeMobileMenu();
                initializeServicesDropdown();
                initializeContactModal();
                updateContactBarOffset();
                observeContactBarHeight();

                if (!resizeListenerAttached) {
                    window.addEventListener('resize', handleWindowResize);
                    window.addEventListener('orientationchange', handleWindowResize);
                    window.addEventListener('load', updateContactBarOffset);
                    resizeListenerAttached = true;
                }

                document.dispatchEvent(new CustomEvent('mmc:header-ready', {
                    detail: {
                        basePath,
                        isHomePage
                    }
                }));
            }
        })
        .catch(error => console.error('Error loading header:', error));
    
    // Load footer
    fetch(basePath + 'includes/footer.html')
        .then(response => response.text())
        .then(data => {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.innerHTML = data;
                updateFooterLinks(basePath);
            }
        })
        .catch(error => console.error('Error loading footer:', error));
});

// Update all header links based on current page location
function updateHeaderLinks(basePath, isHomePage) {
    // Update logo
    const logoLink = document.querySelector('.logo-link');
    const logoImg = document.querySelector('.logo-img');
    if (logoLink && logoImg) {
        logoLink.href = basePath + 'index.html';
        logoImg.src = basePath + 'images/Logo.png';
    }
    
    // Define page mappings
    const pages = {
        'nav-home': 'index.html',
        'nav-urgent': 'pages/urgent-primary-care.html',
        'nav-sports': 'pages/sports-medicine.html',
        'nav-derma': 'pages/dermatology.html',
        'nav-wellness': 'pages/nutrition-wellness.html',
        'nav-occupational': 'pages/occupational-health.html',
        'nav-about': 'pages/about.html',
        'nav-insurance': 'pages/insurance.html'
    };
    
    // Update desktop navigation links
    Object.keys(pages).forEach(className => {
        const link = document.querySelector('.' + className);
        if (link) {
            link.href = basePath + pages[className];
        }
    });
    
    // Update mobile navigation links
    Object.keys(pages).forEach(className => {
        const mobileLink = document.querySelector('.mobile-' + className);
        if (mobileLink) {
            mobileLink.href = basePath + pages[className];
        }
    });
    
    // Set active class based on current page
    setActiveNavLink();
}

// Update all footer links
function updateFooterLinks(basePath) {
    // Update footer logo
    const footerLogo = document.querySelector('.footer-logo');
    if (footerLogo) {
        footerLogo.src = basePath + 'images/Logo.png';
    }
    
    // Define page mappings for footer
    const footerPages = {
        'footer-nav-urgent': 'pages/urgent-primary-care.html',
        'footer-nav-sports': 'pages/sports-medicine.html',
        'footer-nav-derma': 'pages/dermatology.html',
        'footer-nav-wellness': 'pages/nutrition-wellness.html',
        'footer-nav-occupational': 'pages/occupational-health.html',
        'footer-nav-careers': 'pages/careers.html'
    };
    
    // Update footer navigation links
    Object.keys(footerPages).forEach(className => {
        const link = document.querySelector('.' + className);
        if (link) {
            link.href = basePath + footerPages[className];
        }
    });
}

// Set active class on current page navigation link
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Remove all active classes first
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Map current page to navigation class
    const pageToNavClass = {
        'index.html': 'nav-home',
        'urgent-primary-care.html': 'nav-urgent',
        'sports-medicine.html': 'nav-sports',
        'dermatology.html': 'nav-derma',
        'nutrition-wellness.html': 'nav-wellness',
        'occupational-health.html': 'nav-occupational',
        'about.html': 'nav-about',
        'insurance.html': 'nav-insurance'
    };
    
    const navClass = pageToNavClass[currentPage];
    if (navClass) {
        const activeLink = document.querySelector('.' + navClass);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Initialize mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Initialize services dropdown functionality
function initializeServicesDropdown() {
    const servicesButton = document.getElementById('services-button');
    const servicesDropdown = document.getElementById('services-dropdown');
    const servicesArrow = document.getElementById('services-arrow');
    const dropdownWrapper = document.querySelector('.services-dropdown-wrapper');
    
    if (servicesButton && servicesDropdown && dropdownWrapper) {
        // Toggle dropdown on button click
        servicesButton.addEventListener('click', function(e) {
            e.stopPropagation();
            servicesDropdown.classList.toggle('active');
            servicesArrow.classList.toggle('rotate-180');
        });
        
        // Show dropdown on hover
        dropdownWrapper.addEventListener('mouseenter', function() {
            servicesDropdown.classList.add('active');
            servicesArrow.classList.add('rotate-180');
        });
        
        // Hide dropdown on mouse leave
        dropdownWrapper.addEventListener('mouseleave', function() {
            servicesDropdown.classList.remove('active');
            servicesArrow.classList.remove('rotate-180');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdownWrapper.contains(e.target)) {
                servicesDropdown.classList.remove('active');
                servicesArrow.classList.remove('rotate-180');
            }
        });
    }
}

function initializeContactModal() {
    const modal = document.getElementById('contact-modal');
    const contactTriggers = document.querySelectorAll('[data-contact-trigger]');

    if (!modal || contactTriggers.length === 0) {
        return;
    }

    if (modal.parentElement !== document.body) {
        document.body.appendChild(modal);
    }

    if (modal.dataset.modalInitialized === 'true') {
        return;
    }

    modal.dataset.modalInitialized = 'true';

    const closeButton = modal.querySelector('[data-contact-close]');
    const contactOptions = modal.querySelectorAll('[data-contact-option]');
    const body = document.body;
    const mobileMenu = document.getElementById('mobile-menu');
    let lastFocusedElement = null;

    function openModal(event) {
        event.preventDefault();
        lastFocusedElement = document.activeElement;
        modal.classList.add('active');
        body.classList.add('modal-open');

        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }

        const focusTarget = closeButton || modal.querySelector('[data-contact-option]');
        if (focusTarget && typeof focusTarget.focus === 'function') {
            focusTarget.focus();
        }
    }

    function closeModal() {
        if (!modal.classList.contains('active')) {
            return;
        }

        modal.classList.remove('active');
        body.classList.remove('modal-open');

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    contactTriggers.forEach(trigger => {
        trigger.addEventListener('click', openModal);
    });

    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    contactOptions.forEach(option => {
        option.addEventListener('click', closeModal);
    });
}

function updateContactBarOffset() {
    const topContactBar = document.querySelector('.top-contact-bar');
    const root = document.documentElement;

    if (topContactBar) {
        const height = topContactBar.offsetHeight;
        root.style.setProperty('--top-contact-bar-height', `${height}px`);
    } else {
        root.style.removeProperty('--top-contact-bar-height');
    }
}

function observeContactBarHeight() {
    if (typeof ResizeObserver === 'undefined') {
        return;
    }

    const topContactBar = document.querySelector('.top-contact-bar');
    if (!topContactBar) {
        return;
    }

    if (contactBarResizeObserver) {
        contactBarResizeObserver.disconnect();
    }

    contactBarResizeObserver = new ResizeObserver(() => {
        updateContactBarOffset();
    });

    contactBarResizeObserver.observe(topContactBar);
}

function handleWindowResize() {
    if (resizeDebounceTimer) {
        clearTimeout(resizeDebounceTimer);
    }

    resizeDebounceTimer = setTimeout(() => {
        updateContactBarOffset();
    }, 150);
}
