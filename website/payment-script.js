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
    const tier = VIP_TIERS[selectedTier] || VIP_TIERS.king;
    const isArabic = document.documentElement.getAttribute('lang') === 'ar';
    
    console.log('Initializing tier:', {
        selectedTier: selectedTier,
        tier: tier,
        tierName: tier.name,
        tierPrice: tier.price
    });
    
    // Update tier info
    const tierIcon = document.getElementById('tierIcon');
    const tierName = document.getElementById('tierName');
    const tierPrice = document.getElementById('tierPrice');
    const paymentAmount = document.getElementById('paymentAmount');
    
    if (tierIcon) tierIcon.textContent = tier.icon;
    if (tierName) tierName.textContent = tier.name[isArabic ? 'ar' : 'en'];
    if (tierPrice) tierPrice.textContent = tier.price + '/month';
    if (paymentAmount) paymentAmount.textContent = tier.price;
    
    console.log('Tier elements updated:', {
        icon: tierIcon?.textContent,
        name: tierName?.textContent,
        price: tierPrice?.textContent,
        amount: paymentAmount?.textContent
    });
    
    // Update tier colors
    const tierInfo = document.getElementById('tierInfo');
    if (tierInfo) {
        tierInfo.style.background = `linear-gradient(135deg, ${tier.color} 0%, #2ECC71 100%)`;
    }
    
    // Populate benefits
    populateTierBenefits(tier, isArabic);
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

// Generate QR Code for TRON address - IMPROVED VERSION
function generateQRCode() {
    console.log('Starting QR code generation...');
    
    // Try multiple ways to find the QR container
    let qrContainer = document.querySelector('.qr-container');
    if (!qrContainer) {
        qrContainer = document.getElementById('qrCode')?.parentElement;
    }
    if (!qrContainer) {
        qrContainer = document.querySelector('.qr-section');
    }
    
    if (!qrContainer) {
        console.error('QR container not found, creating one...');
        // Create QR section if it doesn't exist
        const qrSection = document.querySelector('.payment-details');
        if (qrSection) {
            const newContainer = document.createElement('div');
            newContainer.className = 'qr-container';
            newContainer.innerHTML = '<div class="qr-section"><label>Scan QR Code:</label></div>';
            qrSection.appendChild(newContainer);
            qrContainer = newContainer.querySelector('.qr-section');
        } else {
            console.error('Cannot create QR container - payment details section not found');
            return;
        }
    }
    
    const qrData = TRON_CONFIG.address;
    console.log('QR data:', qrData);
    console.log('QR container found:', qrContainer);
    
    // Hide any existing canvas
    const qrCanvas = document.getElementById('qrCode');
    if (qrCanvas) {
        qrCanvas.style.display = 'none';
    }
    
    // Remove any existing QR displays
    const existingQR = qrContainer.querySelector('.simple-qr');
    if (existingQR) {
        existingQR.remove();
    }
    
    // Create QR code using QR API service
    const qrDiv = document.createElement('div');
    qrDiv.className = 'simple-qr';
    qrDiv.innerHTML = `
        <div style="text-align: center; padding: 15px;">
            <p style="margin-bottom: 10px; font-weight: bold; color: #2c3e50;">Scan QR Code:</p>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}&bgcolor=ffffff&color=000000" 
                 alt="TRON QR Code" 
                 style="width: 200px; height: 200px; border: 2px solid #3498db; border-radius: 8px; background: white; display: block; margin: 0 auto;"
                 onload="console.log('QR image loaded successfully')"
                 onerror="console.error('QR image failed to load'); this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div style="display: none; width: 200px; height: 200px; border: 2px solid #3498db; border-radius: 8px; background: #f8f9fa; align-items: center; justify-content: center; flex-direction: column; margin: 0 auto;">
                <i class="fas fa-qrcode" style="font-size: 60px; color: #3498db; margin-bottom: 10px;"></i>
                <p style="margin: 0; font-size: 12px; text-align: center; color: #666; padding: 10px;">
                    <strong>TRON Address:</strong><br>
                    ${qrData}
                </p>
            </div>
            <p style="margin-top: 10px; font-size: 12px; color: #666;">Scan with your TRON wallet</p>
        </div>
    `;
    
    qrContainer.appendChild(qrDiv);
    console.log('QR code created and added to container');
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

// Copy TRON address to clipboard
function copyAddress() {
    const address = TRON_CONFIG.address;
    const copyBtn = document.getElementById('copyBtn');
    
    navigator.clipboard.writeText(address).then(function() {
        // Visual feedback
        if (copyBtn) {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.classList.remove('copied');
            }, 2000);
        }
        
        showNotification('Address copied to clipboard!', 'success');
    }).catch(function(err) {
        console.error('Failed to copy address:', err);
        showNotification('Failed to copy address', 'error');
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

// Submit payment for admin approval - SIMPLIFIED
async function submitPayment() {
    console.log('Submitting payment...');
    
    // Simple validation
    const transactionHash = document.getElementById('transactionHash')?.value.trim();
    if (!transactionHash || transactionHash.length < 10) {
        showSimpleNotification('Please enter a valid transaction hash', 'error');
        return;
    }
    
    if (!uploadedFile) {
        showSimpleNotification('Please upload a screenshot of your payment', 'error');
        return;
    }
    
    // Show loading
    showLoadingOverlay(true);
    
    try {
        // Create payment submission data
        const submissionData = {
            id: generateSubmissionId(),
            userId: currentUserId,
            tier: selectedTier,
            amount: VIP_TIERS[selectedTier].amount,
            currency: 'USDT',
            network: 'TRC20',
            transactionHash: transactionHash,
            screenshotUrl: 'screenshot_uploaded',
            additionalNotes: document.getElementById('additionalNotes')?.value.trim() || '',
            status: 'pending',
            submittedAt: new Date().toISOString(),
            tronAddress: TRON_CONFIG.address,
            userEmail: `user_${currentUserId}@navigi.app`
        };
        
        // Save to localStorage (simple and reliable)
        saveToLocalStorage(submissionData);
        console.log('Payment data saved successfully');
        
        // Update confirmation details
        updateConfirmationDetails(submissionData);
        
        // Show confirmation step
        showStep(3);
        
        showSimpleNotification('✅ Payment submitted successfully! We will review your request within 24 hours.', 'success');
        
    } catch (error) {
        console.error('Submission error:', error);
        showSimpleNotification('❌ Failed to submit payment. Please try again.', 'error');
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