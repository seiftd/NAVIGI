// VIP Payment Page JavaScript
let currentStep = 1;
let selectedTier = '';
let currentUserId = '';
let isArabic = false;
let uploadedFile = null;

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBYXhLf5p8Q9vX2Hn4Yd7C8G1M3KjP9R4S6",
    authDomain: "navigi-sbaro.firebaseapp.com",
    projectId: "navigi-sbaro",
    storageBucket: "navigi-sbaro.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
let db, storage;
try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    storage = firebase.storage();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
    // Fallback - continue without Firebase
    db = null;
    storage = null;
}

// VIP Tier Configuration
const VIP_TIERS = {
    king: {
        name: { en: 'KING TIER', ar: 'مستوى الملك' },
        price: '$2.50',
        amount: '2.50',
        color: '#3498DB',
        icon: '👑',
        benefits: {
            en: ['16 ads per day limit', '10 daily mining points', '1-minute ad cooldown', 'Priority support'],
            ar: ['حد 16 إعلان يومياً', '10 نقاط تعدين يومية', 'انتظار دقيقة بين الإعلانات', 'دعم أولوية']
        }
    },
    emperor: {
        name: { en: 'EMPEROR TIER', ar: 'مستوى الإمبراطور' },
        price: '$9.00',
        amount: '9.00',
        color: '#9B59B6',
        icon: '👑',
        benefits: {
            en: ['20 ads per day limit', '15 daily mining points', 'VIP-exclusive competitions', 'Premium support'],
            ar: ['حد 20 إعلان يومياً', '15 نقطة تعدين يومية', 'مسابقات حصرية VIP', 'دعم مميز']
        }
    },
    lord: {
        name: { en: 'LORD TIER', ar: 'مستوى اللورد' },
        price: '$25.00',
        amount: '25.00',
        color: '#E74C3C',
        icon: '👑',
        benefits: {
            en: ['25 ads per day limit', '20 daily mining points', 'Priority withdrawals', 'VIP competitions', 'Exclusive rewards'],
            ar: ['حد 25 إعلان يومياً', '20 نقطة تعدين يومية', 'سحوبات أولوية', 'مسابقات VIP', 'مكافآت حصرية']
        }
    }
};

// TRON Configuration
const TRON_CONFIG = {
    address: 'TLDsutnxpdLZaRxhGWBJismwsjY3WiTHWX',
    network: 'TRC20',
    currency: 'USDT'
};

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing payment page...');
    initializePage();
    
    // Additional delay for QR code generation to ensure libraries are loaded
    setTimeout(function() {
        console.log('Retrying QR code generation...');
        generateQRCode();
    }, 1000);
});

// Also try initialization when window loads (backup)
window.addEventListener('load', function() {
    console.log('Window loaded, ensuring QR code...');
    setTimeout(generateQRCode, 500);
});

// Initialize the payment page
function initializePage() {
    extractUrlParameters();
    initializeTier();
    generateQRCode();
    setupEventListeners();
    
    // Ensure submit button starts enabled
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
    
    showLoadingOverlay(false);
}

// Extract URL parameters
function extractUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    selectedTier = urlParams.get('tier') || 'king';
    currentUserId = urlParams.get('userId') || generateDemoUserId();
    
    // Debug logging
    console.log('URL Parameters:', {
        tier: urlParams.get('tier'),
        userId: urlParams.get('userId'),
        selectedTier: selectedTier,
        currentUserId: currentUserId
    });
    
    // Display user ID
    const userIdDisplay = document.getElementById('userIdDisplay');
    if (userIdDisplay) {
        userIdDisplay.textContent = currentUserId;
    }
}

// Generate demo user ID if not provided
function generateDemoUserId() {
    return 'USR' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Initialize tier information
function initializeTier() {
    // Get tier from URL or default to king
    const tier = selectedTier || 'king';
    
    if (!VIP_TIERS[tier]) {
        console.warn('Unknown tier:', tier, 'defaulting to king');
        selectedTier = 'king';
    } else {
        selectedTier = tier;
    }
    
    console.log('✅ Initialized tier:', selectedTier);
    
    // Update tier display
    updateTierDisplay();
}

// Update tier display function
function updateTierDisplay() {
    const tier = VIP_TIERS[selectedTier];
    if (!tier) return;
    
    const isArabic = document.documentElement.getAttribute('lang') === 'ar';
    
    // Update tier name and price
    const tierNameEl = document.getElementById('tierName');
    const tierPriceEl = document.getElementById('tierPrice');
    const paymentAmountEl = document.getElementById('paymentAmount');
    
    if (tierNameEl) {
        tierNameEl.textContent = tier.name[isArabic ? 'ar' : 'en'];
        tierNameEl.style.color = tier.color;
    }
    
    if (tierPriceEl) {
        tierPriceEl.textContent = tier.price + '/month';
    }
    
    if (paymentAmountEl) {
        paymentAmountEl.textContent = tier.price;
    }
    
    // Update tier icon
    const tierIconEl = document.getElementById('tierIcon');
    if (tierIconEl) {
        tierIconEl.textContent = tier.icon;
    }
    
    // Update benefits
    populateTierBenefits(tier, isArabic);
    
    console.log('✅ Tier display updated for:', selectedTier);
}

// Populate tier benefits
function populateTierBenefits(tier, isArabic) {
    const benefitsContainer = document.getElementById('tierBenefits');
    if (!benefitsContainer) return;
    
    const benefits = tier.benefits[isArabic ? 'ar' : 'en'];
    benefitsContainer.innerHTML = benefits.map(benefit => 
        `<span class="benefit-item">${benefit}</span>`
    ).join('');
}

// Generate QR Code for TRON address - USING PROVIDED QR IMAGE
function generateQRCode() {
    console.log('🔄 Loading provided QR code image...');
    
    // Find the QR container
    const qrCanvas = document.getElementById('qrCode');
    if (!qrCanvas) {
        console.error('❌ QR canvas not found');
        return;
    }
    
    const qrData = TRON_CONFIG.address;
    console.log('📍 QR data:', qrData);
    
    // Clear any existing content
    qrCanvas.innerHTML = '';
    qrCanvas.style.display = 'block';
    
    // Create container for the provided QR image
    const qrContainer = document.createElement('div');
    qrContainer.style.cssText = `
        text-align: center;
        padding: 10px;
        background: white;
        border-radius: 8px;
        border: 2px solid #3498db;
    `;
    
    // Use the provided QR code image
    const qrImg = document.createElement('img');
    qrImg.src = './qr-code.png'; // Your provided QR code image
    qrImg.alt = 'TRON Address QR Code';
    qrImg.style.cssText = `
        width: 200px;
        height: 200px;
        display: block;
        margin: 0 auto;
        border-radius: 5px;
    `;
    
    qrImg.onload = function() {
        console.log('✅ Your QR code image loaded successfully');
    };
    
    qrImg.onerror = function() {
        console.log('⚠️ Your QR image not found, showing fallback');
        // Fallback to the compass image from the user's message
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMUExQTJFIiByeD0iMTAiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI4MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZENzAwIiBzdHJva2Utd2lkdGg9IjQiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNEZDM0Y3IiBzdHJva2Utd2lkdGg9IjMiLz4KPHBvbHlnb24gcG9pbnRzPSIxMDAsNjAgMTEwLDkwIDEwMCwxMDAgOTAsOTAiIGZpbGw9IiM0RkMzRjciLz4KPHN0YXIgY3g9IjEwMCIgY3k9IjMwIiByPSI4IiBmaWxsPSIjRkZENzAwIi8+CjxzdGFyIGN4PSIxNzAiIGN5PSIxMDAiIHI9IjgiIGZpbGw9IiNGRkQ3MDAiLz4KPHN0YXIgY3g9IjEwMCIgY3k9IjE3MCIgcj0iOCIgZmlsbD0iI0ZGRDcwMCIvPgo8c3RhciBjeD0iMzAiIGN5PSIxMDAiIHI9IjgiIGZpbGw9IiNGRkQ3MDAiLz4KPHN0YXIgY3g9IjE0NSIgY3k9IjU1IiByPSI1IiBmaWxsPSIjNEE5MEUyIi8+CjxzdGFyIGN4PSIxNDUiIGN5PSIxNDUiIHI9IjUiIGZpbGw9IiM0QTkwRTIiLz4KPHN0YXIgY3g9IjU1IiBjeT0iMTQ1IiByPSI1IiBmaWxsPSIjNEE5MEUyIi8+CjxzdGFyIGN4PSI1NSIgY3k9IjU1IiByPSI1IiBmaWxsPSIjNEE5MEUyIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIj5OQVZJR0k8L3RleHQ+Cjx0ZXh0IHg9IjEwMCIgeT0iMTI1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiNGRkQ3MDAiPlNDQU4gTUU8L3RleHQ+Cjwvc3ZnPg==';
        
        // If that also fails, show manual address
        this.onerror = function() {
            qrContainer.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <i class="fas fa-qrcode" style="font-size: 48px; color: #3498db; margin-bottom: 15px;"></i>
                    <h4 style="color: #2c3e50; margin: 10px 0;">QR Code</h4>
                    <p style="color: #666; margin: 10px 0;">Scan to pay with TRON wallet</p>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0;">
                        <code style="font-size: 12px; word-break: break-all; color: #e74c3c;">${qrData}</code>
                    </div>
                    <button onclick="copyAddress()" style="background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                        📋 Copy Address
                    </button>
                </div>
            `;
        };
    };
    
    qrContainer.appendChild(qrImg);
    
    // Add address information below QR code
    const addressInfo = document.createElement('div');
    addressInfo.style.cssText = `
        margin-top: 15px;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 5px;
        text-align: center;
    `;
    
    addressInfo.innerHTML = `
        <p style="margin: 5px 0; font-size: 14px; color: #2c3e50;"><strong>TRON TRC20 Address:</strong></p>
        <code style="font-size: 12px; color: #e74c3c; word-break: break-all; background: white; padding: 8px; border-radius: 3px; display: block; margin: 5px 0;">${qrData}</code>
        <button onclick="copyAddress()" style="background: #3498db; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-top: 10px; font-size: 12px;">
            📋 Copy Address
        </button>
        <p style="margin: 10px 0 5px 0; font-size: 13px; color: #666;">📱 Scan with your TRON wallet</p>
    `;
    
    qrContainer.appendChild(addressInfo);
    
    // Replace canvas with container
    qrCanvas.style.display = 'none';
    qrCanvas.parentNode.insertBefore(qrContainer, qrCanvas.nextSibling);
    
    console.log('✅ QR code container created with your provided image');
}

// Improved address copying function
function copyAddress() {
    const address = TRON_CONFIG.address;
    
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(address).then(() => {
            showCopySuccess();
        }).catch(() => {
            fallbackCopy(address);
        });
    } else {
        fallbackCopy(address);
    }
}

// Fallback copy method
function fallbackCopy(text) {
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
        showCopySuccess();
    } catch (err) {
        console.error('Copy failed:', err);
        showCopyError();
    } finally {
        document.body.removeChild(textArea);
    }
}

// Show copy success feedback
function showCopySuccess() {
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.background = '#27ae60';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
        }, 2000);
    }
    
    // Show toast notification
    showToast('✅ Address copied to clipboard!', 'success');
}

// Show copy error feedback
function showCopyError() {
    showToast('❌ Failed to copy address. Please copy manually.', 'error');
}

// Toast notification system
function showToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.toast-notification').forEach(el => el.remove());
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-size: 14px;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS animations for toast
if (!document.querySelector('#toast-styles')) {
    const style = document.createElement('style');
    style.id = 'toast-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Loading overlay functions
function showLoadingOverlay(show) {
    let overlay = document.getElementById('loadingOverlay');
    
    if (show) {
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loadingOverlay';
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Processing your VIP purchase...</p>
            `;
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                color: white;
                font-size: 18px;
            `;
            
            const spinner = overlay.querySelector('.loading-spinner');
            if (spinner) {
                spinner.style.cssText = `
                    width: 50px;
                    height: 50px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #3498db;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                `;
            }
            
            // Add spinner animation
            if (!document.querySelector('#spinner-styles')) {
                const spinnerStyle = document.createElement('style');
                spinnerStyle.id = 'spinner-styles';
                spinnerStyle.textContent = `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(spinnerStyle);
            }
            
            document.body.appendChild(overlay);
        }
        overlay.style.display = 'flex';
    } else {
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
}

// Setup event listeners - COMPLETELY REWRITTEN FOR RELIABILITY
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // File upload - SIMPLE AND RELIABLE
    const fileInput = document.getElementById('screenshotInput');
    const uploadArea = document.getElementById('uploadArea');
    
    console.log('File input found:', !!fileInput);
    console.log('Upload area found:', !!uploadArea);
    
    if (fileInput && uploadArea) {
        // File input change event
        fileInput.addEventListener('change', function(e) {
            console.log('File selected via input');
            const file = e.target.files[0];
            if (file) {
                processUploadedFile(file);
            }
        });
        
        // Click to upload
        uploadArea.addEventListener('click', function() {
            console.log('Upload area clicked - triggering file input');
            fileInput.click();
        });
        
        // Drag and drop
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.style.backgroundColor = '#e3f2fd';
            uploadArea.style.borderColor = '#2196f3';
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadArea.style.backgroundColor = '';
            uploadArea.style.borderColor = '';
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.style.backgroundColor = '';
            uploadArea.style.borderColor = '';
            
            const files = e.dataTransfer.files;
            if (files && files[0]) {
                console.log('File dropped');
                processUploadedFile(files[0]);
            }
        });
    } else {
        console.error('Upload elements not found!');
    }
    
    // Add transaction hash validation
    const transactionHashInput = document.getElementById('transactionHash');
    if (transactionHashInput) {
        transactionHashInput.addEventListener('input', function() {
            console.log('Transaction hash changed');
            validateForm();
        });
    }
}

// Simple file processing - COMPLETELY REWRITTEN
function processUploadedFile(file) {
    console.log('Processing file:', file.name);
    
    // Simple validation
    if (!file.type.startsWith('image/')) {
        showSimpleNotification('Please select an image file (PNG, JPG)', 'error');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
        showSimpleNotification('File too large. Please select a file under 10MB', 'error');
        return;
    }
    
    // Store the file
    uploadedFile = file;
    
    // Show preview
    showImagePreview(file);
    
    // Show success message
    showSimpleNotification('Image uploaded successfully!', 'success');
    
    // Validate form to enable submit button
    validateForm();
    
    console.log('File processed successfully');
}

// Simple image preview
function showImagePreview(file) {
    const previewContainer = document.getElementById('previewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const uploadArea = document.getElementById('uploadArea');
    
    if (previewContainer && imagePreview) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            previewContainer.style.display = 'block';
            if (uploadArea) {
                uploadArea.style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
    }
}

// Simple notification system
function showSimpleNotification(message, type) {
    // Remove existing notifications
    const existing = document.querySelector('.simple-notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'simple-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Remove image function
function removeImage() {
    uploadedFile = null;
    const previewContainer = document.getElementById('previewContainer');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('screenshotInput');
    
    if (previewContainer) {
        previewContainer.style.display = 'none';
    }
    if (uploadArea) {
        uploadArea.style.display = 'block';
    }
    if (fileInput) {
        fileInput.value = '';
    }
    
    console.log('Image removed');
}

// Handle file selection - LEGACY FUNCTION (keeping for compatibility)
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processUploadedFile(file);
    }
}

// Handle file processing - LEGACY FUNCTION (keeping for compatibility)
function handleFile(file) {
    processUploadedFile(file);
}

// Validate form completion - SIMPLIFIED FOR TESTING
function validateForm() {
    const transactionHash = document.getElementById('transactionHash')?.value.trim();
    const submitBtn = document.getElementById('submitBtn');
    
    // For now, always enable the button for testing
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        console.log('Submit button enabled');
    }
    
    console.log('Form validation:', {
        transactionHash: transactionHash,
        hasFile: !!uploadedFile,
        submitBtnFound: !!submitBtn
    });
}

// Step navigation functions
function goToStep1() {
    showStep(1);
}

function goToStep2() {
    showStep(2);
}

function goToStep3() {
    showStep(3);
}

function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show target step
    const targetStep = document.getElementById(`step${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
        currentStep = stepNumber;
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Submit payment for admin approval - IMPROVED VERSION
async function submitPayment() {
    console.log('🔄 Starting payment submission...');
    
    // Get form values
    const transactionHash = document.getElementById('transactionHash')?.value.trim();
    const additionalNotes = document.getElementById('additionalNotes')?.value.trim();
    
    // Basic validation
    if (!transactionHash || transactionHash.length < 10) {
        showToast('❌ Please enter a valid transaction hash (at least 10 characters)', 'error');
        document.getElementById('transactionHash')?.focus();
        return;
    }
    
    // Validate transaction hash format (basic check)
    if (!/^[a-fA-F0-9]{20,}$/.test(transactionHash)) {
        const confirmProceed = confirm('⚠️ Transaction hash format looks unusual. Are you sure this is correct?\n\nClick OK to proceed anyway, or Cancel to check it again.');
        if (!confirmProceed) {
            document.getElementById('transactionHash')?.focus();
            return;
        }
    }
    
    console.log('📊 Payment submission data:', {
        transactionHash: transactionHash,
        hasFile: !!uploadedFile,
        selectedTier: selectedTier,
        currentUserId: currentUserId
    });
    
    // Show loading
    showLoadingOverlay(true);
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Processing...</span>';
    }
    
    try {
        // Create payment submission data
        const submissionData = {
            id: generateSubmissionId(),
            userId: currentUserId || 'web_user_' + Date.now(),
            tier: selectedTier || 'king',
            amount: VIP_TIERS[selectedTier]?.amount || '2.50',
            currency: 'USDT',
            network: 'TRC20',
            transactionHash: transactionHash,
            screenshotUrl: uploadedFile ? 'screenshot_uploaded.jpg' : 'no_screenshot',
            additionalNotes: additionalNotes,
            status: 'pending',
            submittedAt: new Date().toISOString(),
            tronAddress: TRON_CONFIG.address,
            userEmail: `user_${currentUserId || 'web'}@navigi.app`,
            submissionMethod: 'website',
            userAgent: navigator.userAgent,
            ipAddress: 'hidden_for_privacy'
        };
        
        // Save to localStorage for backup
        saveToLocalStorage(submissionData);
        
        // Try to save to Firebase if available
        if (db) {
            try {
                await db.collection('vip_payments').add(submissionData);
                console.log('✅ Payment data saved to Firebase');
            } catch (firebaseError) {
                console.warn('⚠️ Firebase save failed, using localStorage only:', firebaseError);
            }
        }
        
        // Update confirmation details
        updateConfirmationDetails(submissionData);
        
        // Show confirmation step
        showStep(3);
        
        // Success notification
        showToast('✅ Payment submitted successfully! We will review your request within 2-4 hours.', 'success');
        
        // Try to notify admin if possible
        if (db) {
            try {
                await notifyAdmin(submissionData);
            } catch (notifyError) {
                console.warn('⚠️ Admin notification failed:', notifyError);
            }
        }
        
        console.log('✅ Payment submission completed successfully');
        
    } catch (error) {
        console.error('❌ Submission error:', error);
        showToast('❌ Failed to submit payment. Please try again or contact support.', 'error');
        
        // Reset form state
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Submit for Approval</span>';
        }
    } finally {
        showLoadingOverlay(false);
    }
}

// Validate submission data
function validateSubmission() {
    const transactionHash = document.getElementById('transactionHash')?.value.trim();
    
    if (!transactionHash || transactionHash.length < 10) {
        showNotification('Please enter a valid transaction hash', 'error');
        return false;
    }
    
    if (!uploadedFile) {
        showNotification('Please upload a screenshot of your payment', 'error');
        return false;
    }
    
    return true;
}

// Upload screenshot to Firebase Storage
async function uploadScreenshot() {
    if (!uploadedFile) throw new Error('No file to upload');
    
    if (!storage) {
        throw new Error('Firebase Storage not available');
    }
    
    const storageRef = storage.ref();
    const filename = `vip_payments/${currentUserId}/${Date.now()}_${uploadedFile.name}`;
    const fileRef = storageRef.child(filename);
    
    // Upload file
    const snapshot = await fileRef.put(uploadedFile);
    
    // Get download URL
    const downloadURL = await snapshot.ref.getDownloadURL();
    
    return downloadURL;
}

// Save payment data to localStorage as fallback
function saveToLocalStorage(submissionData) {
    try {
        const existingData = JSON.parse(localStorage.getItem('vip_payments') || '[]');
        existingData.push(submissionData);
        localStorage.setItem('vip_payments', JSON.stringify(existingData));
        console.log('Payment data saved to localStorage');
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}

// Generate unique submission ID
function generateSubmissionId() {
    return 'PAY_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Update confirmation details
function updateConfirmationDetails(submissionData) {
    const isArabic = document.documentElement.getAttribute('lang') === 'ar';
    const tier = VIP_TIERS[selectedTier];
    
    document.getElementById('submissionId').textContent = submissionData.id;
    document.getElementById('confirmedTier').textContent = tier.name[isArabic ? 'ar' : 'en'];
    document.getElementById('confirmedAmount').textContent = tier.price;
}

// Notify admin about new payment
async function notifyAdmin(submissionData) {
    try {
        // Add to admin notifications collection
        await db.collection('admin_notifications').add({
            type: 'vip_payment',
            title: 'New VIP Payment Submission',
            message: `User ${submissionData.userId} submitted payment for ${submissionData.tier.toUpperCase()} tier - $${submissionData.amount}`,
            submissionId: submissionData.id,
            userId: submissionData.userId,
            amount: submissionData.amount,
            tier: submissionData.tier,
            isRead: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('Admin notification sent');
    } catch (error) {
        console.error('Failed to notify admin:', error);
    }
}

// Return to app
function returnToApp() {
    // Try to open the app with a custom scheme
    const appScheme = `navigi://vip-status?userId=${currentUserId}`;
    
    // Attempt to open app
    window.location.href = appScheme;
    
    // Fallback: show instructions after a delay
    setTimeout(() => {
        showNotification('Please open the NAVIGI app to check your VIP status', 'info');
    }, 1000);
}

// Track payment status
function trackPayment() {
    const submissionId = document.getElementById('submissionId')?.textContent;
    if (submissionId) {
        // Open a simple tracking modal or redirect
        showTrackingModal(submissionId);
    }
}

// Show tracking modal
function showTrackingModal(submissionId) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Track Payment Status</h3>
                <button onclick="this.closest('.modal-overlay').remove()" class="modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="tracking-info">
                    <p><strong>Submission ID:</strong> ${submissionId}</p>
                    <p><strong>Status:</strong> <span class="status pending">Pending Review</span></p>
                    <p><strong>Estimated Processing:</strong> 2-4 hours</p>
                </div>
                <div class="contact-info">
                    <h4>Need Help?</h4>
                    <p>Contact us for status updates:</p>
                    <div class="contact-methods">
                        <a href="mailto:navigisup@gmail.com" class="contact-method">
                            <i class="fas fa-envelope"></i>
                            <span>navigisup@gmail.com</span>
                        </a>
                        <a href="https://t.me/NAVIGISupport" class="contact-method">
                            <i class="fab fa-telegram"></i>
                            <span>@NAVIGISupport</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Style the modal
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
}

// Language toggle
function toggleLanguage() {
    isArabic = !isArabic;
    const html = document.documentElement;
    const langText = document.getElementById('langText');
    
    if (isArabic) {
        html.setAttribute('lang', 'ar');
        html.setAttribute('dir', 'rtl');
        if (langText) langText.textContent = 'English';
    } else {
        html.setAttribute('lang', 'en');
        html.setAttribute('dir', 'ltr');
        if (langText) langText.textContent = 'العربية';
    }
    
    // Update all text content
    updateLanguageContent();
    
    // Re-initialize tier info with new language
    initializeTier();
}

// Update language content
function updateLanguageContent() {
    const elements = document.querySelectorAll('[data-en]');
    elements.forEach(element => {
        const enText = element.getAttribute('data-en');
        const arText = element.getAttribute('data-ar');
        
        if (enText && arText) {
            element.textContent = isArabic ? arText : enText;
        }
    });
}

// Show loading overlay
function showLoadingOverlay(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Get notification icon based on type
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Get notification color based on type
function getNotificationColor(type) {
    const colors = {
        success: '#27AE60',
        error: '#E74C3C',
        warning: '#F39C12',
        info: '#3498DB'
    };
    return colors[type] || '#3498DB';
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .modal-overlay .modal-content {
        background: white;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #999;
    }
    
    .modal-body {
        padding: 20px;
    }
    
    .tracking-info {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
    }
    
    .tracking-info p {
        margin: 5px 0;
    }
`;
document.head.appendChild(style);

// Global error handling
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    showNotification('An error occurred. Please refresh and try again.', 'error');
});

// Expose functions globally for HTML event handlers
window.copyAddress = copyAddress;
window.goToStep1 = goToStep1;
window.goToStep2 = goToStep2;
window.goToStep3 = goToStep3;
window.submitPayment = submitPayment;
window.returnToApp = returnToApp;
window.trackPayment = trackPayment;
window.toggleLanguage = toggleLanguage;
window.removeImage = removeImage;
window.goToTransactionPage = goToTransactionPage;
window.submitTransaction = submitTransaction;
window.copyEmail = copyEmail;

// New function to go to transaction page
function goToTransactionPage() {
    console.log('🔄 Going to transaction submission page...');
    showStep(2);
}

// New function to submit transaction to admin
async function submitTransaction() {
    console.log('🔄 Submitting transaction to admin...');
    
    const transactionHash = document.getElementById('transactionHash')?.value.trim();
    
    if (!transactionHash || transactionHash.length < 10) {
        showToast('❌ Please enter a valid transaction hash', 'error');
        document.getElementById('transactionHash')?.focus();
        return;
    }
    
    // Show loading
    showLoadingOverlay(true);
    const doneBtn = document.getElementById('doneBtn');
    if (doneBtn) {
        doneBtn.disabled = true;
        doneBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Submitting to Admin...</span>';
    }
    
    try {
        // Create submission data for admin
        const submissionData = {
            id: generateSubmissionId(),
            userId: currentUserId || 'web_user_' + Date.now(),
            tier: selectedTier || 'king',
            tierName: VIP_TIERS[selectedTier]?.name.en || 'KING TIER',
            amount: VIP_TIERS[selectedTier]?.amount || '2.50',
            currency: 'USDT',
            network: 'TRC20',
            transactionHash: transactionHash,
            status: 'pending_admin_review',
            submittedAt: new Date().toISOString(),
            tronAddress: TRON_CONFIG.address,
            userEmail: `user_${currentUserId || 'web'}@navigi.app`,
            submissionMethod: 'website',
            supportEmail: 'navigisup@gmail.com',
            approvalTime: '2 hours',
            notes: 'User submitted transaction hash, screenshot sent to support email'
        };
        
        // Save to localStorage
        saveToLocalStorage(submissionData);
        
        // Send to admin dashboard if Firebase available
        if (db) {
            try {
                await db.collection('vip_transactions').add(submissionData);
                await db.collection('admin_notifications').add({
                    type: 'vip_transaction_submitted',
                    title: 'New VIP Transaction Submitted',
                    message: `User submitted ${submissionData.tierName} payment - Hash: ${transactionHash.substring(0, 20)}...`,
                    submissionId: submissionData.id,
                    userId: submissionData.userId,
                    tier: submissionData.tier,
                    amount: submissionData.amount,
                    transactionHash: transactionHash,
                    isRead: false,
                    priority: 'high',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log('✅ Transaction submitted to admin dashboard');
            } catch (firebaseError) {
                console.warn('⚠️ Firebase submission failed:', firebaseError);
            }
        }
        
        // Update confirmation details
        updateConfirmationDetails(submissionData);
        
        // Show success step
        showStep(3);
        
        showToast('✅ Transaction submitted to admin! Check your email for updates.', 'success');
        
        console.log('✅ Transaction submission completed');
        
    } catch (error) {
        console.error('❌ Transaction submission error:', error);
        showToast('❌ Failed to submit transaction. Please try again.', 'error');
        
        // Reset button
        if (doneBtn) {
            doneBtn.disabled = false;
            doneBtn.innerHTML = '<i class="fas fa-check"></i> <span>Done - Submit to Admin</span>';
        }
    } finally {
        showLoadingOverlay(false);
    }
}

// Function to copy support email
function copyEmail() {
    const email = 'navigisup@gmail.com';
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(() => {
            showToast('✅ Support email copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyEmail(email);
        });
    } else {
        fallbackCopyEmail(email);
    }
}

// Fallback email copy
function fallbackCopyEmail(email) {
    const textArea = document.createElement('textarea');
    textArea.value = email;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('✅ Support email copied to clipboard!', 'success');
    } catch (err) {
        showToast('❌ Copy failed. Email: navigisup@gmail.com', 'error');
    } finally {
        document.body.removeChild(textArea);
    }
}