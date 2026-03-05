import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Search, BookOpen, FileSpreadsheet, Presentation, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Document {
  id: string;
  title: string;
  description: string;
  type: 'whitepaper' | 'legal' | 'financial' | 'technical' | 'research';
  date: string;
  size: string;
  content: string;
  downloadUrl?: string;
}

const publicDocuments: Document[] = [
  {
    id: 'whitepaper-v3',
    title: 'EthosLife Whitepaper v3.0',
    description: 'Complete platform overview, tokenomics, and vision for Human Operating System',
    type: 'whitepaper',
    date: 'March 2026',
    size: '2.4 MB',
    content: `# EthosLife Whitepaper v3.0

## Executive Summary

EthosLife is creating a fundamentally new category — Human Operating System (HOS). While competitors fight for share in the existing HealthTech market ($650B), we are creating a new market.

## The Problem We Solve

Modern people use an average of 7 different apps to manage health. Result: Data fragmentation, switching fatigue, loss of holistic health picture.

## Our Solution

**7 modules. 1 platform. 0 switching.**

All your health — from genetics to social connections — in one interface, connected by artificial intelligence.

## Tokenomics

- Total Supply: 1,000,000,000 UNITY (5 years)
- Initial Price: $0.05 (Seed)
- Utility: Gamification, Premium access, Governance, Payments

## Roadmap

1. **Pre-Seed (Closed)** - $140K, 82% MVP ready
2. **Seed (Current)** - $350K-$650K, opens March 10, 2026
3. **Series A** - $1.5M-$2.5M, Q4 2026-2027
4. **Series B+** - $10M+, 2028+

## Investment Opportunity

Expected Returns (5 years):
- Conservative: 5x ($0.25)
- Base Case: 15x ($0.75)
- Optimistic: 50x ($2.50)`
  },
  {
    id: 'litepaper',
    title: 'EthosLife Litepaper',
    description: 'Condensed version of the whitepaper for quick reading',
    type: 'whitepaper',
    date: 'March 2026',
    size: '856 KB',
    content: `# EthosLife Litepaper

## Mission
Transform health from an episodic concern into a daily habit.

## Key Metrics
- $140K self-funded
- 245 components built
- 84 pages
- 7 health modules (85% ready)
- 82% MVP complete

## Unique Value Proposition
The only platform integrating 7 health directions with AI coordination and token incentives.

## UNITY Token
- Earn for healthy habits
- Spend on subscriptions and services
- Govern the ecosystem
- 15% payment discount

## Next Steps
Seed round opens March 10, 2026. Token price: $0.05`
  },
  {
    id: 'tokenomics-deep-dive',
    title: 'Tokenomics Deep Dive',
    description: 'Detailed analysis of UNITY token economics and incentive structures',
    type: 'financial',
    date: 'February 2026',
    size: '1.2 MB',
    content: `# UNITY Tokenomics Deep Dive

## Token Distribution
- Seed Investors: 14-26% (7-13M UNITY)
- Team: 20% (10M UNITY, 24mo vesting)
- Ecosystem: 30% (15M UNITY, 48mo linear)
- Reserve: 15% (7.5M UNITY)
- Liquidity: 10% (5M UNITY)
- Advisors: 5% (2.5M UNITY)

## Earning Mechanisms
Daily Activities:
- Login: 10 UNITY
- All modules: 50 UNITY
- Workout: 25 UNITY
- 10K steps: 20 UNITY

Streak Bonuses:
- 7 days: 50 UNITY
- 30 days: 300 UNITY
- 90 days: 1,000 UNITY
- 365 days: 5,000 UNITY

## Deflationary Mechanisms
- 5% of revenue buyback & burn
- 50% of specialist fees burned
- Quarterly burns based on growth`
  },
  {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect your health data',
    type: 'legal',
    date: 'January 2026',
    size: '245 KB',
    content: `# Privacy Policy

## Data Protection

EthosLife is committed to protecting your health data with enterprise-grade security.

## What We Collect
- Health metrics you choose to track
- AI conversation history
- Subscription and payment information
- Device and usage analytics

## How We Use Data
- Personalize your health recommendations
- Improve AI accuracy
- Process payments
- Comply with legal obligations

## Your Rights
- Access your data anytime
- Export or delete your data
- Control sharing preferences
- Opt out of non-essential tracking

## Security
- End-to-end encryption
- HIPAA and GDPR compliance
- Regular security audits
- Multi-factor authentication`
  },
  {
    id: 'terms-of-service',
    title: 'Terms of Service',
    description: 'Legal terms governing the use of EthosLife platform',
    type: 'legal',
    date: 'January 2026',
    size: '312 KB',
    content: `# Terms of Service

## 1. Acceptance of Terms
By accessing or using EthosLife, you agree to be bound by these Terms.

## 2. Health Disclaimer
EthosLife provides general wellness information, not medical advice. Always consult healthcare professionals for medical decisions.

## 3. User Accounts
- You must be 18+ to create an account
- Maintain accurate profile information
- Keep your credentials secure
- One account per person

## 4. Subscriptions
- Free tier available with limited features
- Premium subscriptions auto-renew
- 7-day free trial for new users
- Cancel anytime

## 5. Token Economics
- UNITY tokens have no guaranteed value
- Earning rates may change
- Staking involves risks
- Comply with local regulations`
  },
  {
    id: 'technical-architecture',
    title: 'Technical Architecture Overview',
    description: 'System design, APIs, and integration capabilities',
    type: 'technical',
    date: 'February 2026',
    size: '1.8 MB',
    content: `# Technical Architecture

## System Overview
- Frontend: React 19 + TypeScript
- Backend: Node.js + Express
- Database: PostgreSQL (47 tables)
- AI: Multi-model (Groq, Gemini, Qwen)

## Health Modules
1. Medicine - FHIR/HL7 integration
2. Nutrition - Macro/micro tracking
3. Movement - Activity & workout logging
4. Sleep - Phase tracking & analysis
5. Psychology - Mood & stress management
6. Relationships - Social health tracking
7. Habits - Streak & goal tracking

## Security
- AES-256 encryption at rest
- TLS 1.3 in transit
- OAuth 2.0 + JWT auth
- Regular penetration testing`
  },
  {
    id: 'clinical-validation',
    title: 'Clinical Validation Report',
    description: 'Scientific basis and validation studies for health methodologies',
    type: 'research',
    date: 'December 2025',
    size: '3.1 MB',
    content: `# Clinical Validation Report

## Methodology
Our health recommendations are based on peer-reviewed research and clinical guidelines.

## Key Studies Referenced
1. WHO guidelines on physical activity (2020)
2. American Heart Association nutrition guidelines
3. Sleep Foundation recommendations
4. APA stress management protocols

## AI Accuracy
- Symptom analysis: 87% accuracy
- Nutrition recommendations: 92% match with dietitian advice
- Workout planning: 89% user satisfaction

## Limitations
- Not a substitute for medical care
- Individual results may vary
- Consult professionals for conditions`
  },
  {
    id: 'partnership-proposal',
    title: 'Partnership Proposal',
    description: 'Guidelines for clinics, gyms, and wellness centers partnership',
    type: 'legal',
    date: 'February 2026',
    size: '567 KB',
    content: `# Partnership Proposal

## Partnership Types

### Health Centers
- Digital infrastructure
- Patient management tools
- Revenue sharing model

### Specialists
- Digital office: $30/month
- 10% referral commission
- Access to patient health data (with consent)

### Businesses
- Accept 50% UNITY, 50% fiat
- AI-driven customer referrals
- Reduced CAC by 60%

## Benefits
- Access to 100K+ health-conscious users
- Predictive demand analytics
- Tokenized loyalty programs
- Marketing support`
  },
];

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  const filteredDocuments = publicDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeTab === 'all' || doc.type === activeTab;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'whitepaper': return BookOpen;
      case 'legal': return Shield;
      case 'financial': return FileSpreadsheet;
      case 'technical': return FileText;
      case 'research': return Presentation;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'whitepaper': return 'bg-blue-100 text-blue-700';
      case 'legal': return 'bg-red-100 text-red-700';
      case 'financial': return 'bg-emerald-100 text-emerald-700';
      case 'technical': return 'bg-purple-100 text-purple-700';
      case 'research': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-4">Documents</h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Access all EthosLife documentation, whitepapers, legal information, and research materials.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap h-auto gap-2">
              <TabsTrigger value="all" className="px-4 py-2">All</TabsTrigger>
              <TabsTrigger value="whitepaper" className="px-4 py-2">Whitepapers</TabsTrigger>
              <TabsTrigger value="legal" className="px-4 py-2">Legal</TabsTrigger>
              <TabsTrigger value="financial" className="px-4 py-2">Financial</TabsTrigger>
              <TabsTrigger value="technical" className="px-4 py-2">Technical</TabsTrigger>
              <TabsTrigger value="research" className="px-4 py-2">Research</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc, idx) => {
            const Icon = getTypeIcon(doc.type);
            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
              >
                <Card 
                  className="h-full cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedDocument(doc)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getTypeColor(doc.type)}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant="outline" className={getTypeColor(doc.type)}>
                        {doc.type}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {doc.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {doc.date}
                      </div>
                      <span>{doc.size}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No documents found matching your search.</p>
          </div>
        )}

        {/* Document Viewer Dialog */}
        <Dialog open={selectedDocument !== null} onOpenChange={(open) => !open && setSelectedDocument(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <div className="flex items-center gap-3">
                {selectedDocument && (
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(selectedDocument.type)}`}>
                    {(() => {
                      const Icon = getTypeIcon(selectedDocument.type);
                      return <Icon className="w-5 h-5" />;
                    })()}
                  </div>
                )}
                <div>
                  <DialogTitle>{selectedDocument?.title}</DialogTitle>
                  <DialogDescription>
                    {selectedDocument && (
                      <div className="flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {selectedDocument.date}
                        </span>
                        <span>{selectedDocument?.size}</span>
                        <Badge variant="outline" className={selectedDocument ? getTypeColor(selectedDocument.type) : ''}>
                          {selectedDocument?.type}
                        </Badge>
                      </div>
                    )}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="prose dark:prose-invert max-w-none">
                {selectedDocument && (
                  <pre className="whitespace-pre-wrap text-sm text-foreground/80 font-sans bg-muted p-4 rounded-lg">
                    {selectedDocument.content}
                  </pre>
                )}
              </div>
            </ScrollArea>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setSelectedDocument(null)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  if (selectedDocument) {
                    const blob = new Blob([selectedDocument.content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedDocument.title.replace(/\s+/g, '_')}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
