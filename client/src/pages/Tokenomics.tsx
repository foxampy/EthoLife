import { useState } from 'react';
import { ChevronLeft, TrendingUp, Coins, Gift, Zap, Lock, Users, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

export default function Tokenomics() {
  const [, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState('overview');

  const tokenDistribution = [
    { category: 'Seed Investors', percentage: 20, amount: '10M UNITY', vesting: '6mo cliff, 18mo vesting', color: 'bg-blue-500' },
    { category: 'Team', percentage: 20, amount: '10M UNITY', vesting: '24mo vesting', color: 'bg-purple-500' },
    { category: 'Ecosystem', percentage: 30, amount: '15M UNITY', vesting: 'Linear 48mo', color: 'bg-emerald-500' },
    { category: 'Reserve', percentage: 15, amount: '7.5M UNITY', vesting: 'As needed', color: 'bg-amber-500' },
    { category: 'Liquidity', percentage: 10, amount: '5M UNITY', vesting: 'Immediate', color: 'bg-cyan-500' },
    { category: 'Advisors', percentage: 5, amount: '2.5M UNITY', vesting: '12mo vesting', color: 'bg-pink-500' },
  ];

  const earningMethods = [
    { action: 'Daily login', reward: '10 UNITY', limit: '1/day' },
    { action: 'All 7 modules tracked', reward: '50 UNITY', limit: '1/day' },
    { action: 'Meal logged', reward: '5 UNITY', limit: '3/day' },
    { action: 'Workout completed', reward: '25 UNITY', limit: '3/day' },
    { action: 'Sleep tracked', reward: '10 UNITY', limit: '1/day' },
    { action: 'Mood recorded', reward: '8 UNITY', limit: '1/day' },
    { action: 'Meditation completed', reward: '15 UNITY', limit: '3/day' },
    { action: '10,000 steps', reward: '20 UNITY', limit: '1/day' },
  ];

  const streakBonuses = [
    { days: 7, bonus: '50 UNITY' },
    { days: 30, bonus: '300 UNITY' },
    { days: 90, bonus: '1,000 UNITY' },
    { days: 365, bonus: '5,000 UNITY' },
  ];

  const spendingOptions = [
    { item: 'Basic Subscription', unity: '999 UNITY', fiat: '$9.99', discount: null },
    { item: 'Premium Subscription', unity: '1,699 UNITY', fiat: '$19.99', discount: '15%' },
    { item: 'Family Subscription', unity: '3,399 UNITY', fiat: '$39.99', discount: '15%' },
    { item: '30min Specialist', unity: '3,000 UNITY', fiat: '$30', discount: null },
    { item: '60min Specialist', unity: '6,000 UNITY', fiat: '$60', discount: null },
    { item: 'Monthly Coaching', unity: '20,000 UNITY', fiat: '$200', discount: null },
  ];

  const emissionSchedule = [
    { year: 2026, emission: '10M', circulating: '10M', price: '$0.05', marketCap: '$500K' },
    { year: 2027, emission: '15M', circulating: '25M', price: '$0.10', marketCap: '$2.5M' },
    { year: 2028, emission: '12M', circulating: '37M', price: '$0.20', marketCap: '$7.4M' },
    { year: 2029, emission: '8M', circulating: '45M', price: '$0.35', marketCap: '$15.7M' },
    { year: 2030, emission: '5M', circulating: '50M', price: '$0.50', marketCap: '$25M' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container py-4 flex items-center gap-4">
          <button
            onClick={() => setLocation('/')}
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-foreground">UNITY Tokenomics</h1>
        </div>
      </header>

      <main className="container py-12">
        <div className="max-w-5xl mx-auto">
          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
              <Coins className="w-8 h-8 text-emerald-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900">1B</div>
              <div className="text-sm text-gray-500">Total Supply</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900">$0.05</div>
              <div className="text-sm text-gray-500">Seed Price</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <Zap className="w-8 h-8 text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900">50M</div>
              <div className="text-sm text-gray-500">Initial Supply</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
              <Gift className="w-8 h-8 text-amber-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900">15%</div>
              <div className="text-sm text-gray-500">Payment Discount</div>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border pb-4 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Coins },
              { id: 'distribution', label: 'Distribution', icon: Users },
              { id: 'earn', label: 'Earn', icon: Gift },
              { id: 'spend', label: 'Spend', icon: Zap },
              { id: 'emission', label: 'Emission', icon: TrendingUp },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 font-semibold whitespace-nowrap transition-colors rounded-lg ${
                  selectedTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground/60 hover:text-foreground hover:bg-muted'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/2">
                <h2 className="text-3xl font-bold text-foreground mb-4">Fundamental Value</h2>
                <p className="text-foreground/70 mb-6 text-lg">
                  UNITY is a utility token providing: gamification of healthy habits, access to premium features, ecosystem governance (DAO), and settlements between participants.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold text-foreground">Token Parameters</h3>
                    <table className="w-full text-sm">
                      <tbody className="text-foreground/80">
                        <tr className="border-b"><td className="py-2">Name</td><td className="font-bold">Unity Token</td></tr>
                        <tr className="border-b"><td className="py-2">Symbol</td><td className="font-bold">UNITY</td></tr>
                        <tr className="border-b"><td className="py-2">Type</td><td className="font-bold">Utility (Off-chain → On-chain)</td></tr>
                        <tr className="border-b"><td className="py-2">Decimals</td><td className="font-bold">2</td></tr>
                        <tr className="border-b"><td className="py-2">Initial Price</td><td className="font-bold">$0.01 (Pre-seed) / $0.05 (Seed)</td></tr>
                        <tr><td className="py-2">Total Supply</td><td className="font-bold">1,000,000,000 UNITY (5 years)</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-bold text-foreground">Token Utility</h3>
                    <ul className="space-y-2 text-foreground/80">
                      <li className="flex items-start gap-2">
                        <Zap className="w-5 h-5 text-emerald-500 mt-0.5" />
                        <span>Gamification of healthy habits</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Lock className="w-5 h-5 text-blue-500 mt-0.5" />
                        <span>Access to premium features</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Users className="w-5 h-5 text-purple-500 mt-0.5" />
                        <span>Ecosystem governance (DAO)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Coins className="w-5 h-5 text-amber-500 mt-0.5" />
                        <span>Settlements between participants</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Gift className="w-5 h-5 text-pink-500 mt-0.5" />
                        <span>15% discount on subscriptions</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Distribution Tab */}
          {selectedTab === 'distribution' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">Token Distribution</h2>
              
              <div className="space-y-4">
                {tokenDistribution.map((item, idx) => (
                  <Card key={idx} className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded ${item.color}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-foreground">{item.category}</h3>
                          <div className="text-right">
                            <span className="text-2xl font-bold">{item.percentage}%</span>
                            <span className="text-sm text-gray-500 ml-2">{item.amount}</span>
                          </div>
                        </div>
                        <Progress value={item.percentage} className="h-2 mb-2" />
                        <p className="text-sm text-gray-500">Vesting: {item.vesting}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Earn Tab */}
          {selectedTab === 'earn' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Daily Activities */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Daily Activities</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {earningMethods.map((method, idx) => (
                    <Card key={idx} className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground">{method.action}</span>
                        <div className="text-right">
                          <span className="font-bold text-emerald-600">{method.reward}</span>
                          <span className="text-xs text-gray-500 ml-2">({method.limit})</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Streak Bonuses */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Streak Bonuses</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {streakBonuses.map((streak, idx) => (
                    <Card key={idx} className="p-4 text-center bg-gradient-to-br from-amber-50 to-orange-50">
                      <div className="text-3xl font-bold text-amber-600">{streak.days}</div>
                      <div className="text-sm text-gray-500">days</div>
                      <div className="font-bold text-gray-900 mt-2">+{streak.bonus}</div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Referral Program */}
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                <h3 className="text-xl font-bold text-foreground mb-4">Referral Program</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">200 UNITY</div>
                    <div className="text-sm text-gray-500">Friend signs up</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">1,000 UNITY</div>
                    <div className="text-sm text-gray-500">Friend buys subscription</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">100 UNITY</div>
                    <div className="text-sm text-gray-500">Friend earns 1,000 UNITY</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Spend Tab */}
          {selectedTab === 'spend' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">Spending Options</h2>
              
              <div className="grid gap-4">
                {spendingOptions.map((option, idx) => (
                  <Card key={idx} className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{option.item}</span>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="font-bold text-emerald-600">{option.unity}</span>
                          <span className="text-sm text-gray-400 line-through ml-2">{option.fiat}</span>
                        </div>
                        {option.discount && (
                          <Badge className="bg-emerald-100 text-emerald-700">
                            -{option.discount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Cashback Program */}
              <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50">
                <h3 className="text-xl font-bold text-foreground mb-4">Cashback Program</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { tier: 'Free', cashback: '1%', multiplier: '1.0x' },
                    { tier: 'Basic', cashback: '3%', multiplier: '1.2x' },
                    { tier: 'Premium', cashback: '5%', multiplier: '1.5x' },
                    { tier: 'Family', cashback: '4%', multiplier: '1.3x' },
                  ].map((tier, idx) => (
                    <div key={idx} className="text-center p-4 bg-white rounded-xl">
                      <div className="font-bold text-gray-900">{tier.tier}</div>
                      <div className="text-2xl font-bold text-emerald-600">{tier.cashback}</div>
                      <div className="text-xs text-gray-500">Multiplier: {tier.multiplier}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Emission Tab */}
          {selectedTab === 'emission' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">Emission Schedule</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Year</th>
                      <th className="text-right py-3 px-4">Emission</th>
                      <th className="text-right py-3 px-4">Circulating</th>
                      <th className="text-right py-3 px-4">Price (est.)</th>
                      <th className="text-right py-3 px-4">Market Cap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emissionSchedule.map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{row.year}</td>
                        <td className="text-right py-3 px-4">{row.emission}</td>
                        <td className="text-right py-3 px-4 font-bold">{row.circulating}</td>
                        <td className="text-right py-3 px-4 text-emerald-600">{row.price}</td>
                        <td className="text-right py-3 px-4">{row.marketCap}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Tokenomics is undergoing in-depth calculation (75% complete). 
                  Final parameters will be published before Seed Round opens on March 10, 2026.
                </p>
              </div>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Ready to start earning UNITY?</h3>
                  <p className="text-white/90 mb-6 max-w-xl mx-auto">
                    Join EthosLife today and start earning tokens for healthy habits. 
                    Seed round opens March 10, 2026.
                  </p>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={() => setLocation('/register')}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
