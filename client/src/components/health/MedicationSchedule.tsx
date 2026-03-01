import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, 
  Check, 
  X, 
  Clock, 
  Utensils,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useMedicineStore, type IntakeLog, type UserMedication } from '@/stores/modules/medicineStore';

// Module color theme
const theme = {
  primary: '#ef4444',
  secondary: '#fca5a5',
  bg: '#fef2f2',
};

interface MedicationScheduleProps {
  intakes: IntakeLog[];
  onStatusChange?: () => void;
}

interface TimeSlot {
  id: string;
  label: string;
  time: string;
  icon: React.ReactNode;
  startHour: number;
  endHour: number;
  medications: {
    intake: IntakeLog;
    medication: UserMedication;
  }[];
}

export function MedicationSchedule({ intakes, onStatusChange }: MedicationScheduleProps) {
  const { logIntake, skipIntake, formatDosage } = useMedicineStore();
  const [expandedSlots, setExpandedSlots] = useState<Set<string>>(new Set(['morning']));
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  // Group medications by time slots
  const timeSlots: TimeSlot[] = useMemo(() => {
    const slots: TimeSlot[] = [
      {
        id: 'morning',
        label: 'Утро',
        time: '06:00 - 11:00',
        icon: <Clock className="w-4 h-4" />,
        startHour: 6,
        endHour: 11,
        medications: [],
      },
      {
        id: 'afternoon',
        label: 'День',
        time: '11:00 - 16:00',
        icon: <Clock className="w-4 h-4" />,
        startHour: 11,
        endHour: 16,
        medications: [],
      },
      {
        id: 'evening',
        label: 'Вечер',
        time: '16:00 - 21:00',
        icon: <Clock className="w-4 h-4" />,
        startHour: 16,
        endHour: 21,
        medications: [],
      },
      {
        id: 'night',
        label: 'Ночь',
        time: '21:00 - 06:00',
        icon: <Clock className="w-4 h-4" />,
        startHour: 21,
        endHour: 6,
        medications: [],
      },
    ];

    for (const intake of intakes) {
      if (!intake.medication) continue;

      const scheduledHour = new Date(intake.scheduled_time).getHours();
      
      // Find appropriate slot
      let slotIndex = 0; // morning default
      if (scheduledHour >= 11 && scheduledHour < 16) slotIndex = 1;
      else if (scheduledHour >= 16 && scheduledHour < 21) slotIndex = 2;
      else if (scheduledHour >= 21 || scheduledHour < 6) slotIndex = 3;
      
      slots[slotIndex].medications.push({
        intake,
        medication: intake.medication,
      });
    }

    // Sort medications within each slot by scheduled time
    slots.forEach(slot => {
      slot.medications.sort((a, b) => 
        new Date(a.intake.scheduled_time).getTime() - new Date(b.intake.scheduled_time).getTime()
      );
    });

    return slots;
  }, [intakes]);

  // Calculate progress for each slot
  const getSlotProgress = (slot: TimeSlot) => {
    if (slot.medications.length === 0) return 0;
    const taken = slot.medications.filter(m => m.intake.status === 'taken').length;
    return Math.round((taken / slot.medications.length) * 100);
  };

  const toggleSlot = (slotId: string) => {
    setExpandedSlots(prev => {
      const newSet = new Set(prev);
      if (newSet.has(slotId)) {
        newSet.delete(slotId);
      } else {
        newSet.add(slotId);
      }
      return newSet;
    });
  };

  const handleTake = async (intakeId: string) => {
    setProcessingIds(prev => new Set(prev).add(intakeId));
    await logIntake(intakeId, {});
    setProcessingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(intakeId);
      return newSet;
    });
    onStatusChange?.();
  };

  const handleSkip = async (intakeId: string) => {
    setProcessingIds(prev => new Set(prev).add(intakeId));
    await skipIntake(intakeId, 'Пропущено пользователем');
    setProcessingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(intakeId);
      return newSet;
    });
    onStatusChange?.();
  };

  // Check if medication is overdue
  const isOverdue = (intake: IntakeLog) => {
    if (intake.status !== 'scheduled') return false;
    const scheduledTime = new Date(intake.scheduled_time);
    const now = new Date();
    return scheduledTime < now;
  };

  // Check if medication is due soon (within 30 minutes)
  const isDueSoon = (intake: IntakeLog) => {
    if (intake.status !== 'scheduled') return false;
    const scheduledTime = new Date(intake.scheduled_time);
    const now = new Date();
    const diffMinutes = (scheduledTime.getTime() - now.getTime()) / (1000 * 60);
    return diffMinutes > 0 && diffMinutes <= 30;
  };

  if (intakes.length === 0) {
    return (
      <div className="text-center py-12">
        <Pill className="w-12 h-12 mx-auto mb-4 text-foreground/20" />
        <p className="text-foreground/60 mb-4">Нет запланированных лекарств на сегодня</p>
        <Button size="sm" style={{ backgroundColor: theme.primary }}>
          Добавить лекарство
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Daily Progress Ring */}
      <div className="flex items-center justify-center py-4">
        <ProgressRing 
          progress={useMedicineStore.getState().todayMedicine.adherenceRate}
          size={120}
          strokeWidth={10}
        />
      </div>

      {/* Time Slots */}
      <div className="space-y-3">
        {timeSlots.map((slot) => {
          const progress = getSlotProgress(slot);
          const isExpanded = expandedSlots.has(slot.id);
          const hasMedications = slot.medications.length > 0;

          if (!hasMedications) return null;

          return (
            <motion.div
              key={slot.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-xl border overflow-hidden",
                isExpanded ? "border-red-200" : "border-border"
              )}
            >
              {/* Slot Header */}
              <button
                onClick={() => toggleSlot(slot.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 transition-colors",
                  isExpanded ? "bg-red-50/50" : "hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: theme.bg }}
                  >
                    {slot.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{slot.label}</p>
                    <p className="text-sm text-foreground/60">{slot.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Progress */}
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${progress}%`,
                          backgroundColor: progress === 100 ? '#22c55e' : theme.primary
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-10 text-right">
                      {progress}%
                    </span>
                  </div>
                  
                  {/* Count Badge */}
                  <Badge variant="secondary" className="text-xs">
                    {slot.medications.filter(m => m.intake.status === 'taken').length}/{slot.medications.length}
                  </Badge>
                  
                  {/* Expand Icon */}
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-foreground/40" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-foreground/40" />
                  )}
                </div>
              </button>

              {/* Medications List */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 space-y-3">
                      {slot.medications.map(({ intake, medication }) => {
                        const medName = medication.custom_name || medication.drug?.name || 'Лекарство';
                        const dosage = formatDosage(medication.dosage_amount, medication.dosage_unit);
                        const isTaken = intake.status === 'taken';
                        const isSkipped = intake.status === 'skipped' || intake.status === 'missed';
                        const isScheduled = intake.status === 'scheduled';
                        const overdue = isOverdue(intake);
                        const dueSoon = isDueSoon(intake);
                        const isProcessing = processingIds.has(intake.id);

                        return (
                          <motion.div
                            key={intake.id}
                            layout
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg border transition-all",
                              isTaken && "bg-green-50 border-green-200",
                              isSkipped && "bg-gray-50 border-gray-200 opacity-60",
                              isScheduled && overdue && "bg-red-50 border-red-200",
                              isScheduled && dueSoon && "bg-yellow-50 border-yellow-200",
                              isScheduled && !overdue && !dueSoon && "bg-white border-slate-200"
                            )}
                          >
                            {/* Status Icon */}
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                              isTaken ? "bg-green-100 text-green-600" :
                              isSkipped ? "bg-gray-100 text-gray-400" :
                              overdue ? "bg-red-100 text-red-600" :
                              dueSoon ? "bg-yellow-100 text-yellow-600" :
                              "bg-red-50 text-red-400"
                            )}>
                              {isTaken ? (
                                <Check className="w-5 h-5" />
                              ) : isSkipped ? (
                                <X className="w-5 h-5" />
                              ) : overdue ? (
                                <AlertTriangle className="w-5 h-5" />
                              ) : (
                                <Pill className="w-5 h-5" />
                              )}
                            </div>

                            {/* Medication Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className={cn(
                                  "font-medium truncate",
                                  (isTaken || isSkipped) && "line-through text-foreground/60"
                                )}>
                                  {medName}
                                </p>
                                {overdue && (
                                  <Badge variant="destructive" className="text-xs shrink-0">
                                    Просрочено
                                  </Badge>
                                )}
                                {dueSoon && (
                                  <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-700 shrink-0">
                                    Скоро
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-sm text-foreground/60">
                                <span>{dosage}</span>
                                {medication.with_food && medication.with_food !== 'no_matter' && (
                                  <span className="flex items-center gap-1">
                                    <Utensils className="w-3 h-3" />
                                    {medication.with_food === 'before' && 'До еды'}
                                    {medication.with_food === 'with' && 'С едой'}
                                    {medication.with_food === 'after' && 'После еды'}
                                    {medication.with_food === 'empty_stomach' && 'Натощак'}
                                  </span>
                                )}
                              </div>
                              {medication.instructions && (
                                <p className="text-xs text-foreground/40 mt-1">
                                  {medication.instructions}
                                </p>
                              )}
                            </div>

                            {/* Actions */}
                            {isScheduled && (
                              <div className="flex items-center gap-2 shrink-0">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-100"
                                  onClick={() => handleSkip(intake.id)}
                                  disabled={isProcessing}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  className="h-8 px-3"
                                  style={{ backgroundColor: theme.primary }}
                                  onClick={() => handleTake(intake.id)}
                                  disabled={isProcessing}
                                >
                                  {isProcessing ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <>
                                      <Check className="w-4 h-4 mr-1" />
                                      Принять
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                            
                            {isTaken && (
                              <div className="text-xs text-green-600 font-medium shrink-0">
                                {intake.taken_at && (
                                  <>
                                    <Check className="w-3 h-3 inline mr-1" />
                                    {new Date(intake.taken_at).toLocaleTimeString('ru-RU', { 
                                      hour: '2-digit', 
                                      minute: '2-digit' 
                                    })}
                                  </>
                                )}
                              </div>
                            )}
                            
                            {isSkipped && (
                              <div className="text-xs text-gray-400 shrink-0">
                                Пропущено
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// PROGRESS RING COMPONENT
// ============================================

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

function ProgressRing({ progress, size = 100, strokeWidth = 8 }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const getColor = () => {
    if (progress >= 90) return '#22c55e';
    if (progress >= 70) return '#f59e0b';
    if (progress >= 50) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color: getColor() }}>
          {progress}%
        </span>
        <span className="text-xs text-foreground/60"> adherence</span>
      </div>
    </div>
  );
}

export default MedicationSchedule;
