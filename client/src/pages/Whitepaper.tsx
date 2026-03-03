import { motion } from 'framer-motion';
import { FileText, BookOpen, TrendingUp, Shield, Users, Target, Zap, Globe } from 'lucide-react';
import { PremiumCard } from '@/components/PremiumCard';

export default function Whitepaper() {
  const sections = [
    { id: 'summary', title: 'Summary', icon: FileText },
    { id: 'introduction', title: 'Introduction', icon: BookOpen },
    { id: 'architecture', title: 'Architecture', icon: Zap },
    { id: 'tokenomics', title: 'Tokenomics', icon: TrendingUp },
    { id: 'dao', title: 'DAO', icon: Users },
    { id: 'security', title: 'Security', icon: Shield },
    { id: 'economics', title: 'Economics', icon: Target },
    { id: 'roadmap', title: 'Roadmap', icon: Globe },
    { id: 'team', title: 'Team', icon: Users },
    { id: 'risks', title: 'Risks', icon: Shield },
    { id: 'investment', title: 'Investment', icon: TrendingUp },
    { id: 'conclusion', title: 'Conclusion', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">EthosLife Whitepaper</h1>
          <p className="text-xl text-foreground/70 mb-2">Healthy living is a habit</p>
          <p className="text-sm text-foreground/50">Version 1.0 | January 2025</p>
        </motion.div>

        {/* Navigation - Fixed with lower z-index than bottom nav */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="sticky top-20 z-30 mb-12 bg-card/95 backdrop-blur-md rounded-xl p-4 border border-border shadow-lg"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-sm"
                onClick={(e) => {
                  // Close menu if open on mobile
                  const menuEvent = new CustomEvent('close-bottom-menu');
                  window.dispatchEvent(menuEvent);
                }}
              >
                <section.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{section.title}</span>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-16">
          {/* Summary */}
          <section id="summary" className="scroll-mt-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                Summary
              </h2>
              <div className="premium-card p-8 space-y-4">
                <p className="text-lg leading-relaxed">
                  <strong>EthosLife</strong> is an innovative health management platform that combines advanced AI technologies, medical data, fitness, nutrition, psychology, and social interaction into a unified ecosystem. The platform addresses the problem of fragmented health data by creating a unified digital health profile with personalized recommendations and comprehensive monitoring.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  The platform uses artificial intelligence to analyze over 2,000 health indicators with 95% accuracy, providing personalized wellness and disease prevention plans. EthosLife creates a sustainable health economy where all participants benefit from healthy lifestyles.
                </p>
              </div>
            </motion.div>
          </section>

          {/* Introduction */}
          <section id="introduction" className="scroll-mt-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-primary" />
                1. Introduction
              </h2>
              
              <div className="space-y-8">
                <PremiumCard className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">1.1 The Problem</h3>
                  <p className="text-foreground/80 mb-4 leading-relaxed">
                    The modern healthcare system suffers from fragmented data:
                  </p>
                  <ul className="space-y-2 list-disc list-inside ml-4 text-foreground/80">
                    <li>Medical records stored across different systems</li>
                    <li>Fitness trackers not integrated with medical data</li>
                    <li>Lack of personalized approach to health</li>
                    <li>No unified platform for managing all health aspects</li>
                    <li>Users lose control over their data</li>
                    <li>Specialists don't have complete health picture</li>
                  </ul>
                </PremiumCard>

                <PremiumCard className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">1.2 The Solution</h3>
                  <p className="text-foreground/80 mb-4 leading-relaxed">
                    EthosLife creates a unified ecosystem where:
                  </p>
                  <ul className="space-y-2 list-disc list-inside ml-4 text-foreground/80">
                    <li>All health data stored in one place</li>
                    <li>AI analyzes data and creates personalized plans</li>
                    <li>Users receive rewards for healthy lifestyle</li>
                    <li>Specialists can effectively work with patients</li>
                    <li>Integration with medical institutions via FHIR/HL7</li>
                    <li>Continuous 24/7 monitoring</li>
                  </ul>
                </PremiumCard>
              </div>
            </motion.div>
          </section>

          {/* Architecture */}
          <section id="architecture" className="scroll-mt-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Zap className="h-8 w-8 text-primary" />
                2. Platform Architecture
              </h2>
              
              <div className="space-y-6">
                <PremiumCard className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">2.1 Platform Components</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        title: 'Medical Data',
                        items: [
                          'FHIR/HL7 server integration',
                          'Unified medical record',
                          'Lab results and document import',
                          'OCR for document recognition',
                          'Risk Engine for health assessment',
                        ]
                      },
                      {
                        title: 'AI Analytics',
                        items: [
                          'Multi-model LLM (Groq, Gemini, Qwen)',
                          'Predictive analytics',
                          'Personalized recommendations',
                          'Natural language processing',
                          'Computer vision for documents',
                        ]
                      },
                      {
                        title: 'Health Modules',
                        items: [
                          '7 health directions tracking',
                          'Medicine, Movement, Nutrition',
                          'Psychology, Sleep, Relationships',
                          'Habits formation system',
                          'Gamification and rewards',
                        ]
                      },
                      {
                        title: 'Social Features',
                        items: [
                          'Specialist marketplace',
                          'Community challenges',
                          'Family health tracking',
                          'Referral program',
                          'Health centers network',
                        ]
                      },
                    ].map((block, idx) => (
                      <div key={idx} className="p-4 bg-muted rounded-lg">
                        <h4 className="font-bold text-foreground mb-3">{block.title}</h4>
                        <ul className="space-y-1 text-sm text-foreground/70">
                          {block.items.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </PremiumCard>
              </div>
            </motion.div>
          </section>

          {/* Tokenomics */}
          <section id="tokenomics" className="scroll-mt-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                3. Tokenomics
              </h2>
              
              <div className="space-y-6">
                <PremiumCard className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">UNITY Token</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-foreground mb-3">Token Distribution</h4>
                      <ul className="space-y-2 text-foreground/80">
                        <li className="flex justify-between"><span>Community Rewards</span> <span className="font-bold">25%</span></li>
                        <li className="flex justify-between"><span>Pre-seed / Seed</span> <span className="font-bold">20%</span></li>
                        <li className="flex justify-between"><span>Team & Advisors</span> <span className="font-bold">20%</span></li>
                        <li className="flex justify-between"><span>Marketing</span> <span className="font-bold">15%</span></li>
                        <li className="flex justify-between"><span>Liquidity Pool</span> <span className="font-bold">15%</span></li>
                        <li className="flex justify-between"><span>Reserve</span> <span className="font-bold">5%</span></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-3">Token Utility</h4>
                      <ul className="space-y-2 text-foreground/80">
                        <li>• 15% discount on subscription payments</li>
                        <li>• Staking rewards: 15-25% APY</li>
                        <li>• Rewards for health achievements</li>
                        <li>• Referral program payouts</li>
                        <li>• Specialist service payments</li>
                        <li>• Premium feature access</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                    <p className="text-emerald-800 font-medium">Exchange Rate: 1 USD = 8.5 UNITY</p>
                    <p className="text-emerald-600 text-sm">15% bonus when paying with tokens</p>
                  </div>
                </PremiumCard>
              </div>
            </motion.div>
          </section>

          {/* DAO */}
          <section id="dao" className="scroll-mt-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                4. DAO Governance
              </h2>
              
              <PremiumCard className="p-8">
                <p className="text-foreground/80 leading-relaxed mb-4">
                  EthosLife implements a decentralized governance model where token holders can participate in platform development decisions:
                </p>
                <ul className="space-y-2 list-disc list-inside text-foreground/80">
                  <li>Proposal submission for platform improvements</li>
                  <li>Voting on new health modules and features</li>
                  <li>Treasury fund allocation decisions</li>
                  <li>Specialist verification and ratings</li>
                  <li>Protocol parameter changes</li>
                </ul>
              </PremiumCard>
            </motion.div>
          </section>

          {/* Security */}
          <section id="security" className="scroll-mt-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                5. Security & Compliance
              </h2>
              
              <PremiumCard className="p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-foreground mb-3">Data Protection</h4>
                    <ul className="space-y-1 text-foreground/80 text-sm">
                      <li>• End-to-end encryption</li>
                      <li>• HIPAA compliance</li>
                      <li>• GDPR compliance</li>
                      <li>• Regular security audits</li>
                      <li>• Multi-factor authentication</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-3">Smart Contract Security</h4>
                    <ul className="space-y-1 text-foreground/80 text-sm">
                      <li>• Third-party audits</li>
                      <li>• Bug bounty program</li>
                      <li>• Time-locked admin functions</li>
                      <li>• Emergency pause mechanism</li>
                      <li>• Formal verification</li>
                    </ul>
                  </div>
                </div>
              </PremiumCard>
            </motion.div>
          </section>

          {/* Roadmap */}
          <section id="roadmap" className="scroll-mt-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Globe className="h-8 w-8 text-primary" />
                6. Roadmap
              </h2>
              
              <div className="space-y-4">
                {[
                  { phase: 'Q1-Q4 2025', title: 'Foundation', status: 'Completed', items: ['Core platform development', '7 health modules', 'AI integration', '47 database tables'] },
                  { phase: 'Q1 2026', title: 'Pre-seed Launch', status: 'In Progress', items: ['Token smart contract', 'Pre-seed $500K-$1M', 'Community building', 'Whitepaper release'] },
                  { phase: 'Q2-Q3 2026', title: 'Growth', status: 'Planned', items: ['Mobile apps', '500+ specialists', 'Marketing campaign', 'CEX/DEX listings'] },
                  { phase: 'Q4 2026+', title: 'Scale', status: 'Planned', items: ['100K+ users', 'B2B solutions', 'Series A $20-30M', 'Global expansion'] },
                ].map((phase, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-muted rounded-lg">
                    <div className="w-24 flex-shrink-0">
                      <span className="text-sm font-bold text-primary">{phase.phase}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-foreground">{phase.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          phase.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          phase.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>{phase.status}</span>
                      </div>
                      <ul className="text-sm text-foreground/70">
                        {phase.items.map((item, i) => <li key={i}>• {item}</li>)}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* Investment */}
          <section id="investment" className="scroll-mt-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                7. Investment Opportunity
              </h2>
              
              <PremiumCard className="p-8">
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-3xl font-bold text-emerald-700">$2.5-3M</div>
                    <div className="text-sm text-emerald-600">Current Valuation</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-700">$500K-1M</div>
                    <div className="text-sm text-blue-600">Pre-seed Target</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-700">$0.02</div>
                    <div className="text-sm text-purple-600">Token Price</div>
                  </div>
                </div>
                
                <p className="text-foreground/80 leading-relaxed">
                  Join the future of health technology. Pre-seed round is now open with 80% discount from public sale price. Contact us at <a href="mailto:invest@ethoslife.com" className="text-primary hover:underline">invest@ethoslife.com</a>
                </p>
              </PremiumCard>
            </motion.div>
          </section>

          {/* Conclusion */}
          <section id="conclusion" className="scroll-mt-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                Conclusion
              </h2>
              
              <PremiumCard className="p-8">
                <p className="text-foreground/80 leading-relaxed text-lg">
                  EthosLife represents a paradigm shift in health management by combining AI technology, blockchain incentives, and comprehensive health tracking. With $141K already invested, 2,450 development hours, and 47 production database tables, the platform is ready for global scaling.
                </p>
                <p className="text-foreground/80 leading-relaxed mt-4">
                  Join us in building the future of healthcare — where technology empowers people to live healthier, happier lives.
                </p>
              </PremiumCard>
            </motion.div>
          </section>
        </div>
      </div>
    </div>
  );
}
