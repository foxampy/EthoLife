import { ChevronLeft, TrendingUp, AlertTriangle, Target, Wallet, Rocket, Globe, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function InvestmentProposal() {
  const [, setLocation] = useLocation();

  const fundingRounds = [
    {
      round: 'Pre-Seed (Closed)',
      amount: '$140K',
      valuation: 'N/A',
      status: 'completed',
      date: '2024-2025',
      description: 'Self-funded development phase',
      achievements: ['245 components', '84 pages', '7 modules (85% ready)', 'Expert council formed'],
    },
    {
      round: 'Seed (Current)',
      amount: '$350K-$650K',
      valuation: '$2.5-5M',
      status: 'active',
      date: 'Opens March 10, 2026',
      description: 'Product launch and initial scaling',
      achievements: ['Mobile apps iOS/Android', 'All 7 modules launch', 'B2B partnerships', 'DAO launch'],
    },
    {
      round: 'Series A',
      amount: '$1.5M-$2.5M',
      valuation: '$15-25M',
      status: 'upcoming',
      date: 'Q4 2026 - 2027',
      description: 'Global expansion and infrastructure',
      achievements: ['Global scaling (MENA, EU, USA)', 'Hardware integration', '1M users target'],
    },
    {
      round: 'Series B+',
      amount: '$10M+',
      valuation: '$100M+',
      status: 'upcoming',
      date: '2028+',
      description: 'Ecosystem dominance and IPO preparation',
      achievements: ['Health-Metaverse', 'Institutional integration', 'IPO readiness'],
    },
  ];

  const useOfFunds = [
    { category: 'Product Development', amount: 200000, percent: 40, details: 'AI improvements, Mobile apps, Integrations' },
    { category: 'Marketing', amount: 150000, percent: 30, details: 'Influencer campaigns, Content marketing, Performance ads' },
    { category: 'Team', amount: 75000, percent: 15, details: 'Additional developers, Marketing manager' },
    { category: 'Legal & Compliance', amount: 50000, percent: 10, details: 'Token legal opinion, SAFT agreements' },
    { category: 'Reserve', amount: 25000, percent: 5, details: 'Emergency fund' },
  ];

  const comparables = [
    { company: 'Calm', exit: '$2B', multiple: '20x revenue' },
    { company: 'Headspace', exit: '$3B', multiple: '15x revenue' },
    { company: 'Noom', exit: '$3.7B', multiple: '12x revenue' },
    { company: 'Whoop', exit: '$3.6B', multiple: '18x revenue' },
  ];

  const highlights = [
    { title: 'New Market Category', desc: 'Creating Human Operating System (HOS), not competing in existing HealthTech', icon: '🎯' },
    { title: '7-in-1 Platform', desc: 'Only platform integrating all health aspects with AI coordination', icon: '🏗️' },
    { title: 'Token Economics', desc: 'Healthy habits earn tokens - proven engagement model', icon: '🪙' },
    { title: 'Expert Team', desc: 'Olympic team doctors, AI researchers, health scientists', icon: '👥' },
    { title: '82% MVP Ready', desc: '$140K self-funded, 245 components built', icon: '✅' },
    { title: 'Market Size', desc: '$4.5T Wellness Economy, $650B Preventive Healthcare', icon: '🌍' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4 flex items-center gap-4">
          <button
            onClick={() => setLocation('/')}
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-foreground">Investment Opportunity</h1>
        </div>
      </header>

      <main className="container py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/20 via-teal-600/10 to-cyan-700/5 p-12 border border-border/50">
              <div className="relative z-10">
                <Badge className="bg-emerald-500 text-white mb-4">Seed Round March 2026</Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Invest in the Future of Health
                </h2>
                <p className="text-foreground/70 text-lg mb-8 max-w-2xl">
                  Join the creation of Human Operating System - a new category in the $4.5T wellness economy.
                  Seed round opens March 10, 2026.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-white/80 rounded-xl">
                    <div className="text-3xl font-bold text-emerald-600">$350-650K</div>
                    <div className="text-sm text-gray-600">Seed Target</div>
                  </div>
                  <div className="p-4 bg-white/80 rounded-xl">
                    <div className="text-3xl font-bold text-blue-600">$0.05</div>
                    <div className="text-sm text-gray-600">Token Price</div>
                  </div>
                  <div className="p-4 bg-white/80 rounded-xl">
                    <div className="text-3xl font-bold text-purple-600">15x</div>
                    <div className="text-sm text-gray-600">Base Case ROI</div>
                  </div>
                  <div className="p-4 bg-white/80 rounded-xl">
                    <div className="text-3xl font-bold text-amber-600">March 10</div>
                    <div className="text-sm text-gray-600">Round Opens</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Funding Rounds */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-8">Funding Rounds</h2>
            <div className="space-y-6">
              {fundingRounds.map((round, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`relative overflow-hidden rounded-2xl p-6 border ${
                    round.status === 'active' 
                      ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-200' 
                      : round.status === 'completed'
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      round.status === 'active' ? 'bg-blue-500 text-white' :
                      round.status === 'completed' ? 'bg-emerald-500 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {round.status === 'active' ? <Rocket className="w-6 h-6" /> :
                       round.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> :
                       <Globe className="w-6 h-6" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-foreground">{round.round}</h3>
                        <Badge className={
                          round.status === 'active' ? 'bg-blue-100 text-blue-700' :
                          round.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-gray-100 text-gray-700'
                        }>
                          {round.status === 'active' ? 'Open Soon' :
                           round.status === 'completed' ? 'Completed' : 'Planned'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{round.date}</p>
                      <p className="text-foreground/70">{round.description}</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">{round.amount}</p>
                      {round.valuation !== 'N/A' && (
                        <p className="text-sm text-gray-500">Valuation: {round.valuation}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Achievements */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {round.achievements.map((achievement, aidx) => (
                        <span key={aidx} className="px-3 py-1 bg-white rounded-full text-sm text-gray-600">
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Use of Funds */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-8">Seed Round: Use of Funds</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="font-bold text-foreground mb-6">Allocation Breakdown</h3>
                <div className="space-y-4">
                  {useOfFunds.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{item.category}</span>
                        <div className="text-right">
                          <span className="font-semibold">${(item.amount / 1000).toFixed(0)}K</span>
                          <span className="text-xs text-gray-500 ml-2">({item.percent}%)</span>
                        </div>
                      </div>
                      <Progress value={item.percent} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{item.details}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <div className="space-y-4">
                <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50">
                  <h3 className="font-bold text-emerald-900 mb-4">Expected Returns</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Conservative</span>
                      <div className="text-right">
                        <span className="font-bold text-emerald-600">5x</span>
                        <span className="text-sm text-gray-500 ml-2">$0.25</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Base Case</span>
                      <div className="text-right">
                        <span className="font-bold text-blue-600">15x</span>
                        <span className="text-sm text-gray-500 ml-2">$0.75</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-600">Optimistic</span>
                      <div className="text-right">
                        <span className="font-bold text-purple-600">50x</span>
                        <span className="text-sm text-gray-500 ml-2">$2.50</span>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-bold text-foreground mb-4">Token Terms</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-600">Token Price</span>
                      <span className="font-medium">$0.05 USD</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-600">Tokens for Sale</span>
                      <span className="font-medium">7-13M UNITY</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-600">Min Investment</span>
                      <span className="font-medium">$5,000</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-gray-600">Max Investment</span>
                      <span className="font-medium">$100,000</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Vesting</span>
                      <span className="font-medium">6mo cliff, 18mo vesting</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </motion.section>

          {/* Market Comparables */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-8">Market Comparables</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {comparables.map((comp, idx) => (
                <Card key={idx} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-2xl font-bold text-foreground mb-1">{comp.company}</div>
                  <div className="text-3xl font-bold text-emerald-600 mb-1">{comp.exit}</div>
                  <div className="text-sm text-gray-500">{comp.multiple}</div>
                </Card>
              ))}
            </div>
          </motion.section>

          {/* Investment Highlights */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-8">Why Invest in EthosLife</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlights.map((highlight, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      <span className="text-4xl flex-shrink-0">{highlight.icon}</span>
                      <div>
                        <h3 className="font-bold text-foreground mb-2">{highlight.title}</h3>
                        <p className="text-foreground/70 text-sm">{highlight.desc}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Risk Factors */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-8">Risk Analysis</h2>
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-foreground mb-2">Risk Management</h3>
                  <p className="text-foreground/70 text-sm">
                    All identified risks have mitigation strategies and monitoring in place.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Competition', value: 65, color: 'bg-red-500' },
                  { label: 'Regulation', value: 45, color: 'bg-orange-500' },
                  { label: 'Technology', value: 30, color: 'bg-yellow-500' },
                  { label: 'Market', value: 25, color: 'bg-green-500' },
                  { label: 'Team', value: 15, color: 'bg-blue-500' },
                ].map((risk, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{risk.label}</span>
                      <span className="text-sm text-gray-500">{risk.value}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${risk.color}`} style={{ width: `${risk.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.section>

          {/* Call to Action */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              <CardContent className="p-8">
                <div className="text-center max-w-2xl mx-auto">
                  <h3 className="text-3xl font-bold mb-4">Ready to Invest?</h3>
                  <p className="text-white/90 mb-8">
                    Seed round opens March 10, 2026. Join the revolution in health technology 
                    and be part of creating the Human Operating System.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="secondary" size="lg">
                      Download Pitch Deck
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-white text-white hover:bg-white/10" 
                      size="lg"
                      onClick={() => window.location.href = 'mailto:invest@ethoslife.com'}
                    >
                      Contact Us
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
