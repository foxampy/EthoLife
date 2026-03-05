import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Target, 
  Coins, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Circle, 
  Clock,
  Wallet,
  Code2,
  Megaphone,
  Globe,
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Download,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface RoadmapPhase {
  id: string;
  period: string;
  title: string;
  subtitle: string;
  status: 'completed' | 'active' | 'upcoming';
  icon: React.ElementType;
  color: string;
  budget: string;
  description: string;
  milestones: {
    title: string;
    completed: boolean;
    value?: string;
    details?: string;
  }[];
  metrics?: {
    label: string;
    value: string;
  }[];
}

const roadmapData: RoadmapPhase[] = [
  {
    id: 'pre-seed-closed',
    period: 'Pre-Seed (Closed)',
    title: 'Foundation',
    subtitle: 'Self-funded Development',
    status: 'completed',
    icon: Code2,
    color: 'from-emerald-500 to-teal-600',
    budget: '$140,000',
    description: 'Core platform development, Health-as-a-Habit concept, 7 modules architecture',
    milestones: [
      { title: 'Architecture Core', completed: true, details: '245 components, 84 pages created' },
      { title: 'Health Modules', completed: true, value: '85% ready', details: 'All 7 modules in development' },
      { title: 'Expert Council', completed: true, details: 'Medicine, biomedicine, psychology experts' },
      { title: 'Initial LLM', completed: true, details: 'Primary AI integration' },
    ],
    metrics: [
      { label: 'MVP Readiness', value: '82%' },
      { label: 'Components', value: '245' },
      { label: 'Pages', value: '84' },
    ]
  },
  {
    id: 'seed',
    period: 'Seed (Current)',
    title: 'Product Launch',
    subtitle: 'March 10, 2026',
    status: 'active',
    icon: Rocket,
    color: 'from-blue-500 to-indigo-600',
    budget: '$350K - $650K',
    description: 'Transforming technological protocol into mass product. Mobile ecosystem launch.',
    milestones: [
      { title: 'Mobile Release', completed: false, details: 'iOS & Android full ecosystem' },
      { title: 'All Modules Launch', completed: false, details: 'From Biochemistry to Society' },
      { title: 'B2B Partnerships', completed: false, details: 'Fitness networks, clinics, retail' },
      { title: 'Smart Referral', completed: false, details: 'Referral system in UNITY' },
      { title: 'DAO Launch', completed: false, details: 'Knowledge Hub & governance' },
      { title: 'Deep LLM Training', completed: false, details: 'Digital twin creation' },
    ],
    metrics: [
      { label: 'Token Price', value: '$0.05' },
      { label: 'Target Users', value: '100K' },
      { label: 'Target MRR', value: '$50K' },
    ]
  },
  {
    id: 'series-a',
    period: 'Series A',
    title: 'Global Expansion',
    subtitle: 'Q4 2026 - 2027',
    status: 'upcoming',
    icon: Globe,
    color: 'from-purple-500 to-violet-600',
    budget: '$1.5M - $2.5M',
    description: 'International market capture and infrastructure creation.',
    milestones: [
      { title: 'Global Scaling', completed: false, details: 'MENA, EU, USA regions' },
      { title: 'Hardware Integration', completed: false, details: 'Wearables & home bio-sensors' },
      { title: 'Knowledge Mining', completed: false, details: 'Largest decentralized health DB' },
      { title: 'Compliance', completed: false, details: 'GDPR/HIPAA localization' },
    ],
    metrics: [
      { label: 'Target Users', value: '1M' },
      { label: 'Target MRR', value: '$200K' },
      { label: 'Countries', value: '20+' },
    ]
  },
  {
    id: 'series-b',
    period: 'Series B+',
    title: 'Ecosystem Dominance',
    subtitle: '2028+',
    status: 'upcoming',
    icon: Star,
    color: 'from-amber-500 to-orange-600',
    budget: '$10M+',
    description: 'Health-Metaverse creation and market dominance.',
    milestones: [
      { title: 'Institutional Integration', completed: false, details: 'Insurance & government systems' },
      { title: 'M&A Strategy', completed: false, details: 'Acquisition of health-tech players' },
      { title: 'Project Hub', completed: false, details: 'Launchpad for developers' },
      { title: 'Planetary Impact', completed: false, details: 'Population health management' },
    ],
    metrics: [
      { label: 'Target Users', value: '50M' },
      { label: 'IPO Ready', value: 'Yes' },
      { label: 'Valuation', value: '$500M+' },
    ]
  },
];

const investmentBreakdown = [
  { category: 'Product Development', amount: 200000, percent: 40, icon: Code2, details: 'AI, Mobile apps, Integrations' },
  { category: 'Marketing', amount: 150000, percent: 30, icon: Megaphone, details: 'Influencers, Content, Ads' },
  { category: 'Team', amount: 75000, percent: 15, icon: Users, details: 'Developers, Marketing manager' },
  { category: 'Legal & Compliance', amount: 50000, percent: 10, icon: Target, details: 'Token legal opinion, SAFT' },
  { category: 'Reserve', amount: 25000, percent: 5, icon: Wallet, details: 'Emergency fund' },
];

export default function Roadmap() {
  const [expandedPhase, setExpandedPhase] = useState<string | null>('seed');
  const [activeTab, setActiveTab] = useState<'roadmap' | 'financials'>('roadmap');

  const totalInvested = investmentBreakdown.reduce((acc, item) => acc + item.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Badge className="bg-white/20 text-white mb-4">Live Tracking</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">EthosLife Roadmap</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              From concept to global health ecosystem. 4 stages to transform human health.
            </p>
            
            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold">$140K</div>
                <div className="text-sm text-white/80">Self-funded</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold">82%</div>
                <div className="text-sm text-white/80">MVP Ready</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold">245</div>
                <div className="text-sm text-white/80">Components</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold">7</div>
                <div className="text-sm text-white/80">Health Modules</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'roadmap', label: 'Roadmap', icon: Rocket },
              { id: 'financials', label: 'Seed Round', icon: Wallet },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ROADMAP TAB */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">
            {/* Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500 transform md:-translate-x-1/2" />
              
              {roadmapData.map((phase, index) => {
                const Icon = phase.icon;
                const isExpanded = expandedPhase === phase.id;
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div
                    key={phase.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative flex items-start gap-4 md:gap-8 mb-8 ${
                      isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                      <div className={`w-4 h-4 rounded-full border-4 border-white shadow-lg ${
                        phase.status === 'completed' ? 'bg-emerald-500' :
                        phase.status === 'active' ? 'bg-blue-500 animate-pulse' :
                        'bg-gray-300'
                      }`} />
                    </div>

                    {/* Content Card */}
                    <div className={`ml-16 md:ml-0 md:w-5/12 ${
                      isEven ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'
                    }`}>
                      <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${
                        phase.status === 'active' ? 'ring-2 ring-blue-500' : ''
                      }`}>
                        <CardHeader className={`bg-gradient-to-r ${phase.color} text-white`}>
                          <div className={`flex items-center gap-3 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className={isEven ? 'md:text-right' : ''}>
                              <Badge className="bg-white/20 text-white mb-1">
                                {phase.period}
                              </Badge>
                              <CardTitle className="text-lg">{phase.title}</CardTitle>
                              <p className="text-sm text-white/80">{phase.subtitle}</p>
                            </div>
                          </div>
                          
                          <div className={`mt-3 flex items-center gap-2 text-sm ${isEven ? 'md:justify-end' : ''}`}>
                            <Wallet className="w-4 h-4" />
                            <span className="font-semibold">{phase.budget}</span>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="p-4">
                          <p className="text-gray-600 text-sm mb-4">{phase.description}</p>
                          
                          {/* Metrics */}
                          {phase.metrics && (
                            <div className="grid grid-cols-3 gap-2 mb-4">
                              {phase.metrics.map((metric, mIdx) => (
                                <div key={mIdx} className="text-center p-2 bg-gray-50 rounded-lg">
                                  <div className="font-bold text-emerald-600">{metric.value}</div>
                                  <div className="text-xs text-gray-500">{metric.label}</div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Status Badge */}
                          <div className={`flex items-center gap-2 mb-4 ${isEven ? 'md:justify-end' : ''}`}>
                            {phase.status === 'completed' && (
                              <Badge className="bg-emerald-100 text-emerald-700">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Completed
                              </Badge>
                            )}
                            {phase.status === 'active' && (
                              <Badge className="bg-blue-100 text-blue-700">
                                <Clock className="w-3 h-3 mr-1" /> In Progress
                              </Badge>
                            )}
                            {phase.status === 'upcoming' && (
                              <Badge className="bg-gray-100 text-gray-700">
                                <Circle className="w-3 h-3 mr-1" /> Planned
                              </Badge>
                            )}
                          </div>

                          {/* Expandable Milestones */}
                          <button
                            onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            {isExpanded ? 'Hide' : 'Show'} Milestones ({phase.milestones.length})
                          </button>
                          
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              className="mt-4 space-y-3"
                            >
                              {phase.milestones.map((milestone, mIdx) => (
                                <div key={mIdx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                  <div className={`mt-0.5 ${milestone.completed ? 'text-emerald-500' : 'text-gray-400'}`}>
                                    {milestone.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-sm">{milestone.title}</span>
                                      {milestone.value && (
                                        <Badge variant="outline" className="text-xs">
                                          {milestone.value}
                                        </Badge>
                                      )}
                                    </div>
                                    {milestone.details && (
                                      <p className="text-xs text-gray-500 mt-1">{milestone.details}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* FINANCIALS TAB */}
        {activeTab === 'financials' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Seed Round Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-emerald-500" />
                  Seed Round Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-emerald-50 rounded-xl">
                    <div className="text-xs text-emerald-700 mb-1">Hard Cap</div>
                    <div className="text-2xl font-bold text-emerald-900">$350K-$650K</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="text-xs text-blue-700 mb-1">Token Price</div>
                    <div className="text-2xl font-bold text-blue-900">$0.05</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="text-xs text-purple-700 mb-1">Tokens for Sale</div>
                    <div className="text-2xl font-bold text-purple-900">7-13M UNITY</div>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl">
                    <div className="text-xs text-amber-700 mb-1">Vesting</div>
                    <div className="text-2xl font-bold text-amber-900">6mo / 18mo</div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-3">Expected Returns (5 Years)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-white rounded">
                      <span className="text-gray-600">Conservative</span>
                      <div className="text-right">
                        <span className="font-bold text-emerald-600">5x</span>
                        <span className="text-sm text-gray-500 ml-2">$0.25</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded">
                      <span className="text-gray-600">Base Case</span>
                      <div className="text-right">
                        <span className="font-bold text-blue-600">15x</span>
                        <span className="text-sm text-gray-500 ml-2">$0.75</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded">
                      <span className="text-gray-600">Optimistic</span>
                      <div className="text-right">
                        <span className="font-bold text-purple-600">50x</span>
                        <span className="text-sm text-gray-500 ml-2">$2.50</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Use of Funds */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-500" />
                  Use of Funds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900">${(totalInvested / 1000).toFixed(0)}K</div>
                  <div className="text-gray-500">Total allocation</div>
                </div>
                
                <div className="space-y-4">
                  {investmentBreakdown.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-sm">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${(item.amount / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-gray-500">{item.percent}%</div>
                        </div>
                      </div>
                      <Progress value={item.percent} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">{item.details}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comparables */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Market Comparables</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { company: 'Calm', exit: '$2B', multiple: '20x revenue' },
                    { company: 'Headspace', exit: '$3B', multiple: '15x revenue' },
                    { company: 'Noom', exit: '$3.7B', multiple: '12x revenue' },
                    { company: 'Whoop', exit: '$3.6B', multiple: '18x revenue' },
                  ].map((comp, idx) => (
                    <div key={idx} className="p-4 border rounded-xl text-center">
                      <div className="font-bold text-gray-900">{comp.company}</div>
                      <div className="text-2xl font-bold text-emerald-600">{comp.exit}</div>
                      <div className="text-xs text-gray-500">{comp.multiple}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* CTA Footer */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Ready to join the journey?</h3>
                <p className="text-white/90">Seed round opens March 10, 2026. Be part of the Health OS revolution.</p>
              </div>
              <div className="flex gap-4">
                <Button variant="secondary" size="lg">
                  <Download className="w-4 h-4 mr-2" />
                  Download Whitepaper
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10" size="lg">
                  Contact Us
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
