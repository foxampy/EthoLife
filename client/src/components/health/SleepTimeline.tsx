import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { SleepPhase, SleepPhaseType } from '@/stores/modules/sleepStore';

interface SleepTimelineProps {
  phases: SleepPhase[];
  bedtime: string;
  wakeTime?: string;
  className?: string;
  compact?: boolean;
}

interface PhaseSegment {
  type: SleepPhaseType;
  duration: number;
  percentage: number;
  startTime: string;
}

const phaseColors: Record<SleepPhaseType, { bg: string; border: string; text: string; gradient: string }> = {
  deep: {
    bg: 'bg-indigo-600',
    border: 'border-indigo-600',
    text: 'text-indigo-600',
    gradient: 'from-indigo-600 to-indigo-700',
  },
  light: {
    bg: 'bg-violet-400',
    border: 'border-violet-400',
    text: 'text-violet-500',
    gradient: 'from-violet-400 to-violet-500',
  },
  rem: {
    bg: 'bg-fuchsia-500',
    border: 'border-fuchsia-500',
    text: 'text-fuchsia-500',
    gradient: 'from-fuchsia-500 to-fuchsia-600',
  },
  awake: {
    bg: 'bg-slate-300',
    border: 'border-slate-300',
    text: 'text-slate-500',
    gradient: 'from-slate-300 to-slate-400',
  },
};

const phaseLabels: Record<SleepPhaseType, string> = {
  deep: 'Глубокий',
  light: 'Легкий',
  rem: 'Быстрый',
  awake: 'Бодрствование',
};

const phaseIcons: Record<SleepPhaseType, string> = {
  deep: '🌙',
  light: '💤',
  rem: '👁️',
  awake: '☀️',
};

export function SleepTimeline({ 
  phases, 
  bedtime, 
  wakeTime, 
  className,
  compact = false 
}: SleepTimelineProps) {
  if (!phases || phases.length === 0) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200",
        compact ? "h-16" : "h-24",
        className
      )}>
        <p className="text-sm text-slate-400">Нет данных о фазах сна</p>
      </div>
    );
  }

  // Sort phases by start time
  const sortedPhases = [...phases].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  const totalDuration = sortedPhases.reduce((sum, p) => sum + (p.duration_minutes || 0), 0);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Timeline Bar */}
      <div className="relative">
        {/* Time markers */}
        {!compact && (
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>{formatTime(bedtime)}</span>
            <span>{wakeTime ? formatTime(wakeTime) : '...'}</span>
          </div>
        )}

        {/* Phase segments */}
        <div className={cn(
          "flex rounded-lg overflow-hidden",
          compact ? "h-4" : "h-8"
        )}>
          {sortedPhases.map((phase, index) => {
            const percentage = totalDuration > 0 
              ? ((phase.duration_minutes || 0) / totalDuration) * 100 
              : 0;
            
            return (
              <motion.div
                key={phase.id || index}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={cn(
                  "relative group cursor-pointer transition-all duration-200",
                  phaseColors[phase.phase_type].bg,
                  percentage < 5 && "min-w-[4px]"
                )}
                title={`${phaseLabels[phase.phase_type]}: ${formatDuration(phase.duration_minutes || 0)} (${Math.round(percentage)}%)`}
              >
                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {phaseIcons[phase.phase_type]} {phaseLabels[phase.phase_type]}
                  <br />
                  {formatDuration(phase.duration_minutes || 0)}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Gradient overlay for visual appeal */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
      </div>

      {/* Phase Legend */}
      {!compact && (
        <div className="flex flex-wrap gap-3">
          {(['deep', 'light', 'rem', 'awake'] as SleepPhaseType[]).map((type) => {
            const typePhases = sortedPhases.filter(p => p.phase_type === type);
            const totalTypeMinutes = typePhases.reduce((sum, p) => sum + (p.duration_minutes || 0), 0);
            const percentage = totalDuration > 0 ? Math.round((totalTypeMinutes / totalDuration) * 100) : 0;
            
            if (percentage === 0) return null;

            return (
              <div key={type} className="flex items-center gap-2">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  phaseColors[type].bg
                )} />
                <span className="text-sm text-slate-600">
                  {phaseIcons[type]} {phaseLabels[type]}
                </span>
                <span className="text-sm font-medium text-slate-800">
                  {formatDuration(totalTypeMinutes)}
                </span>
                <span className="text-xs text-slate-400">
                  ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Sleep Ring Component for visualizing sleep completeness
interface SleepRingProps {
  currentMinutes: number;
  targetMinutes: number;
  qualityScore: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SleepRing({ 
  currentMinutes, 
  targetMinutes, 
  qualityScore,
  size = 'md',
  className 
}: SleepRingProps) {
  const percentage = Math.min(100, Math.round((currentMinutes / targetMinutes) * 100));
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const subTextSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRingColor = (score: number) => {
    if (score >= 80) return 'stroke-emerald-500';
    if (score >= 60) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  return (
    <div className={cn("relative flex items-center justify-center", sizeClasses[size], className)}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          className={getRingColor(qualityScore)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        {/* Inner decorative circle */}
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="#f8fafc"
          strokeWidth="1"
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-bold text-slate-800", textSizes[size])}>
          {formatDurationShort(currentMinutes)}
        </span>
        <span className={cn("text-slate-400", subTextSizes[size])}>
          из {formatDurationShort(targetMinutes)}
        </span>
        <span className={cn("font-semibold mt-1", subTextSizes[size], getQualityColor(qualityScore))}>
          {qualityScore}%
        </span>
      </div>
    </div>
  );
}

// Sleep Quality Indicator
interface SleepQualityIndicatorProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function SleepQualityIndicator({ 
  score, 
  size = 'md',
  showLabel = true,
  className 
}: SleepQualityIndicatorProps) {
  const getQualityInfo = (s: number) => {
    if (s >= 90) return { label: 'Отличный', color: 'text-emerald-500', bg: 'bg-emerald-100', icon: '⭐⭐⭐⭐⭐' };
    if (s >= 75) return { label: 'Хороший', color: 'text-green-500', bg: 'bg-green-100', icon: '⭐⭐⭐⭐' };
    if (s >= 60) return { label: 'Удовлетворительный', color: 'text-yellow-500', bg: 'bg-yellow-100', icon: '⭐⭐⭐' };
    if (s >= 40) return { label: 'Плохой', color: 'text-orange-500', bg: 'bg-orange-100', icon: '⭐⭐' };
    return { label: 'Очень плохой', color: 'text-red-500', bg: 'bg-red-100', icon: '⭐' };
  };

  const info = getQualityInfo(score);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-lg">{info.icon}</span>
      {showLabel && (
        <span className={cn(
          "rounded-full font-medium",
          sizeClasses[size],
          info.color,
          info.bg
        )}>
          {info.label}
        </span>
      )}
    </div>
  );
}

// Mini sleep bar for compact displays
interface MiniSleepBarProps {
  phases: SleepPhase[];
  className?: string;
}

export function MiniSleepBar({ phases, className }: MiniSleepBarProps) {
  if (!phases?.length) {
    return (
      <div className={cn("h-2 bg-slate-100 rounded-full", className)} />
    );
  }

  const totalDuration = phases.reduce((sum, p) => sum + (p.duration_minutes || 0), 0);

  return (
    <div className={cn("h-2 flex rounded-full overflow-hidden", className)}>
      {phases.map((phase, index) => {
        const percentage = totalDuration > 0 
          ? ((phase.duration_minutes || 0) / totalDuration) * 100 
          : 0;
        
        return (
          <div
            key={index}
            className={phaseColors[phase.phase_type].bg}
            style={{ width: `${percentage}%` }}
          />
        );
      })}
    </div>
  );
}

// Helper functions
function formatTime(isoString: string): string {
  if (!isoString) return '--:--';
  const date = new Date(isoString);
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return '0 мин';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} мин`;
  if (mins === 0) return `${hours} ч`;
  return `${hours} ч ${mins} мин`;
}

function formatDurationShort(minutes: number): string {
  if (!minutes || minutes <= 0) return '0ч';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours}ч`;
  return `${hours}ч ${mins}м`;
}
