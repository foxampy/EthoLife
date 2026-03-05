import { motion } from 'framer-motion';
import { FileText, BookOpen, TrendingUp, Shield, Users, Target, Zap, Globe, Layers } from 'lucide-react';
import { PremiumCard } from '@/components/PremiumCard';

export default function Whitepaper() {
  const sections = [
    { id: 'summary', title: 'Summary', icon: FileText },
    { id: 'introduction', title: 'Introduction', icon: BookOpen },
    { id: 'tokenomics', title: 'Tokenomics', icon: TrendingUp },
    { id: 'roadmap', title: 'Roadmap', icon: Globe },
    { id: 'project-hub', title: 'Project HUB', icon: Layers },
    { id: 'investment', title: 'Investment', icon: Target },
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
                Executive Summary
              </h2>
              <div className="premium-card p-8 space-y-4">
                <p className="text-lg leading-relaxed">
                  <strong>EthosLife</strong> is creating a fundamentally new category — <strong>Human Operating System (HOS)</strong>. While competitors fight for share in the existing HealthTech market ($650B), we are creating a new market.
                </p>
                <p className="text-foreground/80 leading-relaxed">
                  This is not just a "health app." It is a comprehensive infrastructure that transforms health from an episodic concern ("I'll go to the doctor when I'm sick") into a daily habit as natural as checking social media.
                </p>
                <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-500">
                  <p className="text-emerald-800 font-medium text-lg">"Health is a daily habit."</p>
                </div>
                <p className="text-foreground/80 leading-relaxed">
                  EthosLife is a unified center for daily habits, combining the entire spectrum of health, tools, specialists, projects, and products into a unique ecosystem.
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
                1. The Problem We Solve
              </h2>
              
              <div className="space-y-8">
                <PremiumCard className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">1.1 Fragmentation</h3>
                  <p className="text-foreground/80 mb-4 leading-relaxed">
                    Modern people use an average of <strong>7 different apps</strong> to manage health:
                  </p>
                  <ul className="space-y-2 list-disc list-inside ml-4 text-foreground/80">
                    <li>Sports apps</li>
                    <li>Nutrition apps</li>
                    <li>AI chats</li>
                    <li>Photos and scans of tests</li>
                    <li>Notes in calendars</li>
                  </ul>
                  <p className="text-foreground/80 mt-4 leading-relaxed">
                    <strong>Result:</strong> Data fragmentation, switching fatigue, loss of holistic health picture.
                  </p>
                </PremiumCard>

                <PremiumCard className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">1.2 Specialist Isolation</h3>
                  <p className="text-foreground/80 mb-4 leading-relaxed">
                    Therapist, nutritionist, and trainer work in a vacuum. Each treats their symptom separately without seeing the big picture. There is no unified center coordinating your health.
                  </p>
                </PremiumCard>

                <PremiumCard className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50">
                  <h3 className="text-2xl font-bold text-emerald-900 mb-4">Our Solution</h3>
                  <p className="text-emerald-800 text-xl font-bold mb-4">
                    7 modules. 1 platform. 0 switching.
                  </p>
                  <p className="text-emerald-700 leading-relaxed">
                    All your health — from genetics to social connections — in one interface, connected by artificial intelligence that sees connections you don't notice yourself.
                  </p>
                </PremiumCard>
              </div>
            </motion.div>
          </section>

          {/* Health Matrix */}
          <section id="health-matrix" className="scroll-mt-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Layers className="h-8 w-8 text-primary" />
                2. Universal Health Matrix: 12 Vectors
              </h2>
              
              <div className="space-y-6">
                <PremiumCard className="p-8">
                  <p className="text-foreground/80 mb-6">
                    Traditional approaches to health focus on individual aspects — nutrition, fitness, or medicine. EthosLife uses a <strong>holistic model</strong> recognized by modern science as the most effective for long-term well-being.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-xl">
                      <h4 className="font-bold text-emerald-900 mb-3">BODY (BIO)</h4>
                      <ul className="space-y-2 text-sm text-emerald-800">
                        <li>• 🏥 Medicine: Tests, Diagnosis, Treatment</li>
                        <li>• 🧬 Genetics: DNA tests, Epigenetics</li>
                        <li>• 🥗 Nutrition: Calories, Macros, Micros</li>
                        <li>• 💪 Movement: Workouts, Steps, Recovery</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-bold text-blue-900 mb-3">MIND (PSY)</h4>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li>• 🧠 Psychology: Mood, Stress, Therapy</li>
                        <li>• 😴 Sleep: Quality, Hygiene, Phases</li>
                        <li>• 🎯 Cognition: Focus, Memory, Learning</li>
                        <li>• 📱 Digital: Screen time, Detox</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-xl">
                      <h4 className="font-bold text-amber-900 mb-3">ENVIRONMENT (ECO)</h4>
                      <ul className="space-y-2 text-sm text-amber-800">
                        <li>• 🏠 Home: Air, Water, Toxins</li>
                        <li>• 🌍 Ecology: CO2, Noise, Light</li>
                        <li>• 🔬 Biochemistry: Microbiome, Sensors</li>
                        <li>• 🤝 Social: Relationships, Communities</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                    <h4 className="font-bold text-purple-900 mb-3">SOCIETY (SOCIO)</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm text-purple-800">
                      <div>• 💼 Career: Ikigai, Growth, Balance</div>
                      <div>• 💰 Finance: Budget, Investments, Stress</div>
                      <div>• 🌱 Impact: Volunteering, Ecology, DAO</div>
                    </div>
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
                3. UNITY Tokenomics
              </h2>
              
              <div className="space-y-6">
                <PremiumCard className="p-8">
                  <h3 className="text-2xl font-bold text-foreground mb-4">Fundamental Value</h3>
                  <p className="text-foreground/80 mb-6">
                    UNITY is a utility token providing: gamification of healthy habits, access to premium features, ecosystem governance (DAO), and settlements between participants.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-foreground mb-3">Token Parameters</h4>
                      <table className="w-full text-sm">
                        <tbody className="text-foreground/80">
                          <tr className="border-b"><td className="py-2">Name</td><td className="font-bold">Unity Token</td></tr>
                          <tr className="border-b"><td className="py-2">Symbol</td><td className="font-bold">UNITY</td></tr>
                          <tr className="border-b"><td className="py-2">Type</td><td className="font-bold">Utility (Off-chain → On-chain)</td></tr>
                          <tr className="border-b"><td className="py-2">Decimals</td><td className="font-bold">2</td></tr>
                          <tr className="border-b"><td className="py-2">Initial Price</td><td className="font-bold">$0.01 USD</td></tr>
                          <tr><td className="py-2">Total Supply (5 years)</td><td className="font-bold">1,000,000,000 UNITY</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-3">Token Distribution</h4>
                      <ul className="space-y-2 text-foreground/80">
                        <li className="flex justify-between"><span>Seed Investors</span> <span className="font-bold">14-26%</span></li>
                        <li className="flex justify-between"><span>Team</span> <span className="font-bold">20%</span></li>
                        <li className="flex justify-between"><span>Ecosystem</span> <span className="font-bold">30%</span></li>
                        <li className="flex justify-between"><span>Reserve</span> <span className="font-bold">15%</span></li>
                        <li className="flex justify-between"><span>Liquidity</span> <span className="font-bold">10%</span></li>
                        <li className="flex justify-between"><span>Advisors</span> <span className="font-bold">5%</span></li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <h4 className="font-bold text-emerald-900 mb-2">Earning (EARN)</h4>
                      <ul className="text-sm text-emerald-800 space-y-1">
                        <li>• Daily login: 10 UNITY</li>
                        <li>• All 7 modules tracked: 50 UNITY</li>
                        <li>• Workout completed: 25 UNITY</li>
                        <li>• 10,000 steps: 20 UNITY</li>
                        <li>• Referral signup: 200 UNITY</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-bold text-blue-900 mb-2">Spending (SPEND)</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Premium subscription: 1,699 UNITY</li>
                        <li>• Specialist 30min: 3,000 UNITY</li>
                        <li>• Specialist 60min: 6,000 UNITY</li>
                        <li>• Monthly coaching: 20,000 UNITY</li>
                        <li>• 15% discount with UNITY</li>
                      </ul>
                    </div>
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
                4. Roadmap: 4 Stages
              </h2>
              
              <div className="space-y-6">
                {/* Stage 1 */}
                <PremiumCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-white">1</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground">Pre-Seed (Closed)</h3>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Completed</span>
                      </div>
                      <p className="text-foreground/60 text-sm mb-3">$140,000 Self-funded | MVP 82% Complete</p>
                      <ul className="text-sm text-foreground/80 grid md:grid-cols-2 gap-2">
                        <li>• Health-as-a-Habit concept</li>
                        <li>• 245 components, 84 pages</li>
                        <li>• 7 health modules (85% ready)</li>
                        <li>• Expert council formed</li>
                      </ul>
                    </div>
                  </div>
                </PremiumCard>

                {/* Stage 2 */}
                <PremiumCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-white">2</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground">Seed (Current)</h3>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">In Progress</span>
                      </div>
                      <p className="text-foreground/60 text-sm mb-3">$350K – $650K | Opens March 10, 2026 | Token: $0.05</p>
                      <ul className="text-sm text-foreground/80 grid md:grid-cols-2 gap-2">
                        <li>• Full mobile ecosystem release (iOS/Android)</li>
                        <li>• All 7 modules launch</li>
                        <li>• B2B partnerships with fitness networks</li>
                        <li>• DAO & Knowledge Hub launch</li>
                        <li>• Target: 100K registrations, $50K MRR</li>
                      </ul>
                    </div>
                  </div>
                </PremiumCard>

                {/* Stage 3 */}
                <PremiumCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-white">3</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground">Series A (Global Expansion)</h3>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Planned</span>
                      </div>
                      <p className="text-foreground/60 text-sm mb-3">$1.5M – $2.5M | Q4 2026 – 2027</p>
                      <ul className="text-sm text-foreground/80 grid md:grid-cols-2 gap-2">
                        <li>• Scaling to MENA, EU, USA</li>
                        <li>• Wearables & bio-sensors launch</li>
                        <li>• Largest decentralized health database</li>
                        <li>• Target: 1M users, $200K MRR</li>
                      </ul>
                    </div>
                  </div>
                </PremiumCard>

                {/* Stage 4 */}
                <PremiumCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-white">4</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground">Series B & Beyond</h3>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">Planned</span>
                      </div>
                      <p className="text-foreground/60 text-sm mb-3">$10M+ | 2028+ | Ecosystem Dominance</p>
                      <ul className="text-sm text-foreground/80 grid md:grid-cols-2 gap-2">
                        <li>• Health-Metaverse creation</li>
                        <li>• Insurance & government integration</li>
                        <li>• Project Hub as HealthTech Launchpad</li>
                        <li>• Target: 50M users, IPO ready</li>
                      </ul>
                    </div>
                  </div>
                </PremiumCard>
              </div>
            </motion.div>
          </section>

          {/* Project Hub */}
          <section id="project-hub" className="scroll-mt-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Zap className="h-8 w-8 text-primary" />
                5. Project HUB
              </h2>
              
              <div className="space-y-6">
                <PremiumCard className="p-8">
                  <p className="text-foreground/80 mb-6">
                    ProjectHub is an ecosystem within the ecosystem where every project has an open staking pool. Investors can support specific development directions, earning income from their success.
                  </p>
                  
                  <h3 className="text-xl font-bold text-foreground mb-4">Active Projects</h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-medium text-emerald-700">Staking Open</span>
                      </div>
                      <h4 className="font-bold text-foreground">PostureAI Pro</h4>
                      <p className="text-xs text-foreground/60 mb-3">Real-time posture correction via computer vision</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span>Raised:</span><span className="font-bold">$45,000</span></div>
                        <div className="flex justify-between"><span>Readiness:</span><span className="font-bold">78%</span></div>
                        <div className="flex justify-between"><span>APY:</span><span className="font-bold text-emerald-600">12%</span></div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs font-medium text-blue-700">Staking Open</span>
                      </div>
                      <h4 className="font-bold text-foreground">SleepSync</h4>
                      <p className="text-xs text-foreground/60 mb-3">Smart alarm with sleep phases and biological cycles</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span>Raised:</span><span className="font-bold">$32,000</span></div>
                        <div className="flex justify-between"><span>Readiness:</span><span className="font-bold">65%</span></div>
                        <div className="flex justify-between"><span>APY:</span><span className="font-bold text-blue-600">15%</span></div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-xl bg-gradient-to-br from-amber-50 to-orange-50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <span className="text-xs font-medium text-amber-700">Coming Soon</span>
                      </div>
                      <h4 className="font-bold text-foreground">LLM HealthCore</h4>
                      <p className="text-xs text-foreground/60 mb-3">Proprietary LLM training datasets from health experts</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between"><span>Raised:</span><span className="font-bold">$12,000</span></div>
                        <div className="flex justify-between"><span>Readiness:</span><span className="font-bold">45%</span></div>
                        <div className="flex justify-between"><span>APY:</span><span className="font-bold text-amber-600">18%</span></div>
                      </div>
                    </div>
                  </div>
                </PremiumCard>
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
                6. Investment Thesis
              </h2>
              
              <div className="space-y-6">
                <PremiumCard className="p-8">
                  <h3 className="text-xl font-bold text-foreground mb-4">Seed Round</h3>
                  
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-emerald-50 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-700">$350K-$650K</div>
                      <div className="text-xs text-emerald-600">Hard Cap</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">$0.05</div>
                      <div className="text-xs text-blue-600">Token Price</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-700">7-13M</div>
                      <div className="text-xs text-purple-600">UNITY for Sale</div>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-lg">
                      <div className="text-2xl font-bold text-amber-700">6mo / 18mo</div>
                      <div className="text-xs text-amber-600">Cliff / Vesting</div>
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-foreground mb-3">Use of Funds</h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-2 bg-gray-50 rounded"><span>Product Development</span><span className="font-bold">40% ($200K)</span></div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded"><span>Marketing</span><span className="font-bold">30% ($150K)</span></div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded"><span>Team</span><span className="font-bold">15% ($75K)</span></div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded"><span>Legal & Compliance</span><span className="font-bold">10% ($50K)</span></div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded"><span>Reserve</span><span className="font-bold">5% ($25K)</span></div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <h5 className="font-bold text-emerald-900 mb-2">Expected Returns</h5>
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-emerald-700">
                            <th className="text-left py-1">Scenario</th>
                            <th className="text-right">Multiple</th>
                            <th className="text-right">5Y Price</th>
                          </tr>
                        </thead>
                        <tbody className="text-emerald-800">
                          <tr><td className="py-1">Conservative</td><td className="text-right font-bold">5x</td><td className="text-right">$0.25</td></tr>
                          <tr><td className="py-1">Base Case</td><td className="text-right font-bold">15x</td><td className="text-right">$0.75</td></tr>
                          <tr><td className="py-1">Optimistic</td><td className="text-right font-bold">50x</td><td className="text-right">$2.50</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                
                  <p className="text-foreground/80 leading-relaxed">
                    Join the future of health technology. Contact us at <a href="mailto:invest@ethoslife.com" className="text-primary hover:underline">invest@ethoslife.com</a>
                  </p>
                </PremiumCard>
              </div>
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
                  EthosLife represents a paradigm shift in health management by combining AI technology, blockchain incentives, and comprehensive health tracking. We are not just building an app — we are creating a new category: <strong>Human Operating System</strong>.
                </p>
                <p className="text-foreground/80 leading-relaxed mt-4">
                  With $140K self-funded, 245 components, 84 pages, and 7 health modules at 85% readiness, the platform is ready for global scaling.
                </p>
                <div className="mt-6 p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
                  <p className="text-emerald-800 font-medium">
                    Join us in building the future of healthcare — where technology empowers people to live healthier, happier lives.
                  </p>
                </div>
              </PremiumCard>
            </motion.div>
          </section>
        </div>
      </div>
    </div>
  );
}
