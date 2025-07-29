import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      "home": "Home",
      "features": "Features",
      "howItWorks": "How It Works",
      "about": "About",
      "contact": "Contact",
      
      // Hero Section
      "heroTitle": "Earn Money Watching Ads",
      "heroSubtitle": "Join thousands of users earning money daily by watching ads and inviting friends",
      "downloadApp": "Download App Now",
      "watchDemo": "Watch Demo",
      
      // Features
      "whyChoose": "Why Choose NAVIGI?",
      "earnPoints": "Earn SBARO Points",
      "earnPointsDesc": "Watch ads and earn points that can be converted to real money",
      "referralSystem": "Multi-Level Referral System",
      "referralSystemDesc": "Invite friends and earn 5% commission from their earnings for life",
      "contests": "Daily & Weekly Contests",
      "contestsDesc": "Participate in contests and win big cash prizes",
      "withdrawalMethods": "Multiple Withdrawal Methods",
      "withdrawalMethodsDesc": "Withdraw via Binance Pay, BaridiMob, Google Play or Flexy",
      "security": "Safe & Secure",
      "securityDesc": "Advanced encryption and complete protection for your financial data",
      "arabicSupport": "Arabic Language Support",
      "arabicSupportDesc": "Full Arabic interface with right-to-left text support",
      
      // Stats
      "activeUsers": "Active Users",
      "monthlyPayouts": "Monthly Payouts",
      "securityRate": "Security Rate",
      "support": "Support",
      
      // How It Works
      "howItWorksTitle": "How It Works?",
      "step1": "Download & Register",
      "step1Desc": "Download the app and create a free account easily",
      "step2": "Watch Ads",
      "step2Desc": "Watch short ads and earn SBARO points",
      "step3": "Invite Friends",
      "step3Desc": "Invite friends and earn commission from their earnings",
      "step4": "Withdraw Earnings",
      "step4Desc": "Withdraw your money easily via various payment methods",
      
      // Testimonials
      "testimonials": "What Users Say?",
      "earned": "Earned",
      
      // CTA
      "startEarning": "Start Earning Today!",
      "joinUsers": "Join over 10,000 users earning money daily",
      "downloadFree": "Download Free App"
    }
  },
  ar: {
    translation: {
      // Navigation
      "home": "الرئيسية",
      "features": "المميزات",
      "howItWorks": "كيف يعمل",
      "about": "من نحن",
      "contact": "اتصل بنا",
      
      // Hero Section
      "heroTitle": "اربح المال من مشاهدة الإعلانات",
      "heroSubtitle": "انضم إلى آلاف المستخدمين الذين يربحون المال يومياً من خلال مشاهدة الإعلانات ودعوة الأصدقاء",
      "downloadApp": "حمل التطبيق الآن",
      "watchDemo": "شاهد العرض التوضيحي",
      
      // Features
      "whyChoose": "لماذا تختار نافيجي؟",
      "earnPoints": "اربح نقاط سبارو",
      "earnPointsDesc": "شاهد الإعلانات واكسب نقاط يمكن تحويلها إلى أموال حقيقية",
      "referralSystem": "نظام الإحالة متعدد المستويات",
      "referralSystemDesc": "ادع أصدقاءك واكسب عمولة 5% من أرباحهم مدى الحياة",
      "contests": "مسابقات يومية وأسبوعية",
      "contestsDesc": "شارك في المسابقات واربح جوائز نقدية كبيرة",
      "withdrawalMethods": "طرق سحب متعددة",
      "withdrawalMethodsDesc": "اسحب أرباحك عبر بايننس، باريدي موب، جوجل بلاي أو فليكسي",
      "security": "آمان وموثوقية",
      "securityDesc": "تشفير متقدم وحماية كاملة لبياناتك المالية",
      "arabicSupport": "دعم اللغة العربية",
      "arabicSupportDesc": "واجهة كاملة باللغة العربية مع دعم الكتابة من اليمين لليسار",
      
      // Stats
      "activeUsers": "مستخدم نشط",
      "monthlyPayouts": "مدفوعات شهرية",
      "securityRate": "معدل الأمان",
      "support": "دعم فني",
      
      // How It Works
      "howItWorksTitle": "كيف يعمل التطبيق؟",
      "step1": "حمل التطبيق وسجل",
      "step1Desc": "حمل التطبيق وأنشئ حساباً مجانياً بسهولة",
      "step2": "شاهد الإعلانات",
      "step2Desc": "شاهد إعلانات قصيرة واكسب نقاط سبارو",
      "step3": "ادع الأصدقاء",
      "step3Desc": "ادع أصدقاءك واكسب عمولة من أرباحهم",
      "step4": "اسحب أرباحك",
      "step4Desc": "اسحب أموالك بسهولة عبر طرق الدفع المختلفة",
      
      // Testimonials
      "testimonials": "ماذا يقول المستخدمون؟",
      "earned": "ربح",
      
      // CTA
      "startEarning": "ابدأ الربح اليوم!",
      "joinUsers": "انضم إلى أكثر من 10,000 مستخدم يربحون المال يومياً",
      "downloadFree": "حمل التطبيق مجاناً"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;