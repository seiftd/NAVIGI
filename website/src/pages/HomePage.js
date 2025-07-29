import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton
} from '@mui/material';
import {
  PlayArrow,
  Download,
  Star,
  MonetizationOn,
  Group,
  EmojiEvents,
  Security,
  Language,
  Smartphone,
  TrendingUp
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const features = [
    {
      icon: <MonetizationOn sx={{ fontSize: 40, color: '#3498DB' }} />,
      title: isArabic ? 'اربح نقاط سبارو' : 'Earn SBARO Points',
      description: isArabic 
        ? 'شاهد الإعلانات واكسب نقاط يمكن تحويلها إلى أموال حقيقية'
        : 'Watch ads and earn points that can be converted to real money'
    },
    {
      icon: <Group sx={{ fontSize: 40, color: '#2ECC71' }} />,
      title: isArabic ? 'نظام الإحالة متعدد المستويات' : 'Multi-Level Referral System',
      description: isArabic 
        ? 'ادع أصدقاءك واكسب عمولة 5% من أرباحهم مدى الحياة'
        : 'Invite friends and earn 5% commission from their earnings for life'
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40, color: '#F39C12' }} />,
      title: isArabic ? 'مسابقات يومية وأسبوعية' : 'Daily & Weekly Contests',
      description: isArabic 
        ? 'شارك في المسابقات واربح جوائز نقدية كبيرة'
        : 'Participate in contests and win big cash prizes'
    },
    {
      icon: <Smartphone sx={{ fontSize: 40, color: '#E74C3C' }} />,
      title: isArabic ? 'طرق سحب متعددة' : 'Multiple Withdrawal Methods',
      description: isArabic 
        ? 'اسحب أرباحك عبر بايننس، باريدي موب، جوجل بلاي أو فليكسي'
        : 'Withdraw via Binance Pay, BaridiMob, Google Play or Flexy'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#9B59B6' }} />,
      title: isArabic ? 'آمان وموثوقية' : 'Safe & Secure',
      description: isArabic 
        ? 'تشفير متقدم وحماية كاملة لبياناتك المالية'
        : 'Advanced encryption and complete protection for your financial data'
    },
    {
      icon: <Language sx={{ fontSize: 40, color: '#16A085' }} />,
      title: isArabic ? 'دعم اللغة العربية' : 'Arabic Language Support',
      description: isArabic 
        ? 'واجهة كاملة باللغة العربية مع دعم الكتابة من اليمين لليسار'
        : 'Full Arabic interface with right-to-left text support'
    }
  ];

  const stats = [
    { number: '10K+', label: isArabic ? 'مستخدم نشط' : 'Active Users' },
    { number: '$50K+', label: isArabic ? 'مدفوعات شهرية' : 'Monthly Payouts' },
    { number: '99.9%', label: isArabic ? 'معدل الأمان' : 'Security Rate' },
    { number: '24/7', label: isArabic ? 'دعم فني' : 'Support' }
  ];

  const testimonials = [
    {
      name: isArabic ? 'أحمد محمد' : 'Ahmed Mohamed',
      avatar: '/avatars/user1.jpg',
      text: isArabic 
        ? 'تطبيق رائع! ربحت أكثر من 500 دولار في الشهر الأول فقط من مشاهدة الإعلانات ودعوة الأصدقاء'
        : 'Amazing app! I earned over $500 in the first month just by watching ads and inviting friends',
      earnings: '$500+'
    },
    {
      name: isArabic ? 'فاطمة الزهراء' : 'Fatima Zahra',
      avatar: '/avatars/user2.jpg',
      text: isArabic 
        ? 'طريقة سهلة لكسب المال في وقت الفراغ. نظام الإحالة ممتاز والسحب سريع'
        : 'Easy way to earn money in spare time. Excellent referral system and fast withdrawals',
      earnings: '$350+'
    },
    {
      name: isArabic ? 'محمد الأمين' : 'Mohamed Amine',
      avatar: '/avatars/user3.jpg',
      text: isArabic 
        ? 'أفضل تطبيق ربح جربته. المسابقات ممتعة والجوائز حقيقية. أنصح به بشدة'
        : 'Best earning app I\'ve tried. Fun contests and real prizes. Highly recommend it',
      earnings: '$750+'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #3498DB 0%, #2ECC71 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography 
                  variant="h1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 700,
                    textAlign: isArabic ? 'right' : 'left',
                    direction: isArabic ? 'rtl' : 'ltr'
                  }}
                >
                  {isArabic ? 'اربح المال من مشاهدة الإعلانات' : 'Earn Money Watching Ads'}
                </Typography>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 4, 
                    opacity: 0.9,
                    textAlign: isArabic ? 'right' : 'left',
                    direction: isArabic ? 'rtl' : 'ltr'
                  }}
                >
                  {isArabic 
                    ? 'انضم إلى آلاف المستخدمين الذين يربحون المال يومياً من خلال مشاهدة الإعلانات ودعوة الأصدقاء'
                    : 'Join thousands of users earning money daily by watching ads and inviting friends'
                  }
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Download />}
                    sx={{
                      bgcolor: 'white',
                      color: '#3498DB',
                      '&:hover': { bgcolor: '#f8f9fa' }
                    }}
                  >
                    {isArabic ? 'حمل التطبيق الآن' : 'Download App Now'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                  >
                    {isArabic ? 'شاهد العرض التوضيحي' : 'Watch Demo'}
                  </Button>
                </Box>

                {/* Stats */}
                <Grid container spacing={3} sx={{ mt: 4 }}>
                  {stats.map((stat, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Box textAlign="center">
                        <Typography variant="h4" fontWeight="bold">
                          {stat.number}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  component="img"
                  src="/images/phone-mockup.png"
                  alt="NAVIGI App"
                  sx={{
                    width: '100%',
                    maxWidth: 400,
                    height: 'auto',
                    margin: '0 auto',
                    display: 'block'
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h2" 
            gutterBottom
            sx={{ 
              color: '#2C3E50',
              textAlign: isArabic ? 'right' : 'center',
              direction: isArabic ? 'rtl' : 'ltr'
            }}
          >
            {isArabic ? 'لماذا تختار نافيجي؟' : 'Why Choose NAVIGI?'}
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ 
              textAlign: isArabic ? 'right' : 'center',
              direction: isArabic ? 'rtl' : 'ltr'
            }}
          >
            {isArabic 
              ? 'اكتشف المميزات الرائعة التي تجعل نافيجي الخيار الأفضل لكسب المال'
              : 'Discover amazing features that make NAVIGI the best choice for earning money'
            }
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card 
                  sx={{ 
                    height: '100%', 
                    textAlign: 'center',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box mb={2}>{feature.icon}</Box>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{ 
                        textAlign: isArabic ? 'right' : 'center',
                        direction: isArabic ? 'rtl' : 'ltr'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      color="text.secondary"
                      sx={{ 
                        textAlign: isArabic ? 'right' : 'center',
                        direction: isArabic ? 'rtl' : 'ltr'
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How It Works Section */}
      <Box sx={{ bgcolor: '#F8F9FA', py: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography 
              variant="h2" 
              gutterBottom
              sx={{ 
                color: '#2C3E50',
                textAlign: isArabic ? 'right' : 'center',
                direction: isArabic ? 'rtl' : 'ltr'
              }}
            >
              {isArabic ? 'كيف يعمل التطبيق؟' : 'How It Works?'}
            </Typography>
          </Box>

          <Grid container spacing={4} alignItems="center">
            {[
              {
                step: '1',
                title: isArabic ? 'حمل التطبيق وسجل' : 'Download & Register',
                description: isArabic 
                  ? 'حمل التطبيق وأنشئ حساباً مجانياً بسهولة'
                  : 'Download the app and create a free account easily'
              },
              {
                step: '2',
                title: isArabic ? 'شاهد الإعلانات' : 'Watch Ads',
                description: isArabic 
                  ? 'شاهد إعلانات قصيرة واكسب نقاط سبارو'
                  : 'Watch short ads and earn SBARO points'
              },
              {
                step: '3',
                title: isArabic ? 'ادع الأصدقاء' : 'Invite Friends',
                description: isArabic 
                  ? 'ادع أصدقاءك واكسب عمولة من أرباحهم'
                  : 'Invite friends and earn commission from their earnings'
              },
              {
                step: '4',
                title: isArabic ? 'اسحب أرباحك' : 'Withdraw Earnings',
                description: isArabic 
                  ? 'اسحب أموالك بسهولة عبر طرق الدفع المختلفة'
                  : 'Withdraw your money easily via various payment methods'
              }
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Box textAlign="center">
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: '#3498DB',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        mx: 'auto',
                        mb: 2
                      }}
                    >
                      {item.step}
                    </Avatar>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{ 
                        textAlign: isArabic ? 'right' : 'center',
                        direction: isArabic ? 'rtl' : 'ltr'
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography 
                      color="text.secondary"
                      sx={{ 
                        textAlign: isArabic ? 'right' : 'center',
                        direction: isArabic ? 'rtl' : 'ltr'
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h2" 
            gutterBottom
            sx={{ 
              color: '#2C3E50',
              textAlign: isArabic ? 'right' : 'center',
              direction: isArabic ? 'rtl' : 'ltr'
            }}
          >
            {isArabic ? 'ماذا يقول المستخدمون؟' : 'What Users Say?'}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card sx={{ height: '100%', position: 'relative' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar src={testimonial.avatar} sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="h6">{testimonial.name}</Typography>
                        <Chip
                          label={`${isArabic ? 'ربح' : 'Earned'} ${testimonial.earnings}`}
                          color="primary"
                          size="small"
                        />
                      </Box>
                    </Box>
                    <Typography 
                      variant="body1"
                      sx={{ 
                        textAlign: isArabic ? 'right' : 'left',
                        direction: isArabic ? 'rtl' : 'ltr'
                      }}
                    >
                      "{testimonial.text}"
                    </Typography>
                    <Box display="flex" mt={1}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} sx={{ color: '#F39C12', fontSize: 20 }} />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2ECC71 0%, #3498DB 100%)',
          color: 'white',
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Typography 
              variant="h2" 
              gutterBottom
              sx={{ 
                textAlign: isArabic ? 'right' : 'center',
                direction: isArabic ? 'rtl' : 'ltr'
              }}
            >
              {isArabic ? 'ابدأ الربح اليوم!' : 'Start Earning Today!'}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4,
                textAlign: isArabic ? 'right' : 'center',
                direction: isArabic ? 'rtl' : 'ltr'
              }}
            >
              {isArabic 
                ? 'انضم إلى أكثر من 10,000 مستخدم يربحون المال يومياً'
                : 'Join over 10,000 users earning money daily'
              }
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<Download />}
              sx={{
                bgcolor: 'white',
                color: '#2ECC71',
                px: 4,
                py: 2,
                fontSize: '1.2rem',
                '&:hover': { bgcolor: '#f8f9fa' }
              }}
            >
              {isArabic ? 'حمل التطبيق مجاناً' : 'Download Free App'}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;