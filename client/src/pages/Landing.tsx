import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, ArrowRight, Star, Zap, Heart, Shield, 
  TrendingUp, Gift, Lock, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/i18n';

export default function Landing() {
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'enterprise' | null>(null);

  const plans = [
    {
      id: 'basic',
      name: t('landing.pricing.basic.name'),
      price: '$9.99',
      period: '/month',
      description: t('landing.pricing.basic.description'),
      features: [
        'Single bioprofile',
        '3 health modules',
        'Basic AI recommendations',
        'Integration with 2 devices',
        '24/7 support',
      ],
      popular: false,
    },
    {
      id: 'premium',
      name: t('landing.pricing.premium.name'),
      price: '$29.99',
      period: '/month',
      description: t('landing.pricing.premium.description'),
      features: [
        'All 7 health modules',
        'AI diagnostics 2000+ indicators',
        'Personal AI assistant',
        'Unlimited integrations',
        'Priority support',
        'Exclusive consultations',
        'Early access to new features',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: t('landing.pricing.enterprise.name'),
      price: '$99',
      period: '/month',
      description: t('landing.pricing.enterprise.description'),
      features: [
        'All Premium features',
        'Corporate dashboard',
        'Team management',
        'Custom integrations',
        'Dedicated manager',
        'API access',
        'White label',
      ],
      popular: false,
    },
  ];

  const testimonials = [
    {
      name: 'Anna Petrova',
      role: 'Therapist',
      text: 'EthosLife has changed my approach to prevention. Now I have a complete picture of my patients health.',
      rating: 5,
    },
    {
      name: 'Michael Sokolov',
      role: 'Fitness Trainer',
      text: 'My clients have become more motivated thanks to progress tracking in EthosLife.',
      rating: 5,
    },
    {
      name: 'Elena Ivanova',
      role: 'User',
      text: 'In 3 months of use, I lost 8 kg and normalized my blood pressure. The platform works!',
      rating: 5,
    },
  ];

  const stats = [
    { value: '2000+', label: 'Health Indicators', icon: Zap },
    { value: '95%', label: 'AI Diagnostic Accuracy', icon: Sparkles },
    { value: '500K+', label: 'Users', icon: Heart },
    { value: '7', label: 'Health Modules', icon: Shield },
  ];

  const benefits = [
    {
      icon: Zap,
      title: t('landing.benefits.instant'),
      description: t('landing.benefits.instantDesc'),
    },
    {
      icon: Shield,
      title: t('landing.benefits.security'),
      description: t('landing.benefits.securityDesc'),
    },
    {
      icon: TrendingUp,
      title: t('landing.benefits.effective'),
      description: t('landing.benefits.effectiveDesc'),
    },
    {
      icon: Gift,
      title: t('landing.benefits.trial'),
      description: t('landing.benefits.trialDesc'),
    },
  ];

  const handleGetStarted = () => {
    if (selectedPlan) {
      document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRegister = () => {
    console.log('Registering:', { name, email, plan: selectedPlan });
    alert(t('auth.registrationSuccess'));
  };

  return (
    <div className="min-h-screen bg-background landing-page">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 glass-bubbles"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="engraved-card mb-8 p-8"
            >
              <Badge className="mb-4 engraved-badge">{t('landing.hero.badge')}</Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 engraved-text">
                {t('app.name')}
              </h1>
              <p className="text-2xl md:text-3xl text-foreground/80 mb-4 engraved-text">
                {t('landing.hero.tagline')}
              </p>
              <p className="text-lg md:text-xl text-foreground/70 mb-8 leading-relaxed">
                {t('app.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="engraved-button text-lg px-8 py-6"
                  onClick={handleGetStarted}
                >
                  {t('landing.hero.ctaPrimary')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="engraved-button-outline text-lg px-8 py-6"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t('landing.hero.ctaSecondary')}
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
            >
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="engraved-card p-4"
                >
                  <stat.icon className="w-8 h-8 text-primary mb-2 mx-auto" />
                  <div className="text-3xl font-bold engraved-text mb-1">{stat.value}</div>
                  <div className="text-sm text-foreground/70">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 engraved-text">
              {t('landing.problem.title')}
            </h2>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              {t('landing.problem.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="engraved-card p-8"
            >
              <h3 className="text-2xl font-bold mb-4 engraved-text">{t('landing.problem.problemTitle')}</h3>
              <ul className="space-y-3 text-foreground/80">
                {t('landing.problem.problemList').map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="engraved-card p-8"
            >
              <h3 className="text-2xl font-bold mb-4 engraved-text">{t('landing.problem.solutionTitle')}</h3>
              <ul className="space-y-3 text-foreground/80">
                {t('landing.problem.solutionList').map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="text-green-500 mt-1 w-5 h-5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 engraved-text">
              {t('landing.benefits.title')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="engraved-card p-6 text-center"
              >
                <benefit.icon className="w-12 h-12 text-primary mb-4 mx-auto" />
                <h3 className="text-xl font-bold mb-2 engraved-text">{benefit.title}</h3>
                <p className="text-foreground/70 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 engraved-text">
              {t('landing.testimonials.title')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="engraved-card p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold engraved-text">{testimonial.name}</div>
                  <div className="text-sm text-foreground/60">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-muted/30 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 engraved-text">
              {t('landing.pricing.title')}
            </h2>
            <p className="text-xl text-foreground/70">
              {t('landing.pricing.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`engraved-card p-8 relative ${plan.popular ? 'ring-2 ring-primary scale-105' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 engraved-badge">
                    {t('landing.pricing.popular')}
                  </Badge>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 engraved-text">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold engraved-text">{plan.price}</span>
                    <span className="text-foreground/60">{plan.period}</span>
                  </div>
                  <p className="text-sm text-foreground/70">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full engraved-button ${plan.popular ? 'btn-premium' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedPlan(plan.id as any);
                    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {t('landing.pricing.selectPlan')}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration */}
      <section id="registration" className="py-20 relative">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="engraved-card p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4 engraved-text">
                {t('landing.registration.title')}
              </h2>
              <p className="text-lg text-foreground/70">
                {t('landing.registration.subtitle')}
              </p>
            </div>

            {selectedPlan && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold engraved-text">
                      {t('landing.registration.selectedPlan')}: {plans.find(p => p.id === selectedPlan)?.name}
                    </div>
                    <div className="text-sm text-foreground/70">
                      {plans.find(p => p.id === selectedPlan)?.price}
                      {plans.find(p => p.id === selectedPlan)?.period}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPlan(null)}
                  >
                    {t('landing.registration.change')}
                  </Button>
                </div>
              </motion.div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 engraved-text">
                  {t('landing.registration.nameLabel')}
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('landing.registration.namePlaceholder')}
                  required
                  className="engraved-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 engraved-text">
                  {t('landing.registration.emailLabel')}
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('landing.registration.emailPlaceholder')}
                  required
                  className="engraved-input"
                />
              </div>

              {!selectedPlan && (
                <div>
                  <label className="block text-sm font-medium mb-2 engraved-text">
                    {t('landing.registration.planLabel')}
                  </label>
                  <div className="grid gap-3">
                    {plans.map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlan(plan.id as any)}
                        className={`engraved-card p-4 text-left hover:ring-2 hover:ring-primary transition-all ${
                          selectedPlan === plan.id ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold engraved-text">{plan.name}</div>
                            <div className="text-sm text-foreground/70">
                              {plan.price}{plan.period}
                            </div>
                          </div>
                          {plan.popular && (
                            <Badge className="engraved-badge">{t('landing.pricing.popular')}</Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-5 h-5"
                />
                <label htmlFor="terms" className="text-sm text-foreground/70">
                  {t('landing.registration.agreeTerms')}{' '}
                  <a href="#" className="text-primary hover:underline">{t('landing.registration.termsLink')}</a>{' '}
                  {t('landing.registration.and')}{' '}
                  <a href="#" className="text-primary hover:underline">{t('landing.registration.privacyLink')}</a>
                </label>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full engraved-button text-lg py-6"
                disabled={!name || !email || !selectedPlan}
              >
                <Lock className="mr-2 w-5 h-5" />
                {t('landing.registration.submitButton')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <p className="text-center text-sm text-foreground/60">
                <Gift className="inline w-4 h-4 mr-1" />
                {t('landing.registration.trialNote')}
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary/5 relative">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="engraved-card p-12 max-w-3xl mx-auto"
          >
            <Sparkles className="w-16 h-16 text-primary mb-6 mx-auto" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6 engraved-text">
              {t('landing.cta.title')}
            </h2>
            <p className="text-xl text-foreground/70 mb-8">
              {t('landing.cta.subtitle')}
            </p>
            <Button
              size="lg"
              className="engraved-button text-lg px-8 py-6"
              onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t('landing.cta.button')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
