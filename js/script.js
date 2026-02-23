/**
 * Taisiya Dyachkova Portfolio - Scripts
 * Security measures and interactive functionality
 */

// ═══════════════════════════════════
// SECURITY MEASURES
// ═══════════════════════════════════

(function() {
    'use strict';

    // 1. Prevent iframe embedding (clickjacking protection)
    if (window.top !== window.self) {
        window.top.location = window.self.location;
    }

    // 2. Disable right-click context menu (basic content protection)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });

    // 2a. Prevent drag and drop of images and content
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });

    document.addEventListener('drop', function(e) {
        e.preventDefault();
        return false;
    });

    // 2b. Disable text selection via mouse events
    document.addEventListener('selectstart', function(e) {
        if (e.target.tagName === 'IMG' || e.target.classList.contains('no-select')) {
            e.preventDefault();
            return false;
        }
    });

    // 2c. Prevent save as dialogs and downloads
    document.addEventListener('keydown', function(e) {
        // Ctrl+S (Save), Ctrl+P (Print)
        if ((e.ctrlKey || e.metaKey) && (e.keyCode === 83 || e.keyCode === 80)) {
            e.preventDefault();
            alert('Сохранение и печать отключены для защиты контента.');
            return false;
        }
    });

    // 3. Disable common developer tools shortcuts
    document.addEventListener('keydown', function(e) {
        // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (e.keyCode === 123 ||
            (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
            (e.ctrlKey && e.keyCode === 85)) {
            e.preventDefault();
            return false;
        }
    });

    // 4. Detect and warn about console usage
    let devtoolsOpen = false;
    const detectDevTools = () => {
        const threshold = 160;
        if (window.outerWidth - window.innerWidth > threshold ||
            window.outerHeight - window.innerHeight > threshold) {
            if (!devtoolsOpen) {
                devtoolsOpen = true;
                console.clear();
                console.log('%c⚠️ ВНИМАНИЕ!', 'color: red; font-size: 40px; font-weight: bold;');
                console.log('%cЭта функция браузера предназначена для разработчиков.', 'font-size: 16px;');
                console.log('%cНе вставляйте сюда код, который вам дали другие.', 'font-size: 16px;');
                console.log('%cЭто может привести к краже данных.', 'font-size: 16px; color: red;');
            }
        } else {
            devtoolsOpen = false;
        }
    };
    setInterval(detectDevTools, 1000);

    // 5. Prevent text selection and copying (optional - may hurt UX)
    // Uncomment if needed
    // document.addEventListener('selectstart', function(e) {
    //     e.preventDefault();
    //     return false;
    // });

    // 6. Clear console on page load
    console.clear();

    // 7. Detect and prevent automated tools
    Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
    });

    // 8. Honeypot for bots (invisible link)
    const honeypot = document.createElement('a');
    honeypot.href = '/admin';
    honeypot.style.display = 'none';
    honeypot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(honeypot);

    // 9. Monitor for suspicious activity
    let mouseMovements = 0;
    let scrollEvents = 0;
    document.addEventListener('mousemove', () => mouseMovements++);
    document.addEventListener('scroll', () => scrollEvents++);

    setTimeout(() => {
        if (mouseMovements === 0 && scrollEvents === 0) {
            // Possible bot - could log this or take action
            console.log('Suspicious activity detected');
        }
    }, 10000);

    // 10. Sanitize URLs to prevent XSS
    const sanitizeUrl = (url) => {
        const blacklist = ['javascript:', 'data:', 'vbscript:'];
        const lower = url.toLowerCase().trim();
        for (let i = 0; i < blacklist.length; i++) {
            if (lower.startsWith(blacklist[i])) {
                return 'about:blank';
            }
        }
        return url;
    };

    // Apply sanitization to all links on page
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            link.setAttribute('href', sanitizeUrl(href));
        }
    });

    // 11. Prevent image download via various methods
    const protectImages = () => {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Prevent dragging
            img.setAttribute('draggable', 'false');

            // Remove download attribute if present
            img.removeAttribute('download');

            // Prevent context menu on images
            img.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });

            // Prevent long-press on mobile
            let pressTimer;
            img.addEventListener('touchstart', function(e) {
                pressTimer = setTimeout(function() {
                    e.preventDefault();
                }, 500);
            });
            img.addEventListener('touchend', function() {
                clearTimeout(pressTimer);
            });
        });
    };

    // Run on load and watch for new images
    protectImages();
    const imageObserver = new MutationObserver(protectImages);
    imageObserver.observe(document.body, { childList: true, subtree: true });

    // 12. Disable clipboard copy for images and sensitive content
    document.addEventListener('copy', function(e) {
        const selection = window.getSelection().toString();
        // Allow text copy but prevent image copy
        if (selection.length > 0) {
            // Allow text copy
            return true;
        }
        e.preventDefault();
        e.clipboardData.setData('text/plain', '© 2025 Таисья Дьячкова - Контент защищен');
        return false;
    });

    // 13. Prevent screenshots via PrintScreen key (limited effectiveness)
    document.addEventListener('keyup', function(e) {
        if (e.key === 'PrintScreen') {
            navigator.clipboard.writeText('');
            alert('Скриншоты отключены для защиты контента.');
        }
    });

    // 14. Detect screen recording tools (basic detection)
    let lastTime = performance.now();
    let frameDrops = 0;
    const checkFrameRate = () => {
        const currentTime = performance.now();
        const delta = currentTime - lastTime;

        if (delta > 50) { // More than 50ms between frames = possible recording
            frameDrops++;
            if (frameDrops > 10) {
                console.warn('Возможна запись экрана');
                // Could take action here like blurring content
            }
        } else {
            frameDrops = Math.max(0, frameDrops - 1);
        }

        lastTime = currentTime;
        requestAnimationFrame(checkFrameRate);
    };
    requestAnimationFrame(checkFrameRate);

    // 15. Obfuscate image sources to prevent direct download
    const obfuscateImageSources = () => {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            const src = img.getAttribute('src');
            if (src && !img.dataset.protected) {
                // Store original src
                img.dataset.originalSrc = src;
                img.dataset.protected = 'true';

                // Add loading overlay to prevent quick inspection
                img.style.position = 'relative';
            }
        });
    };
    obfuscateImageSources();

    // 16. Prevent browser's "Save Image As" on mobile
    document.addEventListener('touchstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    }, { passive: false });

    // 17. Disable Ctrl+Shift+C (Inspect Element specific)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            return false;
        }
    });
})();

// ═══════════════════════════════════
// INTERACTIVE FEATURES
// ═══════════════════════════════════

// ── Intersection Observer for fade-in animations ──
const fadeEls = document.querySelectorAll('.fade-in');
const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
        }
    });
}, { threshold: 0.08 });
fadeEls.forEach(el => obs.observe(el));

// ── Active sidebar project highlight on scroll ──
const navLinks = document.querySelectorAll('.sidebar-project');
const sectionIds = Array.from(navLinks).map(a => a.getAttribute('href').slice(1));

function updateActiveNav() {
    let current = '';
    const scrolledToBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 50;

    if (scrolledToBottom) {
        current = sectionIds[sectionIds.length - 1];
    } else {
        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (el && el.getBoundingClientRect().top <= 160) {
                current = id;
            }
        });
    }
    navLinks.forEach(a => {
        const href = a.getAttribute('href').slice(1);
        if (href === current) {
            a.style.fontWeight = '600';
            a.style.color = 'var(--text)';
        } else {
            a.style.fontWeight = '';
            a.style.color = '';
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
updateActiveNav();

// ── Smooth scroll ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
