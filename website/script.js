// Language switching functionality
let isArabic = false;

function toggleLanguage() {
    isArabic = !isArabic;
    const html = document.documentElement;
    const langToggle = document.getElementById('langText');
    
    if (isArabic) {
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
        langToggle.textContent = 'English';
        updateTexts('ar');
    } else {
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
        langToggle.textContent = 'العربية';
        updateTexts('en');
    }
}

function updateTexts(lang) {
    const elements = document.querySelectorAll('[data-en][data-ar]');
    elements.forEach(element => {
        if (lang === 'ar') {
            element.textContent = element.getAttribute('data-ar');
        } else {
            element.textContent = element.getAttribute('data-en');
        }
    });
}

// VIP Selection Modal
const vipTiers = {
    king: {
        title: 'KING TIER',
        price: '$2.50/month',
        benefits: [
            '16 ads per day (vs 12 free)',
            '1-minute ad cooldown',
            '10 daily mining points',
            'Priority support'
        ]
    },
    emperor: {
        title: 'EMPEROR TIER',
        price: '$9.00/month',
        benefits: [
            '20 ads per day',
            'VIP-exclusive competitions',
            '15 daily mining points',
            'Advanced statistics'
        ]
    },
    lord: {
        title: 'LORD TIER',
        price: '$25.00/month',
        benefits: [
            '25 ads per day',
            'Priority withdrawals',
            '20 daily mining points',
            'Exclusive contests',
            'Personal support manager'
        ]
    }
};

function selectVipTier(tier) {
    const modal = document.getElementById('vipModal');
    const modalTitle = document.getElementById('modalTitle');
    const selectedTier = document.getElementById('selectedTier');
    
    const tierData = vipTiers[tier];
    
    modalTitle.textContent = `${tierData.title} Selected`;
    selectedTier.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h3>👑 ${tierData.title}</h3>
            <p style="font-size: 1.5rem; color: #2ECC71; font-weight: bold;">${tierData.price}</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <h4>Benefits:</h4>
                <ul style="text-align: left; margin: 10px 0;">
                    ${tierData.benefits.map(benefit => `<li>✅ ${benefit}</li>`).join('')}
                </ul>
            </div>
            <p><strong>TRON TRC20 Address:</strong></p>
            <div style="background: #2C3E50; color: white; padding: 15px; border-radius: 8px; font-family: monospace; word-break: break-all; margin: 10px 0;">
                TLDsutnxpdLZaRxhGWBJismwsjY3WiTHWX
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Copy TRON address functionality
function copyAddress() {
    const address = document.getElementById('tronAddress').textContent;
    navigator.clipboard.writeText(address).then(() => {
        // Show success feedback
        const copyBtn = document.querySelector('.copy-btn');
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.background = '#2ECC71';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy address: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = address;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    });
}

// Modal functionality
window.onclick = function(event) {
    const modal = document.getElementById('vipModal');
    const closeBtn = document.querySelector('.close');
    
    if (event.target === modal || event.target === closeBtn) {
        modal.style.display = 'none';
    }
}

// Close modal with escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('vipModal');
        modal.style.display = 'none';
    }
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Generate QR Code placeholder (you can integrate a real QR code library)
    generateQRCode();
    
    // Initialize tooltips and animations
    initializeAnimations();
    
    // Initialize contact form (if exists)
    initializeContactForm();
});

// QR Code generation (placeholder - you can use a library like qrcode.js)
function generateQRCode() {
    const qrContainer = document.getElementById('qrCode');
    if (qrContainer) {
        // This is a placeholder. In production, you'd use a QR code library
        qrContainer.innerHTML = `
            <div style="width: 120px; height: 120px; background: #333; color: white; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; text-align: center; border-radius: 8px;">
                📱<br>QR Code<br>TRON Address
            </div>
        `;
    }
}

// Scroll animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe feature cards and other elements
    const animatedElements = document.querySelectorAll('.feature-card, .vip-tier, .step');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Contact form functionality (placeholder)
function initializeContactForm() {
    const contactForms = document.querySelectorAll('form');
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle form submission
            showNotification('Message sent successfully!', 'success');
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2ECC71' : type === 'error' ? '#E74C3C' : '#3498DB'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// VIP tier data for dynamic content
const vipPricing = {
    king: { usd: 2.50, usdt: 2.50 },
    emperor: { usd: 9.00, usdt: 9.00 },
    lord: { usd: 25.00, usdt: 25.00 }
};

// Update pricing dynamically (if needed)
function updatePricing(tier, newPrice) {
    vipPricing[tier] = newPrice;
    // Update UI elements
    const priceElements = document.querySelectorAll(`[data-tier="${tier}"] .price`);
    priceElements.forEach(el => {
        el.textContent = `$${newPrice.usd}/month`;
    });
}

// Analytics and tracking (placeholder)
function trackEvent(category, action, label) {
    // Google Analytics or other tracking
    console.log(`Track: ${category} - ${action} - ${label}`);
}

// Add tracking to VIP selections
document.addEventListener('click', function(e) {
    if (e.target.matches('[onclick*="selectVipTier"]')) {
        const tier = e.target.getAttribute('onclick').match(/'(\w+)'/)[1];
        trackEvent('VIP', 'tier_selected', tier);
    }
});

// Lazy loading for images (if any)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Theme switching (if needed)
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');
    localStorage.setItem('theme', body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', loadTheme);

// Countdown timer for VIP offers (if needed)
function startCountdown(endDate, elementId) {
    const countdownElement = document.getElementById(elementId);
    if (!countdownElement) return;
    
    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = endDate - now;
        
        if (distance < 0) {
            clearInterval(timer);
            countdownElement.innerHTML = "EXPIRED";
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
}

// Parallax scrolling effect (subtle)
function initializeParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Initialize parallax if elements exist
document.addEventListener('DOMContentLoaded', initializeParallax);

// Export functions for global use
window.toggleLanguage = toggleLanguage;
window.selectVipTier = selectVipTier;
window.copyAddress = copyAddress;
window.showNotification = showNotification;