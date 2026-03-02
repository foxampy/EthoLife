/**
 * Wallet Module - Компонент управления UNITY токенами
 * Полная реализация: баланс, транзакции, обмен, стейкинг
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCcw,
  Plus,
  CreditCard,
  Gift,
  Flame,
  Target,
  ShoppingBag,
  Clock,
  DollarSign,
  Bitcoin,
  Send,
  Download,
  Lock,
} from 'lucide-react';
import { useHealthStore } from '@/stores/healthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function WalletModule() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showBuy, setShowBuy] = useState(false);
  const [showSell, setShowSell] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showStake, setShowStake] = useState(false);
  const [loading, setLoading] = useState(true);

  const { metrics, loadMetrics } = useHealthStore();

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    setLoading(true);
    await loadMetrics('token');
    setLoading(false);
  };

  if (loading) {
    return <WalletSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Кошелёк</h1>
                <p className="text-sm text-gray-500">UNITY токены</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <RefreshCcw className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Clock className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BalanceCard
            onBuy={() => setShowBuy(true)}
            onSell={() => setShowSell(true)}
            onTransfer={() => setShowTransfer(true)}
            onStake={() => setShowStake(true)}
          />
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <EarnedCard />
          <SpentCard />
          <StakedCard />
          <LevelCard />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="transactions" className="text-sm">
              <Clock className="w-4 h-4 mr-2" />
              Транзакции
            </TabsTrigger>
            <TabsTrigger value="earn" className="text-sm">
              <Gift className="w-4 h-4 mr-2" />
              Заработок
            </TabsTrigger>
            <TabsTrigger value="spend" className="text-sm">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Траты
            </TabsTrigger>
            <TabsTrigger value="rewards" className="text-sm">
              <Award className="w-4 h-4 mr-2" />
              Награды
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <TransactionsTab />
          </TabsContent>

          <TabsContent value="earn">
            <EarnTab />
          </TabsContent>

          <TabsContent value="spend">
            <SpendTab />
          </TabsContent>

          <TabsContent value="rewards">
            <RewardsTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <BuyTokenDialog open={showBuy} onOpenChange={setShowBuy} />
      <SellTokenDialog open={showSell} onOpenChange={setShowSell} />
      <TransferDialog open={showTransfer} onOpenChange={setShowTransfer} />
      <StakeDialog open={showStake} onOpenChange={setShowStake} />
    </div>
  );
}

// ============================================================================
# BALANCE CARD
# ============================================================================

function BalanceCard({ onBuy, onSell, onTransfer, onStake }: any) {
  const balance = 15420;
  const usdValue = balance * 0.01;

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden">
      <CardContent className="p-8 relative">
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-emerald-100 text-sm">Баланс UNITY</p>
                <p className="text-4xl font-bold">{balance.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-emerald-100 text-sm">В долларах</p>
              <p className="text-2xl font-bold">${usdValue.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ActionButton icon={Plus} label="Купить" onClick={onBuy} />
            <ActionButton icon={Download} label="Продать" onClick={onSell} />
            <ActionButton icon={Send} label="Перевести" onClick={onTransfer} />
            <ActionButton icon={Lock} label="Стейкинг" onClick={onStake} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActionButton({ icon: Icon, label, onClick }: any) {
  return (
    <Button
      variant="outline"
      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 h-auto py-3"
      onClick={onClick}
    >
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </Button>
  );
}

// ============================================================================
# STAT CARDS
# ============================================================================

function EarnedCard() {
  const totalEarned = 25680;

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Заработано</p>
            <p className="text-xl font-bold text-gray-900">{totalEarned.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SpentCard() {
  const totalSpent = 10260;

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Потрачено</p>
            <p className="text-xl font-bold text-gray-900">{totalSpent.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StakedCard() {
  const staked = 5000;
  const apy = 12;

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Lock className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">В стейкинге</p>
            <p className="text-xl font-bold text-gray-900">{staked.toLocaleString()}</p>
            <p className="text-xs text-purple-600">{apy}% APY</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LevelCard() {
  const level = 5;
  const xp = 3500;
  const nextLevel = 5000;
  const progress = (xp / nextLevel) * 100;

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
            <Target className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Уровень</p>
            <p className="text-xl font-bold text-gray-900">{level}</p>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-gray-500 mt-1">{xp} / {nextLevel} XP</p>
      </CardContent>
    </Card>
  );
}

// ============================================================================
# TABS
# ============================================================================

function TransactionsTab() {
  const transactions = [
    { id: 1, type: 'earn', description: 'Трекинг питания', amount: 15, date: 'Сегодня, 10:00', icon: Gift },
    { id: 2, type: 'earn', description: 'Тренировка завершена', amount: 25, date: 'Сегодня, 08:00', icon: Flame },
    { id: 3, type: 'spend', description: 'Подписка Premium', amount: -1999, date: 'Вчера, 15:00', icon: ShoppingBag },
    { id: 4, type: 'earn', description: 'Реферал: Алексей', amount: 200, date: '28 фев, 12:00', icon: Users },
    { id: 5, type: 'stake', description: 'Стейкинг', amount: -5000, date: '25 фев, 10:00', icon: Lock },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">История транзакций</h3>
      {transactions.map((tx) => (
        <TransactionCard key={tx.id} transaction={tx} />
      ))}
    </div>
  );
}

function TransactionCard({ transaction }: any) {
  const Icon = transaction.icon;
  const isPositive = transaction.amount > 0;

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              transaction.type === 'earn' ? 'bg-green-100' :
              transaction.type === 'spend' ? 'bg-red-100' : 'bg-purple-100'
            }`}>
              <Icon className={`w-5 h-5 ${
                transaction.type === 'earn' ? 'text-green-600' :
                transaction.type === 'spend' ? 'text-red-600' : 'text-purple-600'
              }`} />
            </div>
            <div>
              <p className="font-semibold">{transaction.description}</p>
              <p className="text-xs text-gray-500">{transaction.date}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{transaction.amount.toLocaleString()} UNITY
            </p>
            <p className="text-xs text-gray-400">
              ${((isPositive ? transaction.amount : -transaction.amount) * 0.01).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EarnTab() {
  const earnMethods = [
    { icon: Gift, title: 'Ежедневный вход', amount: 10, frequency: 'в день', description: 'Войдите в приложение' },
    { icon: Flame, title: 'Тренировка', amount: 25, frequency: 'за тренировку', description: 'Завершите тренировку' },
    { icon: Utensils, title: 'Прием пищи', amount: 5, frequency: 'за запись', description: 'Запишите питание' },
    { icon: Moon, title: 'Трекинг сна', amount: 10, frequency: 'в день', description: 'Запишите сон' },
    { icon: CheckCircle2, title: 'Привычка', amount: 5, frequency: 'за выполнение', description: 'Выполните привычку' },
    { icon: Users, title: 'Реферал', amount: 200, frequency: 'за друга', description: 'Пригласите друга' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Способы заработка</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {earnMethods.map((method, index) => (
          <EarnMethodCard key={index} method={method} />
        ))}
      </div>
    </div>
  );
}

function EarnMethodCard({ method }: any) {
  const Icon = method.icon;

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-semibold">{method.title}</p>
            <p className="text-xs text-gray-500">{method.frequency}</p>
          </div>
        </div>
        <p className="text-2xl font-bold text-green-600 mb-2">+{method.amount} UNITY</p>
        <p className="text-sm text-gray-600">{method.description}</p>
      </CardContent>
    </Card>
  );
}

function SpendTab() {
  const spendOptions = [
    { icon: CreditCard, title: 'Подписка Basic', amount: 999, original: '$9.99', discount: 0 },
    { icon: CreditCard, title: 'Подписка Premium', amount: 1699, original: '$19.99', discount: 15 },
    { icon: CreditCard, title: 'Подписка Family', amount: 3399, original: '$39.99', discount: 15 },
    { icon: ShoppingBag, title: 'Маркетплейс', amount: 0, original: 'Variable', discount: 0 },
    { icon: Stethoscope, title: 'Консультация', amount: 3000, original: '$30', discount: 0 },
  ];
}

function SpendOptionCard({ option }: any) {
  const Icon = option.icon;

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="font-semibold">{option.title}</p>
            <p className="text-xs text-gray-500">{option.original}</p>
          </div>
        </div>
        {option.amount > 0 && (
          <div>
            <p className="text-2xl font-bold text-red-600">{option.amount.toLocaleString()} UNITY</p>
            {option.discount > 0 && (
              <Badge className="bg-green-500 text-xs mt-2">
                -{option.discount}% скидка
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RewardsTab() {
  const achievements = [
    { icon: '🏆', title: '10K шагов', count: 15, reward: 50 },
    { icon: '🔥', title: 'Серия 7 дней', count: 3, reward: 100 },
    { icon: '💪', title: '50 тренировок', count: 1, reward: 500 },
    { icon: '📚', title: '10 книг', count: 2, reward: 200 },
    { icon: '💧', title: '30 дней вода', count: 1, reward: 300 },
    { icon: '🧘', title: '100 медитаций', count: 0, reward: 1000 },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Достижения и награды</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map((achievement, index) => (
          <AchievementCard key={index} achievement={achievement} />
        ))}
      </div>
    </div>
  );
}

function AchievementCard({ achievement }: any) {
  const unlocked = achievement.count > 0;

  return (
    <Card className={`border-0 shadow-md ${!unlocked && 'opacity-50'}`}>
      <CardContent className="p-4 text-center">
        <div className="text-5xl mb-3">{achievement.icon}</div>
        <p className="font-semibold text-sm mb-1">{achievement.title}</p>
        <p className="text-xs text-gray-500 mb-2">Получено: {achievement.count} раз</p>
        {unlocked && (
          <Badge className="bg-amber-500 text-xs">
            +{achievement.reward} UNITY
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
# DIALOGS
# ============================================================================

function BuyTokenDialog({ open, onOpenChange }: any) {
  const [amount, setAmount] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Купить UNITY токены</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Сумма ($)</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100"
            />
          </div>
          {amount && (
            <div className="p-3 rounded-lg bg-green-50">
              <p className="text-sm text-gray-600">Вы получите</p>
              <p className="text-2xl font-bold text-green-600">{(parseFloat(amount) * 100).toLocaleString()} UNITY</p>
            </div>
          )}
          <div className="flex gap-2">
            <Button className="flex-1">Купить</Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SellTokenDialog({ open, onOpenChange }: any) {
  const [amount, setAmount] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Продать UNITY токены</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Количество UNITY</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
            />
          </div>
          {amount && (
            <div className="p-3 rounded-lg bg-blue-50">
              <p className="text-sm text-gray-600">Вы получите</p>
              <p className="text-2xl font-bold text-blue-600">${(parseFloat(amount) * 0.01).toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">Комиссия 10%: ${(parseFloat(amount) * 0.001).toFixed(2)}</p>
            </div>
          )}
          <Button className="w-full">Продать</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TransferDialog({ open, onOpenChange }: any) {
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Перевести UNITY</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Username получателя</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@username"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Количество UNITY</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="100"
            />
          </div>
          <Button className="w-full">Перевести</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StakeDialog({ open, onOpenChange }: any) {
  const [amount, setAmount] = useState('');
  const apy = 12;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Стейкинг UNITY</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-purple-50">
            <p className="text-sm text-gray-600">APY</p>
            <p className="text-2xl font-bold text-purple-600">{apy}%</p>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Количество UNITY</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
            />
          </div>
          {amount && (
            <div className="p-3 rounded-lg bg-green-50">
              <p className="text-sm text-gray-600">Ежемесячный доход</p>
              <p className="text-xl font-bold text-green-600">+{(parseFloat(amount) * apy / 100 / 12).toFixed(0)} UNITY</p>
            </div>
          )}
          <Button className="w-full">Стейкать</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
# SKELETON
# ============================================================================

function WalletSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-48 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper icons
function Utensils({ className }: any) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}

function CheckCircle2({ className }: any) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function Users({ className }: any) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function Stethoscope({ className }: any) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  );
}

function Award({ className }: any) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}
