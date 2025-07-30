// Simplified i18n implementation
// This replaces the complex i18next dependency with a simple solution

const translations = {
  en: {
    // Navigation
    "home": "Home",
    "features": "Features",
    "about": "About",
    "how_it_works": "How It Works",
    "contact": "Contact",
    "privacy": "Privacy",
    "terms": "Terms",
    "admin_panel": "Admin Panel",
    
    // Common
    "get_started": "Get Started",
    "learn_more": "Learn More",
    "download_app": "Download App",
    "sign_up": "Sign Up",
    "login": "Login",
    "logout": "Logout",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    
    // Hero Section
    "hero_title": "Earn Money Watching Ads",
    "hero_subtitle": "Join NAVIGI and start earning SBARO points by watching advertisements. Refer friends and earn even more!",
    "hero_cta": "Start Earning Now",
    
    // Features
    "features_title": "Why Choose NAVIGI?",
    "feature_ads_title": "Watch & Earn",
    "feature_ads_desc": "Watch ads and earn SBARO points instantly",
    "feature_referral_title": "Referral System",
    "feature_referral_desc": "Multi-level referral program with commissions",
    "feature_contests_title": "Daily Contests",
    "feature_contests_desc": "Participate in contests and win prizes",
    "feature_withdraw_title": "Easy Withdrawals",
    "feature_withdraw_desc": "Multiple withdrawal methods available",
    
    // Stats
    "stats_users": "Active Users",
    "stats_earned": "Total Earned",
    "stats_ads": "Ads Watched",
    "stats_contests": "Contests Held",
    
    // Footer
    "footer_description": "NAVIGI is the leading platform for earning money by watching advertisements with a powerful referral system.",
    "footer_quick_links": "Quick Links",
    "footer_legal": "Legal",
    "footer_contact_info": "Contact Information",
    "footer_email": "Email",
    "footer_phone": "Phone",
    "footer_address": "Address",
    "footer_rights": "All rights reserved."
  },
  
  ar: {
    // Navigation
    "home": "الرئيسية",
    "features": "المميزات",
    "about": "حول",
    "how_it_works": "كيف يعمل",
    "contact": "اتصل بنا",
    "privacy": "الخصوصية",
    "terms": "الشروط",
    "admin_panel": "لوحة الإدارة",
    
    // Common
    "get_started": "ابدأ الآن",
    "learn_more": "اعرف أكثر",
    "download_app": "حمل التطبيق",
    "sign_up": "إنشاء حساب",
    "login": "تسجيل الدخول",
    "logout": "تسجيل الخروج",
    "loading": "جاري التحميل...",
    "error": "خطأ",
    "success": "نجح",
    
    // Hero Section
    "hero_title": "اربح المال من مشاهدة الإعلانات",
    "hero_subtitle": "انضم إلى نافيجي وابدأ في كسب نقاط سبارو من خلال مشاهدة الإعلانات. ادع الأصدقاء واكسب أكثر!",
    "hero_cta": "ابدأ الكسب الآن",
    
    // Features
    "features_title": "لماذا تختار نافيجي؟",
    "feature_ads_title": "شاهد واكسب",
    "feature_ads_desc": "شاهد الإعلانات واكسب نقاط سبارو فوراً",
    "feature_referral_title": "نظام الإحالة",
    "feature_referral_desc": "برنامج إحالة متعدد المستويات مع عمولات",
    "feature_contests_title": "مسابقات يومية",
    "feature_contests_desc": "شارك في المسابقات واربح الجوائز",
    "feature_withdraw_title": "سحب سهل",
    "feature_withdraw_desc": "طرق سحب متعددة متاحة",
    
    // Stats
    "stats_users": "المستخدمون النشطون",
    "stats_earned": "المجموع المكتسب",
    "stats_ads": "الإعلانات المشاهدة",
    "stats_contests": "المسابقات المنعقدة",
    
    // Footer
    "footer_description": "نافيجي هي المنصة الرائدة لكسب المال من خلال مشاهدة الإعلانات مع نظام إحالة قوي.",
    "footer_quick_links": "روابط سريعة",
    "footer_legal": "قانوني",
    "footer_contact_info": "معلومات الاتصال",
    "footer_email": "البريد الإلكتروني",
    "footer_phone": "الهاتف",
    "footer_address": "العنوان",
    "footer_rights": "جميع الحقوق محفوظة."
  }
};

class SimpleI18n {
  constructor() {
    this.language = 'en';
    this.translations = translations;
  }
  
  setLanguage(lang) {
    if (this.translations[lang]) {
      this.language = lang;
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }
  
  t(key, defaultValue = key) {
    const translation = this.translations[this.language]?.[key];
    return translation || defaultValue;
  }
  
  getLanguage() {
    return this.language;
  }
  
  isRTL() {
    return this.language === 'ar';
  }
}

// Create global instance
const i18n = new SimpleI18n();

// React hook for using translations
export const useTranslation = () => {
  return {
    t: (key, defaultValue) => i18n.t(key, defaultValue),
    i18n: {
      language: i18n.getLanguage(),
      changeLanguage: (lang) => i18n.setLanguage(lang),
      dir: i18n.isRTL() ? 'rtl' : 'ltr'
    }
  };
};

export default i18n;