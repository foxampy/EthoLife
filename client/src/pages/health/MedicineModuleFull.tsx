/**
 * Medicine Module - Компонент модуля медицины
 * Полная реализация: анализы, лекарства, приемы, показатели
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Pill,
  FileText,
  Stethoscope,
  Plus,
  TrendingUp,
  Calendar,
  Settings,
  BarChart3,
  Activity,
  Thermometer,
  Droplet,
  Eye,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useHealthStore } from '@/stores/healthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export default function MedicineModule() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMedication, setShowMedication] = useState(false);
  const [showLabResult, setShowLabResult] = useState(false);
  const [showAppointment, setShowAppointment] = useState(false);
  const [loading, setLoading] = useState(true);

  const { metrics, loadMetrics } = useHealthStore();

  useEffect(() => {
    loadMedicineData();
  }, []);

  const loadMedicineData = async () => {
    setLoading(true);
    await loadMetrics('medicine');
    setLoading(false);
  };

  if (loading) {
    return <MedicineSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Медицина</h1>
                <p className="text-sm text-gray-500">Анализы, лекарства, приемы</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <BarChart3 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <HealthScoreCard />
          <MedicationsCard />
          <AppointmentsCard />
          <QuickActionsCard
            onMedication={() => setShowMedication(true)}
            onLabResult={() => setShowLabResult(true)}
            onAppointment={() => setShowAppointment(true)}
          />
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-12">
            <TabsTrigger value="overview" className="text-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="medications" className="text-sm">
              <Pill className="w-4 h-4 mr-2" />
              Лекарства
            </TabsTrigger>
            <TabsTrigger value="labs" className="text-sm">
              <FileText className="w-4 h-4 mr-2" />
              Анализы
            </TabsTrigger>
            <TabsTrigger value="appointments" className="text-sm">
              <Stethoscope className="w-4 h-4 mr-2" />
              Приемы
            </TabsTrigger>
            <TabsTrigger value="vitals" className="text-sm">
              <Activity className="w-4 h-4 mr-2" />
              Показатели
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="medications">
            <MedicationsTab onAdd={() => setShowMedication(true)} />
          </TabsContent>

          <TabsContent value="labs">
            <LabsTab onAdd={() => setShowLabResult(true)} />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentsTab onAdd={() => setShowAppointment(true)} />
          </TabsContent>

          <TabsContent value="vitals">
            <VitalsTab />
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialogs */}
      <MedicationDialog open={showMedication} onOpenChange={setShowMedication} />
      <LabResultDialog open={showLabResult} onOpenChange={setShowLabResult} />
      <AppointmentDialog open={showAppointment} onOpenChange={setShowAppointment} />
    </div>
  );
}

// ============================================================================
# STAT CARDS
# ============================================================================

function HealthScoreCard() {
  const score = 85;
  const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <span className="font-semibold text-gray-900">Здоровье</span>
          </div>
          <Badge className="bg-red-500 text-white">{grade}</Badge>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">{score}</div>
        <p className="text-xs text-gray-500">Общий индекс здоровья</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
          <TrendingUp className="w-3 h-3" />
          <span>+5% к прошлому месяцу</span>
        </div>
      </CardContent>
    </Card>
  );
}

function MedicationsCard() {
  const activeMeds = 3;
  const totalMeds = 5;
  const todayTaken = 2;

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Pill className="w-5 h-5 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-900">Лекарства</span>
          </div>
          <Badge variant="outline">{todayTaken}/{activeMeds}</Badge>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">{activeMeds}</div>
        <p className="text-xs text-gray-500">Активных препаратов</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
          <CheckCircle2 className="w-3 h-3" />
          <span>{todayTaken} принято сегодня</span>
        </div>
      </CardContent>
    </Card>
  );
}

function AppointmentsCard() {
  const upcoming = 2;
  const lastVisit = '15 фев';

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-green-600" />
            </div>
            <span className="font-semibold text-gray-900">Приемы</span>
          </div>
          <Badge className="bg-green-500 text-white">{upcoming}</Badge>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">{upcoming}</div>
        <p className="text-xs text-gray-500">Предстоящих визитов</p>
        <div className="mt-2 text-xs text-gray-400">
          Последний: {lastVisit}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionsCard({ onMedication, onLabResult, onAppointment }: any) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Plus className="w-5 h-5 text-purple-600" />
          </div>
          <span className="font-semibold text-gray-900">Действия</span>
        </div>
        <div className="space-y-2">
          <Button size="sm" variant="outline" className="w-full justify-start gap-2" onClick={onMedication}>
            <Pill className="w-4 h-4" />
            Лекарство
          </Button>
          <Button size="sm" variant="outline" className="w-full justify-start gap-2" onClick={onLabResult}>
            <Upload className="w-4 h-4" />
            Анализы
          </Button>
          <Button size="sm" variant="outline" className="w-full justify-start gap-2" onClick={onAppointment}>
            <Calendar className="w-4 h-4" />
            Записаться
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
# TABS
# ============================================================================

function OverviewTab() {
  const healthMetrics = {
    bp: '120/80',
    heartRate: 72,
    temperature: 36.6,
    glucose: 5.2,
    cholesterol: 4.8,
    vitaminD: 45,
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Показатели здоровья</CardTitle>
          <CardDescription>Текущие значения</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <VitalStat icon={Activity} label="Давление" value={healthMetrics.bp} unit="мм рт.ст." normal />
            <VitalStat icon={Heart} label="Пульс" value={healthMetrics.heartRate} unit="уд/мин" normal />
            <VitalStat icon={Thermometer} label="Температура" value={healthMetrics.temperature} unit="°C" normal />
            <VitalStat icon={Droplet} label="Глюкоза" value={healthMetrics.glucose} unit="ммоль/л" normal />
            <VitalStat icon={Activity} label="Холестерин" value={healthMetrics.cholesterol} unit="ммоль/л" normal />
            <VitalStat icon={Eye} label="Витамин D" value={healthMetrics.vitaminD} unit="нг/мл" warning />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Ближайшие приемы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <AppointmentItem doctor="Терапевт" date="Завтра, 10:00" reason="Плановый осмотр" />
            <AppointmentItem doctor="Кардиолог" date="15 мар, 14:00" reason="Консультация" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Напоминания о лекарствах</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <MedicationReminder name="Витамин D" time="09:00" taken={true} />
            <MedicationReminder name="Омега-3" time="12:00" taken={false} />
            <MedicationReminder name="Магний" time="21:00" taken={false} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function VitalStat({ icon: Icon, label, value, unit, normal, warning }: any) {
  return (
    <div className={`p-3 rounded-lg ${warning ? 'bg-amber-50' : 'bg-gray-50'}`}>
      <Icon className={`w-5 h-5 ${warning ? 'text-amber-500' : 'text-gray-400'} mb-2`} />
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold text-gray-900">{value} <span className="text-xs font-normal">{unit}</span></p>
      {warning ? (
        <div className="flex items-center gap-1 text-xs text-amber-600 mt-1">
          <AlertCircle className="w-3 h-3" />
          <span>Требует внимания</span>
        </div>
      ) : (
        <p className="text-xs text-green-600 mt-1">Норма</p>
      )}
    </div>
  );
}

function AppointmentItem({ doctor, date, reason }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <Stethoscope className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="font-semibold">{doctor}</p>
          <p className="text-xs text-gray-500">{reason}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-sm">{date}</p>
        <Button size="sm" variant="outline">
          Подтвердить
        </Button>
      </div>
    </div>
  );
}

function MedicationReminder({ name, time, taken }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          taken ? 'bg-green-500' : 'bg-gray-200'
        }`}>
          {taken && <CheckCircle2 className="w-5 h-5 text-white" />}
        </div>
        <div>
          <p className={`font-medium ${taken ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {name}
          </p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
      </div>
      {!taken && (
        <Button size="sm" variant="outline">
          Принято
        </Button>
      )}
    </div>
  );
}

function MedicationsTab({ onAdd }: any) {
  const medications = [
    { id: 1, name: 'Витамин D', dosage: '2000 МЕ', frequency: '1 раз в день', time: '09:00', taken: true },
    { id: 2, name: 'Омега-3', dosage: '1000 мг', frequency: '2 раза в день', time: '12:00', taken: false },
    { id: 3, name: 'Магний', dosage: '400 мг', frequency: '1 раз в день', time: '21:00', taken: false },
    { id: 4, name: 'Аспирин', dosage: '75 мг', frequency: '1 раз в день', time: '08:00', taken: true },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Лекарства</h3>
        <Button size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить
        </Button>
      </div>

      {medications.map((med) => (
        <MedicationCard key={med.id} medication={med} />
      ))}
    </div>
  );
}

function MedicationCard({ medication }: any) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              medication.taken ? 'bg-green-100' : 'bg-blue-100'
            }`}>
              <Pill className={`w-5 h-5 ${medication.taken ? 'text-green-600' : 'text-blue-600'}`} />
            </div>
            <div>
              <p className="font-semibold">{medication.name}</p>
              <p className="text-xs text-gray-500">{medication.dosage} • {medication.frequency}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">{medication.time}</p>
            <Badge variant={medication.taken ? 'default' : 'outline'}>
              {medication.taken ? 'Принято' : 'Ожидается'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LabsTab({ onAdd }: any) {
  const labResults = [
    { id: 1, test: 'Общий анализ крови', date: '20 фев', status: 'ready', abnormalities: 0 },
    { id: 2, test: 'Биохимия', date: '20 фев', status: 'ready', abnormalities: 1 },
    { id: 3, test: 'Гормоны щитовидной железы', date: '15 фев', status: 'ready', abnormalities: 0 },
    { id: 4, test: 'Витамин D', date: '10 фев', status: 'warning', abnormalities: 1 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Анализы</h3>
        <Button size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Загрузить
        </Button>
      </div>

      {labResults.map((result) => (
        <LabResultCard key={result.id} result={result} />
      ))}
    </div>
  );
}

function LabResultCard({ result }: any) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              result.status === 'warning' ? 'bg-amber-100' : 'bg-green-100'
            }`}>
              <FileText className={`w-5 h-5 ${result.status === 'warning' ? 'text-amber-600' : 'text-green-600'}`} />
            </div>
            <div>
              <p className="font-semibold">{result.test}</p>
              <p className="text-xs text-gray-500">{result.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {result.abnormalities > 0 && (
              <Badge variant="destructive">
                {result.abnormalities} отклонение(ий)
              </Badge>
            )}
            <Button size="sm" variant="outline">
              Подробнее
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AppointmentsTab({ onAdd }: any) {
  const appointments = [
    { id: 1, doctor: 'Терапевт', date: 'Завтра', time: '10:00', type: 'Плановый', status: 'confirmed' },
    { id: 2, doctor: 'Кардиолог', date: '15 мар', time: '14:00', type: 'Консультация', status: 'pending' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Приемы</h3>
        <Button size="sm" onClick={onAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Записаться
        </Button>
      </div>

      {appointments.map((apt) => (
        <AppointmentCard key={apt.id} appointment={apt} />
      ))}
    </div>
  );
}

function AppointmentCard({ appointment }: any) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold">{appointment.doctor}</p>
              <p className="text-xs text-gray-500">{appointment.type}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">{appointment.date}, {appointment.time}</p>
            <Badge variant={appointment.status === 'confirmed' ? 'default' : 'outline'}>
              {appointment.status === 'confirmed' ? 'Подтверждено' : 'Ожидает'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function VitalsTab() {
  const vitals = [
    { type: 'Давление', value: '120/80', unit: 'мм рт.ст.', date: 'Сегодня, 09:00', trend: 'stable' },
    { type: 'Пульс', value: '72', unit: 'уд/мин', date: 'Сегодня, 09:00', trend: 'down' },
    { type: 'Температура', value: '36.6', unit: '°C', date: 'Сегодня, 09:00', trend: 'stable' },
    { type: 'Глюкоза', value: '5.2', unit: 'ммоль/л', date: 'Вчера, 08:00', trend: 'up' },
    { type: 'Вес', value: '70', unit: 'кг', date: 'Вчера, 08:00', trend: 'stable' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Показатели</h3>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Добавить
        </Button>
      </div>

      {vitals.map((vital, index) => (
        <VitalCard key={index} vital={vital} />
      ))}
    </div>
  );
}

function VitalCard({ vital }: any) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{vital.type}</p>
            <p className="text-xs text-gray-500">{vital.date}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{vital.value} <span className="text-sm font-normal">{vital.unit}</span></p>
            <div className="flex items-center gap-1 text-xs text-green-600 justify-end">
              <TrendingUp className={`w-3 h-3 ${vital.trend === 'up' ? 'rotate-45' : vital.trend === 'down' ? '-rotate-45' : ''}`} />
              <span>{vital.trend === 'up' ? 'Рост' : vital.trend === 'down' ? 'Снижение' : 'Стабильно'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
# DIALOGS
# ============================================================================

function MedicationDialog({ open, onOpenChange }: any) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('1 раз в день');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить лекарство</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Название</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Например: Витамин D" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Дозировка</label>
            <Input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="Например: 2000 МЕ" />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Частота</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option>1 раз в день</option>
              <option>2 раза в день</option>
              <option>3 раза в день</option>
              <option>По необходимости</option>
            </select>
          </div>
          <Button className="w-full">Добавить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LabResultDialog({ open, onOpenChange }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Загрузить анализы</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Перетащите файл или нажмите для загрузки</p>
            <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG до 10MB</p>
          </div>
          <Button className="w-full">Загрузить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AppointmentDialog({ open, onOpenChange }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Записаться на прием</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Форма записи...</p>
          <Button className="w-full">Записаться</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
# SKELETON
# ============================================================================

function MedicineSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-20 bg-white rounded-xl animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
