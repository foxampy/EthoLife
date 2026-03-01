import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { 
  Pill, 
  ChevronLeft, 
  Clock, 
  Flame, 
  Settings, 
  Plus, 
  CheckCircle2,
  Circle,
  AlertCircle,
  Calendar,
  TrendingUp,
  Activity,
  FileText,
  Stethoscope,
  AlertTriangle,
  ChevronRight,
  X,
  Info,
  Sparkles,
  Beaker,
  User,
  Thermometer
} from 'lucide-react';
import { MedicationSchedule } from '@/components/health/MedicationSchedule';
import { useMedicineStore } from '@/stores/modules/medicineStore';
import { useHealthStore, moduleColors } from '@/stores/healthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Module color theme - red for medicine
const theme = moduleColors.medicine;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

export default function MedicineModule() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('schedule');
  
  const {
    initialize,
    isLoading,
    isInitialized,
    medications,
    todayMedicine,
    todayIntakes,
    symptoms,
    labResults,
    appointments,
    conditions,
    insights,
    interactions,
    fetchTodayIntakes,
    getUpcomingAppointments,
    getRefillNeeded,
    getMissedMedications,
  } = useMedicineStore();

  const { updateModuleScore } = useHealthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  // Update overall health score when adherence changes
  useEffect(() => {
    if (todayMedicine.adherenceRate > 0 || todayMedicine.scheduledCount > 0) {
      updateModuleScore('medicine', todayMedicine.adherenceRate);
    }
  }, [todayMedicine.adherenceRate, updateModuleScore]);

  const upcomingAppointments = getUpcomingAppointments(30);
  const refillNeeded = getRefillNeeded();
  const missedMeds = getMissedMedications();
  const recentSymptoms = symptoms.slice(0, 5);
  const recentLabs = labResults.slice(0, 5);
  const activeConditions = conditions.filter(c => c.current_status === 'active');
  const criticalInteractions = interactions.filter(
    i => ['major', 'contraindicated'].includes(i.interaction_severity) && !i.is_acknowledged
  );

  if (isLoading && !isInitialized) {
    return <MedicineModuleSkeleton />;
  }

  const hasMedications = medications.length > 0;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 pt-16 md:pt-20">
      <div className="container max-w-7xl px-4 py-6 md:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation('/health-center')}
              className="shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme.bg }}
              >
                <Pill className="w-6 h-6" style={{ color: theme.primary }} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Медицина</h1>
                <p className="text-sm text-foreground/60">Медикаменты, анализы и приемы</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {todayMedicine.adherenceRate >= 90 && (
                <Badge 
                  variant="secondary" 
                  className="hidden sm:flex items-center gap-1"
                  style={{ backgroundColor: theme.bg, color: theme.primary }}
                >
                  <Flame className="w-3 h-3" />
                  <span>{todayMedicine.adherenceRate}% adherence</span>
                </Badge>
              )}
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5 text-foreground/60" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Critical Alerts */}
        <AnimatePresence>
          {(criticalInteractions.length > 0 || missedMeds.length > 0 || refillNeeded.length > 0) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 space-y-3"
            >
              {criticalInteractions.length > 0 && (
                <AlertBanner 
                  type="critical" 
                  icon={<AlertTriangle className="w-5 h-5" />}
                  title={`${criticalInteractions.length} опасных взаимодействия лекарств`}
                  description="Немедленно проконсультируйтесь с врачом"
                />
              )}
              {missedMeds.length > 0 && (
                <AlertBanner 
                  type="warning" 
                  icon={<AlertCircle className="w-5 h-5" />}
                  title={`${missedMeds.length} пропущенных приема`}
                  description="Проверьте расписание и примите пропущенные лекарства"
                />
              )}
              {refillNeeded.length > 0 && (
                <AlertBanner 
                  type="info" 
                  icon={<Pill className="w-5 h-5" />}
                  title={`${refillNeeded.length} лекарств заканчивается`}
                  description="Закажите повторно в ближайшее время"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 md:w-fit md:inline-flex">
            <TabsTrigger value="schedule">Расписание</TabsTrigger>
            <TabsTrigger value="history">История</TabsTrigger>
            <TabsTrigger value="labs">Анализы</TabsTrigger>
            <TabsTrigger value="doctors">Врачи</TabsTrigger>
          </TabsList>

          {/* SCHEDULE TAB */}
          <TabsContent value="schedule" className="space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Main Schedule Card */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card 
                  className="overflow-hidden"
                  style={{ borderLeftWidth: '4px', borderLeftColor: theme.primary }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="w-5 h-5" style={{ color: theme.primary }} />
                          Расписание на сегодня
                        </CardTitle>
                        <CardDescription>
                          {new Date().toLocaleDateString('ru-RU', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                          })}
                        </CardDescription>
                      </div>
                      <Button size="sm" style={{ backgroundColor: theme.primary }}>
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {hasMedications ? (
                      <MedicationSchedule 
                        intakes={todayIntakes}
                        onStatusChange={fetchTodayIntakes}
                      />
                    ) : (
                      <EmptyState
                        icon={<Pill className="w-12 h-12" />}
                        title="Нет лекарств"
                        description="Добавьте свои лекарства для отслеживания"
                        action={
                          <Button style={{ backgroundColor: theme.primary }}>
                            <Plus className="w-4 h-4 mr-2" />
                            Добавить лекарство
                          </Button>
                        }
                      />
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Side Stats */}
              <motion.div variants={itemVariants} className="space-y-4">
                {/* Adherence Card */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-foreground/60">Приверженность (7 дней)</span>
                      <TrendingUp className="w-4 h-4" style={{ color: theme.primary }} />
                    </div>
                    <div className="flex items-end gap-2 mb-2">
                      <p className="text-3xl font-bold" style={{ color: theme.primary }}>
                        {todayMedicine.adherenceRate}%
                      </p>
                      <p className="text-sm text-foreground/60 mb-1">
                        {todayMedicine.takenCount}/{todayMedicine.scheduledCount}
                      </p>
                    </div>
                    <Progress 
                      value={todayMedicine.adherenceRate} 
                      className="h-2"
                    />
                    <p className="text-xs text-foreground/60 mt-2">
                      {todayMedicine.adherenceRate >= 90 
                        ? 'Отличная приверженность!' 
                        : todayMedicine.adherenceRate >= 70 
                          ? 'Хороший результат, но есть куда стремиться'
                          : 'Требуется улучшение приверженности'}
                    </p>
                  </CardContent>
                </Card>

                {/* Upcoming Appointments */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-foreground/60">Ближайшие приемы</span>
                      <Calendar className="w-4 h-4" style={{ color: theme.primary }} />
                    </div>
                    {upcomingAppointments.length > 0 ? (
                      <div className="space-y-2">
                        {upcomingAppointments.slice(0, 3).map((appt) => (
                          <div 
                            key={appt.id}
                            className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                              style={{ backgroundColor: theme.bg }}
                            >
                              <Stethoscope className="w-5 h-5" style={{ color: theme.primary }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {appt.doctor?.name || 'Врач'}
                              </p>
                              <p className="text-xs text-foreground/60">
                                {appt.doctor?.specialty} • {new Date(appt.scheduled_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-foreground/40" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-foreground/60 text-center py-2">
                        Нет запланированных приемов
                      </p>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => setActiveTab('doctors')}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Записаться
                    </Button>
                  </CardContent>
                </Card>

                {/* Active Conditions */}
                {activeConditions.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-foreground/60">Диагнозы</span>
                        <Activity className="w-4 h-4" style={{ color: theme.primary }} />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {activeConditions.map((condition) => (
                          <Badge 
                            key={condition.id}
                            variant="secondary"
                            className="text-xs"
                          >
                            {condition.condition_name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </motion.div>

            {/* Recent Symptoms */}
            {recentSymptoms.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Thermometer className="w-5 h-5" style={{ color: theme.primary }} />
                      Недавние симптомы
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {recentSymptoms.map((symptom) => (
                        <Badge 
                          key={symptom.id}
                          variant="outline"
                          className={cn(
                            "cursor-pointer transition-colors",
                            symptom.severity >= 7 ? "border-red-300 bg-red-50" :
                            symptom.severity >= 4 ? "border-yellow-300 bg-yellow-50" :
                            "border-green-300 bg-green-50"
                          )}
                        >
                          {symptom.custom_symptom_name || 'Симптом'} 
                          <span className="ml-1 opacity-60">({symptom.severity}/10)</span>
                        </Badge>
                      ))}
                      <Button variant="ghost" size="sm" className="h-6">
                        <Plus className="w-3 h-3 mr-1" />
                        Добавить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* AI Insights */}
            {insights.length > 0 && (
              <motion.div variants={itemVariants}>
                <Card style={{ backgroundColor: theme.bg }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Sparkles className="w-5 h-5" style={{ color: theme.primary }} />
                      AI Рекомендации
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {insights.slice(0, 3).map((insight) => (
                        <div 
                          key={insight.id}
                          className="flex items-start gap-3 p-3 bg-white rounded-lg"
                        >
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: theme.bg }}
                          >
                            <Info className="w-4 h-4" style={{ color: theme.primary }} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{insight.title}</p>
                            <p className="text-sm text-foreground/60">{insight.description}</p>
                          </div>
                          <Button variant="ghost" size="icon" className="shrink-0 h-6 w-6">
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </TabsContent>

          {/* HISTORY TAB */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>История приема лекарств</CardTitle>
                <CardDescription>За последние 30 дней</CardDescription>
              </CardHeader>
              <CardContent>
                {todayIntakes.length > 0 ? (
                  <div className="space-y-3">
                    {todayIntakes.map((intake) => (
                      <div 
                        key={intake.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:border-red-200 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            intake.status === 'taken' ? "bg-green-100" :
                            intake.status === 'missed' ? "bg-red-100" :
                            intake.status === 'skipped' ? "bg-gray-100" :
                            "bg-yellow-100"
                          )}>
                            <Pill className={cn(
                              "w-5 h-5",
                              intake.status === 'taken' ? "text-green-600" :
                              intake.status === 'missed' ? "text-red-600" :
                              intake.status === 'skipped' ? "text-gray-600" :
                              "text-yellow-600"
                            )} />
                          </div>
                          <div>
                            <p className="font-medium">
                              {intake.medication?.custom_name || intake.medication?.drug?.name || 'Лекарство'}
                            </p>
                            <p className="text-sm text-foreground/60">
                              {new Date(intake.scheduled_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant="secondary"
                          className={cn(
                            intake.status === 'taken' && "bg-green-100 text-green-700",
                            intake.status === 'missed' && "bg-red-100 text-red-700",
                            intake.status === 'skipped' && "bg-gray-100 text-gray-700",
                            intake.status === 'scheduled' && "bg-yellow-100 text-yellow-700"
                          )}
                        >
                          {intake.status === 'taken' && 'Принято'}
                          {intake.status === 'missed' && 'Пропущено'}
                          {intake.status === 'skipped' && 'Пропущено'}
                          {intake.status === 'scheduled' && 'Запланировано'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Pill className="w-12 h-12" />}
                    title="Нет истории"
                    description="История приема лекарств появится здесь"
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* LABS TAB */}
          <TabsContent value="labs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Beaker className="w-5 h-5" style={{ color: theme.primary }} />
                      Результаты анализов
                    </CardTitle>
                    <CardDescription>Последние обследования</CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить
                  </Button>
                </CardHeader>
                <CardContent>
                  {recentLabs.length > 0 ? (
                    <div className="space-y-3">
                      {recentLabs.map((lab) => (
                        <div 
                          key={lab.id}
                          className="p-3 rounded-lg border hover:border-red-200 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{lab.test_name}</p>
                            <Badge 
                              variant="secondary"
                              className={cn(
                                lab.overall_flag === 'normal' && "bg-green-100 text-green-700",
                                lab.overall_flag === 'borderline' && "bg-yellow-100 text-yellow-700",
                                lab.overall_flag === 'abnormal' && "bg-orange-100 text-orange-700",
                                lab.overall_flag === 'critical' && "bg-red-100 text-red-700"
                              )}
                            >
                              {lab.overall_flag === 'normal' && 'Норма'}
                              {lab.overall_flag === 'borderline' && 'Граничное'}
                              {lab.overall_flag === 'abnormal' && 'Отклонение'}
                              {lab.overall_flag === 'critical' && 'Критичное'}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground/60">
                            {new Date(lab.date_collected).toLocaleDateString('ru-RU')} • {lab.lab_name}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<Beaker className="w-12 h-12" />}
                      title="Нет результатов"
                      description="Добавьте результаты анализов"
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" style={{ color: theme.primary }} />
                    Документы
                  </CardTitle>
                  <CardDescription>Медицинские записи и заключения</CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={<FileText className="w-12 h-12" />}
                    title="Нет документов"
                    description="Загрузите медицинские документы"
                    action={
                      <Button variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Загрузить
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* DOCTORS TAB */}
          <TabsContent value="doctors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" style={{ color: theme.primary }} />
                      Мои врачи
                    </CardTitle>
                    <CardDescription>Ваши лечащие врачи</CardDescription>
                  </div>
                  <Button size="sm" style={{ backgroundColor: theme.primary }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить
                  </Button>
                </CardHeader>
                <CardContent>
                  {useMedicineStore.getState().doctors.length > 0 ? (
                    <div className="space-y-3">
                      {useMedicineStore.getState().doctors.map((doctor) => (
                        <div 
                          key={doctor.id}
                          className="flex items-center gap-3 p-3 rounded-lg border hover:border-red-200 transition-colors"
                        >
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: theme.bg }}
                          >
                            <User className="w-6 h-6" style={{ color: theme.primary }} />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{doctor.name}</p>
                            <p className="text-sm text-foreground/60">{doctor.specialty}</p>
                            {doctor.phone && (
                              <p className="text-xs text-foreground/40">{doctor.phone}</p>
                            )}
                          </div>
                          {doctor.is_primary_care && (
                            <Badge variant="secondary" className="text-xs">Основной</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<User className="w-12 h-12" />}
                      title="Нет врачей"
                      description="Добавьте информацию о ваших врачах"
                    />
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" style={{ color: theme.primary }} />
                    Расписание приемов
                  </CardTitle>
                  <CardDescription>Запланированные визиты</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingAppointments.map((appt) => (
                        <div 
                          key={appt.id}
                          className="p-3 rounded-lg border hover:border-red-200 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{appt.doctor?.name || 'Врач'}</p>
                            <Badge variant="outline">{appt.appointment_type}</Badge>
                          </div>
                          <p className="text-sm text-foreground/60">
                            {appt.doctor?.specialty}
                          </p>
                          <p className="text-sm font-medium mt-1">
                            {new Date(appt.scheduled_date).toLocaleDateString('ru-RU', { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long' 
                            })}
                            {appt.scheduled_time && ` в ${appt.scheduled_time.slice(0, 5)}`}
                          </p>
                          {appt.reason && (
                            <p className="text-xs text-foreground/40 mt-1">{appt.reason}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      icon={<Calendar className="w-12 h-12" />}
                      title="Нет приемов"
                      description="Запланируйте визит к врачу"
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function AlertBanner({ 
  type, 
  icon, 
  title, 
  description 
}: { 
  type: 'critical' | 'warning' | 'info';
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  const styles = {
    critical: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600',
    },
    warning: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-800',
      icon: 'text-orange-600',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-600',
    },
  };

  const style = styles[type];

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "p-4 rounded-lg border flex items-start gap-3",
        style.bg,
        style.border
      )}
    >
      <div className={cn("shrink-0 mt-0.5", style.icon)}>
        {icon}
      </div>
      <div className="flex-1">
        <p className={cn("font-medium text-sm", style.text)}>{title}</p>
        <p className={cn("text-sm mt-0.5", style.text, "opacity-80")}>{description}</p>
      </div>
    </motion.div>
  );
}

function EmptyState({ 
  icon, 
  title, 
  description, 
  action 
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12">
      <div className="text-foreground/20 mb-4">
        {icon}
      </div>
      <p className="text-foreground/60 font-medium mb-1">{title}</p>
      <p className="text-sm text-foreground/40 mb-4">{description}</p>
      {action}
    </div>
  );
}

// ============================================
// SKELETON LOADING
// ============================================

function MedicineModuleSkeleton() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 pt-16 md:pt-20">
      <div className="container max-w-7xl px-4 py-6 md:py-8">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="w-10 h-10" />
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div>
            <Skeleton className="w-32 h-8 mb-1" />
            <Skeleton className="w-48 h-4" />
          </div>
        </div>

        <Skeleton className="w-full h-10 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="w-full h-96" />
          </div>
          <div className="space-y-4">
            <Skeleton className="w-full h-32" />
            <Skeleton className="w-full h-32" />
            <Skeleton className="w-full h-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
