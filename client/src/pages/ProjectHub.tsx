import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  TrendingUp, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  Circle,
  ArrowRight,
  Zap,
  Users,
  Target,
  Layers,
  ChevronLeft,
  Lock,
  Unlock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLocation } from 'wouter';

interface Project {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  status: 'open' | 'coming_soon' | 'closed';
  raised: number;
  goal: number;
  readiness: number;
  apy: number;
  icon: string;
  category: string;
  team: string[];
  milestones: { title: string; completed: boolean; date: string }[];
  stakingTiers: { amount: number; apy: number; bonus: string }[];
}

const projects: Project[] = [
  {
    id: 'posture-ai',
    name: 'PostureAI Pro',
    description: 'Device and program for real-time posture tracking',
    fullDescription: 'Revolutionary posture correction system using computer vision and AI. Tracks spine position in real-time, provides instant feedback, and creates personalized exercise programs. Compatible with any webcam or smartphone camera.',
    status: 'open',
    raised: 45000,
    goal: 60000,
    readiness: 78,
    apy: 12,
    icon: '🧘',
    category: 'Hardware + AI',
    team: ['Dr. Sarah Chen', 'Alex Kumar', 'Maria Rodriguez'],
    milestones: [
      { title: 'Prototype Development', completed: true, date: 'Jan 2026' },
      { title: 'AI Model Training', completed: true, date: 'Feb 2026' },
      { title: 'Beta Testing', completed: false, date: 'Apr 2026' },
      { title: 'Production Launch', completed: false, date: 'Jun 2026' },
    ],
    stakingTiers: [
      { amount: 500, apy: 12, bonus: 'Early access badge' },
      { amount: 2000, apy: 15, bonus: 'Lifetime Pro features' },
      { amount: 5000, apy: 18, bonus: 'Revenue share 2%' },
    ],
  },
  {
    id: 'sleep-sync',
    name: 'SleepSync',
    description: 'Smart alarm with sleep phases and biological cycles',
    fullDescription: 'Advanced sleep tracking ecosystem combining wearable sensors with AI-powered analysis. Features smart wake-up during light sleep phases, circadian rhythm optimization, and personalized sleep hygiene recommendations.',
    status: 'open',
    raised: 32000,
    goal: 50000,
    readiness: 65,
    apy: 15,
    icon: '😴',
    category: 'Wearables',
    team: ['Dr. James Wilson', 'Lisa Park', 'Tom Anderson'],
    milestones: [
      { title: 'Sensor Integration', completed: true, date: 'Dec 2025' },
      { title: 'Algorithm Development', completed: true, date: 'Jan 2026' },
      { title: 'App Development', completed: false, date: 'Mar 2026' },
      { title: 'Clinical Trials', completed: false, date: 'May 2026' },
    ],
    stakingTiers: [
      { amount: 500, apy: 15, bonus: 'Free device' },
      { amount: 2000, apy: 18, bonus: 'Family pack (4 devices)' },
      { amount: 5000, apy: 22, bonus: 'Revenue share 3%' },
    ],
  },
  {
    id: 'llm-healthcore',
    name: 'LLM HealthCore',
    description: 'Programs and methodologies for LLM training',
    fullDescription: 'Proprietary health-focused LLM training using expert-curated datasets. Creates specialized AI models for accurate health recommendations, symptom analysis, and personalized wellness coaching.',
    status: 'coming_soon',
    raised: 12000,
    goal: 80000,
    readiness: 45,
    apy: 18,
    icon: '🧠',
    category: 'AI / ML',
    team: ['Prof. Michael Chang', 'Dr. Elena Volkov', 'Ryan Martinez'],
    milestones: [
      { title: 'Dataset Collection', completed: true, date: 'Nov 2025' },
      { title: 'Data Annotation', completed: false, date: 'Mar 2026' },
      { title: 'Model Training', completed: false, date: 'Jun 2026' },
      { title: 'Validation', completed: false, date: 'Aug 2026' },
    ],
    stakingTiers: [
      { amount: 1000, apy: 18, bonus: 'API access' },
      { amount: 5000, apy: 22, bonus: 'Priority access + credits' },
      { amount: 10000, apy: 25, bonus: 'Revenue share 5%' },
    ],
  },
  {
    id: 'microbiome-lab',
    name: 'Microbiome Lab',
    description: 'At-home microbiome testing kit',
    fullDescription: 'Affordable at-home microbiome testing with AI-powered analysis. Includes sampling kit, lab processing, and personalized dietary recommendations based on gut bacteria profile.',
    status: 'coming_soon',
    raised: 8000,
    goal: 100000,
    readiness: 30,
    apy: 20,
    icon: '🔬',
    category: 'Diagnostics',
    team: ['Dr. Anna Kowalski', 'Mark Johnson'],
    milestones: [
      { title: 'Protocol Design', completed: true, date: 'Jan 2026' },
      { title: 'Lab Partnership', completed: false, date: 'Apr 2026' },
      { title: 'Kit Production', completed: false, date: 'Jul 2026' },
      { title: 'Launch', completed: false, date: 'Oct 2026' },
    ],
    stakingTiers: [
      { amount: 1000, apy: 20, bonus: 'Free test kit' },
      { amount: 5000, apy: 24, bonus: 'Annual subscription' },
      { amount: 15000, apy: 28, bonus: 'Revenue share 4%' },
    ],
  },
];

export default function ProjectHub() {
  const [, setLocation] = useLocation();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [stakingAmount, setStakingAmount] = useState<number>(1000);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const calculateReturn = (project: Project, amount: number) => {
    const tier = project.stakingTiers.find(t => amount >= t.amount) || project.stakingTiers[0];
    const apy = tier ? tier.apy : project.apy;
    return (amount * apy) / 100;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <button
            onClick={() => setLocation('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Globe className="w-6 h-6" />
              </div>
              <Badge className="bg-white/20 text-white">Innovation Platform</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Project HUB</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Ecosystem within ecosystem. Support specific development directions, earn income from their success.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold">${(projects.reduce((acc, p) => acc + p.raised, 0) / 1000).toFixed(1)}K</div>
                <div className="text-sm text-white/80">Total Raised</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold">{projects.length}</div>
                <div className="text-sm text-white/80">Active Projects</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold">12-28%</div>
                <div className="text-sm text-white/80">APY Range</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-3xl font-bold">2</div>
                <div className="text-sm text-white/80">Open for Staking</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* How It Works */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">How Staking Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Choose Project', desc: 'Select a direction you believe in', icon: Target },
              { step: 2, title: 'Stake UNITY', desc: 'Lock tokens in project pool', icon: Lock },
              { step: 3, title: 'Earn Rewards', desc: 'APY based on project success', icon: TrendingUp },
              { step: 4, title: 'Governance', desc: 'Participate in project decisions', icon: Users },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-sm font-bold text-emerald-600 mb-1">Step {item.step}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Projects Grid */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Active Projects</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <Card className={`h-full overflow-hidden hover:shadow-xl transition-shadow ${
                  project.status === 'open' ? 'border-emerald-200' : 'border-gray-200'
                }`}>
                  <CardHeader className={`pb-4 ${
                    project.status === 'open' 
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50' 
                      : 'bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{project.icon}</span>
                        <div>
                          <CardTitle className="text-xl">{project.name}</CardTitle>
                          <p className="text-sm text-gray-500">{project.category}</p>
                        </div>
                      </div>
                      <Badge className={
                        project.status === 'open' 
                          ? 'bg-emerald-500 text-white' 
                          : project.status === 'coming_soon'
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-500 text-white'
                      }>
                        {project.status === 'open' && <Unlock className="w-3 h-3 mr-1" />}
                        {project.status === 'open' && 'Staking Open'}
                        {project.status === 'coming_soon' && 'Coming Soon'}
                        {project.status === 'closed' && 'Closed'}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                    
                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Raised</span>
                        <span className="font-bold">${project.raised.toLocaleString()} / ${project.goal.toLocaleString()}</span>
                      </div>
                      <Progress value={(project.raised / project.goal) * 100} className="h-2" />
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">{project.readiness}%</div>
                        <div className="text-xs text-gray-500">Ready</div>
                      </div>
                      <div className="text-center p-2 bg-emerald-50 rounded-lg">
                        <div className="text-lg font-bold text-emerald-600">{project.apy}%</div>
                        <div className="text-xs text-gray-500">Base APY</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{project.team.length}</div>
                        <div className="text-xs text-gray-500">Team</div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      variant={project.status === 'open' ? 'default' : 'outline'}
                      disabled={project.status !== 'open'}
                    >
                      {project.status === 'open' ? 'View Details & Stake' : 'View Details'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Disclaimer */}
        <div className="mt-12 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-800">
            <strong>Disclaimer:</strong> Staking involves risks. APY is not guaranteed and depends on project success. 
            Please do your own research before investing. Tokens are locked for the duration of the project cycle.
          </p>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{selectedProject.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                    <p className="text-gray-500">{selectedProject.category}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="font-bold text-gray-900 mb-2">About</h3>
                <p className="text-gray-600">{selectedProject.fullDescription}</p>
              </div>
              
              {/* Progress */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Funding Progress</span>
                  <span className="font-bold">${selectedProject.raised.toLocaleString()} / ${selectedProject.goal.toLocaleString()}</span>
                </div>
                <Progress value={(selectedProject.raised / selectedProject.goal) * 100} className="h-3" />
                <p className="text-sm text-gray-500 mt-1">
                  {Math.round((selectedProject.raised / selectedProject.goal) * 100)}% funded
                </p>
              </div>
              
              {/* Milestones */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Milestones</h3>
                <div className="space-y-2">
                  {selectedProject.milestones.map((milestone, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {milestone.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300" />
                      )}
                      <div className="flex-1">
                        <p className={`font-medium ${milestone.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {milestone.title}
                        </p>
                        <p className="text-xs text-gray-400">{milestone.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Staking Tiers */}
              {selectedProject.status === 'open' && (
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">Staking Tiers</h3>
                  <div className="grid gap-3">
                    {selectedProject.stakingTiers.map((tier, idx) => (
                      <div 
                        key={idx} 
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          stakingAmount >= tier.amount 
                            ? 'border-emerald-500 bg-emerald-50' 
                            : 'border-gray-200 hover:border-emerald-200'
                        }`}
                        onClick={() => setStakingAmount(tier.amount)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-900">{tier.amount.toLocaleString()} UNITY</p>
                            <p className="text-sm text-gray-500">{tier.bonus}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-emerald-600">{tier.apy}%</p>
                            <p className="text-xs text-gray-500">APY</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Calculator */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">Estimated Annual Return</span>
                      <span className="text-2xl font-bold text-emerald-600">
                        {calculateReturn(selectedProject, stakingAmount).toLocaleString()} UNITY
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Based on {stakingAmount.toLocaleString()} UNITY staked at {' '}
                      {selectedProject.stakingTiers.find(t => stakingAmount >= t.amount)?.apy || selectedProject.apy}% APY
                    </p>
                  </div>
                  
                  <Button className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-6">
                    <Zap className="w-5 h-5 mr-2" />
                    Stake {stakingAmount.toLocaleString()} UNITY
                  </Button>
                </div>
              )}
              
              {selectedProject.status === 'coming_soon' && (
                <div className="p-4 bg-amber-50 rounded-xl text-center">
                  <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="font-medium text-amber-900">Staking opens soon</p>
                  <p className="text-sm text-amber-700">Join the waitlist to be notified</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
