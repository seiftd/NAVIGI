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

// Go to Payment Page
function goToPayment(tier) {
    const userId = 'USR' + Math.random().toString(36).substr(2, 6).toUpperCase();
    window.location.href = `payment.html?tier=${tier}&userId=${userId}`;
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

// Generate QR Code for TRON address
function generateQRCode() {
    console.log('Generating QR code...');
    const qrContainer = document.getElementById('qrCode');
    const tronAddress = 'TLDsutnxpdLZaRxhGWBJismwsjY3WiTHWX';
    
    if (!qrContainer) {
        console.log('QR container not found');
        return;
    }
    
    console.log('QR container found, checking QRCode library...');
    console.log('QRCode available:', typeof QRCode !== 'undefined');
    
    if (typeof QRCode !== 'undefined') {
        try {
            // Clear existing content
            qrContainer.innerHTML = '';
            
            // Create canvas for QR code
            const canvas = document.createElement('canvas');
            qrContainer.appendChild(canvas);
            
            console.log('Generating QR code for address:', tronAddress);
            
            QRCode.toCanvas(canvas, tronAddress, {
                width: 200,
                height: 200,
                colorDark: '#2C3E50',
                colorLight: '#FFFFFF',
                margin: 2,
                errorCorrectionLevel: 'M'
            }, function(error) {
                if (error) {
                    console.error('QR Code generation error:', error);
                    showFallbackQR(qrContainer);
                } else {
                    console.log('QR code generated successfully');
                    // Add a label below the QR code
                    const label = document.createElement('p');
                    label.textContent = 'Scan with TRON wallet';
                    label.style.cssText = 'text-align: center; margin-top: 10px; font-size: 0.9rem; color: #666; font-weight: 500;';
                    qrContainer.appendChild(label);
                }
            });
        } catch (error) {
            console.error('Error creating QR code:', error);
            showFallbackQR(qrContainer);
        }
    } else {
        console.log('QRCode library not available, showing fallback');
        showFallbackQR(qrContainer);
    }
}

function showFallbackQR(container) {
    container.innerHTML = `
        <div class="qr-placeholder" style="width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; background: #f8f9fa; border: 2px solid #3498DB; margin: 0 auto; border-radius: 8px;">
            <div style="text-align: center;">
                <i class="fas fa-qrcode" style="font-size: 3rem; color: #3498DB; margin-bottom: 10px; display: block;"></i>
                <p style="margin: 0; color: #2C3E50; font-size: 0.9rem; font-weight: bold;">TRON QR Code</p>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 0.8rem;">TLDsutnxpdLZaRxhGWBJismwsjY3WiTHWX</p>
                <p style="margin: 5px 0 0 0; color: #999; font-size: 0.7rem;">Copy address manually</p>
            </div>
        </div>
    `;
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
    // Generate QR code with delay to ensure DOM is ready
    setTimeout(generateQRCode, 500);
    
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
window.goToPayment = goToPayment;
window.copyAddress = copyAddress;
window.generateQRCode = generateQRCode;
window.showFallbackQR = showFallbackQR;
window.showNotification = showNotification;

// QR Code generation - FIXED VERSION
function generateQRCode() {
    console.log('🔄 Generating QR code for main website...');
    
    const qrContainer = document.getElementById('qrCode');
    if (!qrContainer) {
        console.log('⚠️ QR container not found on this page');
        return;
    }
    
    const tronAddress = 'TLDsutnxpdLZaRxhGWBJismwsjY3WiTHWX';
    console.log('📍 TRON address:', tronAddress);
    
    // Clear existing content
    qrContainer.innerHTML = '';
    
    try {
        // Method 1: Try QRCode library if available
        if (typeof QRCode !== 'undefined') {
            console.log('✅ Using QRCode library');
            
            // Create canvas element
            const canvas = document.createElement('canvas');
            canvas.style.cssText = `
                max-width: 100%;
                height: auto;
                border: 2px solid #3498db;
                border-radius: 8px;
                background: white;
                padding: 10px;
            `;
            
            QRCode.toCanvas(canvas, tronAddress, {
                width: 200,
                height: 200,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            }, function (error) {
                if (error) {
                    console.error('❌ QRCode library failed:', error);
                    fallbackQRCode();
                } else {
                    console.log('✅ QR code generated successfully');
                    qrContainer.appendChild(canvas);
                    
                    // Add address below QR code
                    const addressDiv = document.createElement('div');
                    addressDiv.style.cssText = `
                        margin-top: 10px;
                        text-align: center;
                        font-size: 12px;
                        color: #666;
                    `;
                    addressDiv.innerHTML = `
                        <p style="margin: 5px 0;"><strong>TRON TRC20 Address:</strong></p>
                        <code style="background: #f8f9fa; padding: 5px; border-radius: 3px; word-break: break-all;">${tronAddress}</code>
                    `;
                    qrContainer.appendChild(addressDiv);
                }
            });
        } else {
            console.log('⚠️ QRCode library not available, using fallback');
            fallbackQRCode();
        }
    } catch (error) {
        console.error('❌ QR generation error:', error);
        fallbackQRCode();
    }
    
    // Fallback QR code using online service
    function fallbackQRCode() {
        console.log('🔄 Using fallback QR generation');
        
        qrContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; background: white; border-radius: 8px; border: 2px solid #3498db;">
                <h4 style="margin: 0 0 15px 0; color: #2c3e50;">💰 VIP Payment Address</h4>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(tronAddress)}&bgcolor=ffffff&color=000000&margin=0&format=png" 
                     alt="TRON Address QR Code" 
                     style="width: 200px; height: 200px; display: block; margin: 0 auto; border-radius: 5px;"
                     onload="console.log('✅ Fallback QR image loaded')"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <div style="display: none; padding: 20px; text-align: center;">
                    <i class="fas fa-qrcode" style="font-size: 48px; color: #3498db; margin-bottom: 15px;"></i>
                    <p style="color: #666; margin: 10px 0;">QR Code unavailable</p>
                    <p style="color: #666; margin: 10px 0;">Please copy the address manually:</p>
                </div>
                <div style="margin-top: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px;">
                    <p style="margin: 5px 0; font-size: 14px; color: #2c3e50;"><strong>TRON TRC20 Address:</strong></p>
                    <code style="font-size: 12px; color: #e74c3c; word-break: break-all; background: white; padding: 8px; border-radius: 3px; display: block; margin: 5px 0;">${tronAddress}</code>
                    <button onclick="copyTronAddress()" style="background: #3498db; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-top: 10px; font-size: 12px;">
                        📋 Copy Address
                    </button>
                </div>
                <p style="margin: 15px 0 5px 0; font-size: 13px; color: #666;">📱 Scan with your TRON wallet</p>
            </div>
        `;
        
        console.log('✅ Fallback QR container created');
    }
}

// Copy TRON address function
function copyTronAddress() {
    const address = 'TLDsutnxpdLZaRxhGWBJismwsjY3WiTHWX';
    
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(address).then(() => {
            showCopyFeedback('✅ Address copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyAddress(address);
        });
    } else {
        fallbackCopyAddress(address);
    }
}

// Fallback copy method
function fallbackCopyAddress(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyFeedback('✅ Address copied to clipboard!', 'success');
    } catch (err) {
        console.error('Copy failed:', err);
        showCopyFeedback('❌ Copy failed. Please copy manually.', 'error');
    } finally {
        document.body.removeChild(textArea);
    }
}

// Show copy feedback
function showCopyFeedback(message, type) {
    // Remove existing notifications
    document.querySelectorAll('.copy-notification').forEach(el => el.remove());
    
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-size: 14px;
        animation: slideInRight 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for notifications
if (!document.querySelector('#copy-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'copy-notification-styles';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}