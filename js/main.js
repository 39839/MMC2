// Montgomery Medical Clinic - Main JavaScript

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

    const newWrapper = servicesWrapper.cloneNode(true);
    servicesWrapper.parentNode.replaceChild(newWrapper, servicesWrapper);

    const wrapper = document.querySelector('.services-dropdown-wrapper');
    const button = document.getElementById('services-button');
    const dropdown = document.getElementById('services-dropdown');

    // Align JS-applied baseline with CSS in css/dropdown-fix.css
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-10px);
        width: 380px;
        max-width: 90vw;
        background: linear-gradient(to bottom, #ffffff, #f8fbff);
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(13, 71, 161, 0.1);
        border: 2px solid #0d47a1;
        z-index: 999999;
        margin-top: 0.5rem;
        padding: 0.75rem 0;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        transition: opacity 0.2s ease, transform 0.2s ease, visibility 0s linear 0.2s;
        display: none;
        -webkit-font-smoothing: antialiased;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
    `;

    let isOpen = false;
    let closeTimer = null;

    function computeAndPlace() {
        // Ensure fixed mode to avoid ancestor clipping
        dropdown.classList.add('is-fixed');

        // Temporarily show invisibly to measure
        const prev = {
            display: dropdown.style.display,
            opacity: dropdown.style.opacity,
            visibility: dropdown.style.visibility,
            left: dropdown.style.left,
            top: dropdown.style.top,
        };
        dropdown.style.display = 'block';
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        dropdown.style.left = '50%';

        const btnRect = button.getBoundingClientRect();
        const ddWidth = dropdown.offsetWidth || 380;
        const centerX = btnRect.left + (btnRect.width / 2);
        const pad = 12; // viewport padding
        const minCenter = pad + ddWidth / 2;
        const maxCenter = window.innerWidth - pad - ddWidth / 2;
        const clampedCenter = Math.min(Math.max(centerX, minCenter), maxCenter);

        dropdown.style.left = `${clampedCenter}px`;
        dropdown.style.top = `${Math.round(btnRect.bottom + 8)}px`;

        // Restore visibility; keep display so open anim is smooth
        dropdown.style.display = prev.display || 'block';
        dropdown.style.opacity = prev.opacity || '0';
        dropdown.style.visibility = prev.visibility || 'hidden';
    }

    function openDropdown() {
        clearTimeout(closeTimer);
        computeAndPlace();
        dropdown.style.display = 'block';
        dropdown.offsetHeight; // Force reflow
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        dropdown.style.pointerEvents = 'auto';
        dropdown.style.transform = 'translateX(-50%) translateY(0)';
        isOpen = true;
    }

    function closeDropdown() {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        dropdown.style.pointerEvents = 'none';
        dropdown.style.transform = 'translateX(-50%) translateY(-10px)';
        closeTimer = setTimeout(() => {
            dropdown.style.display = 'none';
        }, 220);
        isOpen = false;
    }

    wrapper.addEventListener('mouseenter', openDropdown);

    wrapper.addEventListener('mouseleave', (event) => {
        const toElement = event.relatedTarget;
        if (!dropdown.contains(toElement)) {
            closeDropdown();
        }
    });

    dropdown.addEventListener('mouseenter', () => {
        clearTimeout(closeTimer);
    });

    dropdown.addEventListener('mouseleave', (event) => {
        const toElement = event.relatedTarget;
        if (!wrapper.contains(toElement)) {
            closeDropdown();
        }
    });

    button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    });

    document.addEventListener('click', (event) => {
        if (!wrapper.contains(event.target) && !dropdown.contains(event.target)) {
            if (isOpen) {
                closeDropdown();
            }
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && isOpen) {
            closeDropdown();
        }
    });

    // Keep position correct across resize/scroll while open
    const reflowPosition = () => {
        if (isOpen) {
            computeAndPlace();
        }
    };
    window.addEventListener('resize', reflowPosition);
    window.addEventListener('scroll', reflowPosition, { passive: true });

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
    document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {
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
