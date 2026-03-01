import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HealthModule, moduleColors, useHealthStore } from '@/stores/healthStore';
import { 
  Apple, 
  Activity, 
  Moon, 
  Brain, 
  Pill, 
  Users, 
  Target,
  ChevronRight,
  Flame
} from 'lucide-react';

interface QuickStat {
  label: string;
  value: string;
  target?: string;
}

interface ModuleCardProps {
  module: HealthModule;
  score: number;
  streak?: number;
  quickStats?: QuickStat[];
  aiInsight?: string;
  onClick?: () => void;
  onQuickAction?: () => void;
  quickActionLabel?: string;
  className?: string;
}

const moduleIcons: Record<HealthModule, React.ElementType> = {
  nutrition: Apple,
  movement: Activity,
  sleep: Moon,
  psychology: Brain,
  medicine: Pill,
  relationships: Users,
  habits: Target,
};

const moduleLabels: Record<HealthModule, string> = {
  nutrition: 'Питание',
  movement: 'Движение',
  sleep: 'Сон',
  psychology: 'Психология',
  medicine: 'Медицина',
  relationships: 'Отношения',
  habits: 'Привычки',
};

export function ModuleCard({
  module,
  score,
  streak,
  quickStats,
  aiInsight,
  onClick,
  onQuickAction,
  quickActionLabel,
  className,
}: ModuleCardProps) {
  const colors = moduleColors[module];
  const Icon = moduleIcons[module];
  const label = moduleLabels[module];
  
  const isCompleted = score >= 80;
  const isWarning = score > 0 && score < 50;

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-lg cursor-pointer group",
        className
      )}
      style={{ borderLeftWidth: '4px', borderLeftColor: colors.primary }}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: colors.bg }}
            >
              <Icon className="w-5 h-5" style={{ color: colors.primary }} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{label}</h3>
              {streak !== undefined && streak > 0 && (
                <div className="flex items-center gap-1 text-xs text-orange-500">
                  <Flame className="w-3 h-3" />
                  <span>{streak} дней streak</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span 
              className="text-2xl font-bold"
              style={{ color: colors.primary }}
            >
              {score}%
            </span>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <Progress 
            value={score} 
            className="h-2"
            style={{
              backgroundColor: colors.bg,
            }}
          />
        </div>

        {/* Quick Stats */}
        {quickStats && quickStats.length > 0 && (
          <div className="flex gap-4 mb-3 text-sm">
            {quickStats.map((stat, idx) => (
              <div key={idx}>
                <span className="text-gray-500">{stat.label}:</span>
                <span className="ml-1 font-medium text-gray-900">
                  {stat.value}
                  {stat.target && (
                    <span className="text-gray-400"> / {stat.target}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* AI Insight */}
        {aiInsight && (
          <div 
            className="text-xs p-2 rounded-lg mb-3"
            style={{ backgroundColor: colors.bg }}
          >
            <span className="font-medium" style={{ color: colors.primary }}>
              💡 AI:
            </span>{' '}
            <span className="text-gray-700">{aiInsight}</span>
          </div>
        )}

        {/* Quick Action */}
        {onQuickAction && quickActionLabel && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            style={{ 
              borderColor: colors.primary, 
              color: colors.primary,
              backgroundColor: 'transparent'
            }}
            onClick={(e) => {
              e.stopPropagation();
              onQuickAction();
            }}
          >
            {quickActionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Compact version for grid layouts
export function ModuleCardCompact({
  module,
  score,
  streak,
  onClick,
  className,
}: Omit<ModuleCardProps, 'quickStats' | 'aiInsight' | 'onQuickAction' | 'quickActionLabel'>) {
  const colors = moduleColors[module];
  const Icon = moduleIcons[module];
  const label = moduleLabels[module];

  return (
    <Card 
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: colors.bg }}
        >
          <Icon className="w-6 h-6" style={{ color: colors.primary }} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900">{label}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Progress 
              value={score} 
              className="h-1.5 flex-1"
              style={{ backgroundColor: colors.bg }}
            />
            <span className="text-sm font-semibold" style={{ color: colors.primary }}>
              {score}%
            </span>
          </div>
          {streak !== undefined && streak > 0 && (
            <div className="flex items-center gap-1 text-xs text-orange-500 mt-1">
              <Flame className="w-3 h-3" />
              <span>{streak}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
