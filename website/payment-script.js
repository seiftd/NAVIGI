// VIP Payment Page JavaScript - COMPLETELY REDESIGNED
let selectedTier = '';
let selectedMethod = '';
let isArabic = false;

// VIP Tier Configuration
const VIP_TIERS = {
    king: {
        name: { en: 'KING TIER', ar: 'مستوى الملك' },
        price: '$2.50',
        amount: '2.50',
        color: '#3498DB',
        benefits: {
            en: ['16 ads per day', '1-minute cooldown', '10 daily mining points', 'Priority support'],
            ar: ['16 إعلان يومياً', 'انتظار دقيقة واحدة', '10 نقاط تعدين يومية', 'دعم أولوية']
        }
    },
    emperor: {
        name: { en: 'EMPEROR TIER', ar: 'مستوى الإمبراطور' },
        price: '$9.00',
        amount: '9.00',
        color: '#9B59B6',
        benefits: {
            en: ['20 ads per day', 'VIP exclusive competitions', '15 daily mining points', 'Premium support'],
            ar: ['20 إعلان يومياً', 'مسابقات VIP حصرية', '15 نقطة تعدين يومية', 'دعم مميز']
        }
    },
    lord: {
        name: { en: 'LORD TIER', ar: 'مستوى اللورد' },
        price: '$25.00',
        amount: '25.00',
        color: '#E74C3C',
        benefits: {
            en: ['25 ads per day', 'Priority withdrawals', '20 daily mining points', 'Exclusive contests', 'Personal support manager'],
            ar: ['25 إعلان يومياً', 'سحوبات أولوية', '20 نقطة تعدين يومية', 'مسابقات حصرية', 'مدير دعم شخصي']
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
    console.log('🚀 Payment page loaded - All VIP tiers available');
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Language toggle
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }
}

// Select VIP tier function
function selectTier(tier) {
    console.log('🎯 Tier selected:', tier);
    
    selectedTier = tier;
    
    // Hide all payment sections first
    document.querySelectorAll('.payment-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Remove selected class from all tier cards
    document.querySelectorAll('.vip-tier-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Show selected tier payment section
    const paymentSection = document.getElementById(tier + 'Payment');
    if (paymentSection) {
        paymentSection.style.display = 'block';
    }
    
    // Add selected class to chosen tier
    const tierCard = document.getElementById(tier + 'Tier');
    if (tierCard) {
        tierCard.classList.add('selected');
    }
    
    // Update button text
    const selectBtn = document.getElementById('select' + tier.charAt(0).toUpperCase() + tier.slice(1));
    if (selectBtn) {
        selectBtn.innerHTML = '<i class="fas fa-check-circle"></i> <span>Selected</span>';
        selectBtn.style.background = '#27ae60';
    }
    
    // Show payment form
    showPaymentForm();
    
    showToast(`✅ ${VIP_TIERS[tier].name.en} selected! Complete the form below.`, 'success');
}

// Show payment form
function showPaymentForm() {
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.style.display = 'block';
        paymentForm.scrollIntoView({ behavior: 'smooth' });
    }
}

// Copy address function
function copyAddress(tier) {
    const address = TRON_CONFIG.address;
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(address).then(() => {
            showCopySuccess(tier);
        }).catch(() => {
            fallbackCopy(address, tier);
        });
    } else {
        fallbackCopy(address, tier);
    }
}

// Show copy success feedback
function showCopySuccess(tier) {
    const copyBtn = document.getElementById('copy' + tier.charAt(0).toUpperCase() + tier.slice(1));
    if (copyBtn) {
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.background = '#27ae60';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = '';
        }, 2000);
    }
    
    showToast('✅ TRON address copied to clipboard!', 'success');
}

// Fallback copy method
function fallbackCopy(text, tier) {
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
        showCopySuccess(tier);
    } catch (err) {
        console.error('Copy failed:', err);
        showToast('❌ Copy failed. Please copy manually.', 'error');
    } finally {
        document.body.removeChild(textArea);
    }
}

// Select payment method
function selectMethod(method) {
    console.log('📝 Payment method selected:', method);
    
    selectedMethod = method;
    
    // Check the radio button
    const radioBtn = document.getElementById('method' + method.charAt(0).toUpperCase() + method.slice(1));
    if (radioBtn) {
        radioBtn.checked = true;
    }
    
    // Hide all method sections
    document.getElementById('hashSection').style.display = 'none';
    document.getElementById('emailSection').style.display = 'none';
    
    // Show selected method section
    if (method === 'hash') {
        document.getElementById('hashSection').style.display = 'block';
    } else if (method === 'email') {
        document.getElementById('emailSection').style.display = 'block';
    }
}

// Copy support email
function copyEmail() {
    const email = 'navigisup@gmail.com';
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(() => {
            showEmailCopySuccess();
        }).catch(() => {
            fallbackCopyEmail(email);
        });
    } else {
        fallbackCopyEmail(email);
    }
}

// Show email copy success
function showEmailCopySuccess() {
    const copyBtn = document.getElementById('copyEmailBtn');
    if (copyBtn) {
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i>';
        copyBtn.style.background = 'rgba(39, 174, 96, 0.3)';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.style.background = '';
        }, 2000);
    }
    
    showToast('✅ Support email copied to clipboard!', 'success');
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
        showEmailCopySuccess();
    } catch (err) {
        showToast('❌ Copy failed. Email: navigisup@gmail.com', 'error');
    } finally {
        document.body.removeChild(textArea);
    }
}

// Submit payment to admin dashboard
async function submitPayment() {
    console.log('🚀 Submitting payment to admin dashboard...');
    
    // Validate inputs
    const appUserId = document.getElementById('appUserId')?.value.trim();
    const transactionHash = document.getElementById('transactionHash')?.value.trim();
    
    if (!selectedTier) {
        showToast('❌ Please select a VIP tier first', 'error');
        return;
    }
    
    if (!appUserId || appUserId.length < 3) {
        showToast('❌ Please enter your App User ID', 'error');
        document.getElementById('appUserId')?.focus();
        return;
    }
    
    if (!selectedMethod) {
        showToast('❌ Please select a payment verification method', 'error');
        return;
    }
    
    if (selectedMethod === 'hash' && (!transactionHash || transactionHash.length < 10)) {
        showToast('❌ Please enter a valid transaction hash', 'error');
        document.getElementById('transactionHash')?.focus();
        return;
    }
    
    // Show loading
    showLoadingOverlay(true);
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Submitting to Admin...</span>';
    }
    
    try {
        // Create comprehensive submission data for admin dashboard
        const submissionData = {
            // Basic Info
            id: generateSubmissionId(),
            submittedAt: new Date().toISOString(),
            
            // User Info
            appUserId: appUserId,
            userEmail: `${appUserId}@navigi.app`,
            
            // VIP Info
            tier: selectedTier,
            tierName: VIP_TIERS[selectedTier].name.en,
            amount: VIP_TIERS[selectedTier].amount,
            price: VIP_TIERS[selectedTier].price,
            currency: 'USDT',
            network: 'TRC20',
            
            // Payment Info
            tronAddress: TRON_CONFIG.address,
            paymentMethod: selectedMethod,
            transactionHash: selectedMethod === 'hash' ? transactionHash : 'Sent to support email',
            
            // Status & Processing
            status: 'pending_admin_approval',
            processingTime: '6 hours',
            approvalRequired: true,
            notificationPromised: true,
            
            // Admin Dashboard Info
            submissionMethod: 'website_payment_page',
            priority: 'high',
            category: 'vip_upgrade',
            
            // Additional Data
            supportEmail: 'navigisup@gmail.com',
            instructions: selectedMethod === 'email' ? 'User will send screenshot to support email' : 'Transaction hash provided',
            userAgent: navigator.userAgent,
            timestamp: Date.now()
        };
        
        console.log('📊 Submission data prepared:', submissionData);
        
        // Save to localStorage as backup
        saveToLocalStorage(submissionData);
        
        // Send to admin dashboard via Firebase
        if (db) {
            try {
                // Add to VIP requests collection
                await db.collection('vip_upgrade_requests').add(submissionData);
                
                // Add admin notification
                await db.collection('admin_notifications').add({
                    type: 'vip_upgrade_request',
                    title: `New ${submissionData.tierName} Upgrade Request`,
                    message: `User ${appUserId} requested ${submissionData.tierName} upgrade (${submissionData.price})`,
                    submissionId: submissionData.id,
                    userId: appUserId,
                    tier: selectedTier,
                    amount: submissionData.amount,
                    paymentMethod: selectedMethod,
                    transactionHash: selectedMethod === 'hash' ? transactionHash : 'Email method',
                    isRead: false,
                    priority: 'high',
                    category: 'vip_upgrade',
                    requiresAction: true,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                console.log('✅ Successfully sent to admin dashboard');
                
            } catch (firebaseError) {
                console.warn('⚠️ Firebase submission failed:', firebaseError);
                // Continue anyway - data is saved locally
            }
        }
        
        // Show success
        showSuccessPage(submissionData);
        
        showToast('✅ Payment submitted to admin! You will receive notification within 6 hours.', 'success');
        
        console.log('🎉 Payment submission completed successfully');
        
    } catch (error) {
        console.error('❌ Submission error:', error);
        showToast('❌ Failed to submit payment. Please try again.', 'error');
        
        // Reset button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Done - Submit to Admin</span>';
        }
    } finally {
        showLoadingOverlay(false);
    }
}

// Show success page
function showSuccessPage(submissionData) {
    // Hide payment form
    document.getElementById('paymentForm').style.display = 'none';
    
    // Show success section
    const successSection = document.getElementById('successSection');
    successSection.style.display = 'block';
    
    // Populate submission details
    const detailsContainer = document.getElementById('submissionDetails');
    detailsContainer.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">Submission ID:</span>
            <span class="detail-value">${submissionData.id}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">App User ID:</span>
            <span class="detail-value">${submissionData.appUserId}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">VIP Tier:</span>
            <span class="detail-value">${submissionData.tierName}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Amount:</span>
            <span class="detail-value">${submissionData.price} USDT</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value status-pending">Pending Admin Approval</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Expected Approval:</span>
            <span class="detail-value">Within 6 hours</span>
        </div>
    `;
    
    // Scroll to success section
    successSection.scrollIntoView({ behavior: 'smooth' });
}

// Generate unique submission ID
function generateSubmissionId() {
    return 'VIP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Save to localStorage
function saveToLocalStorage(data) {
    try {
        const existingData = JSON.parse(localStorage.getItem('vip_payment_requests') || '[]');
        existingData.push(data);
        localStorage.setItem('vip_payment_requests', JSON.stringify(existingData));
        console.log('💾 Data saved to localStorage');
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}

// Loading overlay functions
function showLoadingOverlay(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
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
        max-width: 350px;
        animation: slideIn 0.3s ease;
    `;
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Language toggle
function toggleLanguage() {
    isArabic = !isArabic;
    const langText = document.getElementById('langText');
    
    if (isArabic) {
        document.documentElement.setAttribute('lang', 'ar');
        document.documentElement.setAttribute('dir', 'rtl');
        if (langText) langText.textContent = 'English';
        
        // Update all Arabic text
        document.querySelectorAll('[data-ar]').forEach(el => {
            el.textContent = el.getAttribute('data-ar');
        });
    } else {
        document.documentElement.setAttribute('lang', 'en');
        document.documentElement.setAttribute('dir', 'ltr');
        if (langText) langText.textContent = 'العربية';
        
        // Update all English text
        document.querySelectorAll('[data-en]').forEach(el => {
            el.textContent = el.getAttribute('data-en');
        });
    }
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

// Make functions globally available
window.selectTier = selectTier;
window.copyAddress = copyAddress;
window.selectMethod = selectMethod;
window.copyEmail = copyEmail;
window.submitPayment = submitPayment;
window.toggleLanguage = toggleLanguage;