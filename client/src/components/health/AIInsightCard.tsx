import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Lightbulb, 
  AlertTriangle, 
  TrendingUp, 
  Award,
  ArrowRight,
  X
} from 'lucide-react';
import { HealthModule, moduleColors } from '@/stores/healthStore';

export type InsightType = 'tip' | 'warning' | 'celebration' | 'pattern' | 'correlation';

interface AIInsightCardProps {
  title: string;
  description: string;
  type: InsightType;
  relatedModules?: HealthModule[];
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  className?: string;
}

const typeConfig: Record<InsightType, {
  icon: React.ElementType;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  label: string;
}> = {
  tip: {
    icon: Lightbulb,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500',
    label: 'Совет',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-500',
    label: 'Внимание',
  },
  celebration: {
    icon: Award,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-500',
    label: 'Достижение',
  },
  pattern: {
    icon: TrendingUp,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-500',
    label: 'Паттерн',
  },
  correlation: {
    icon: TrendingUp,
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    iconColor: 'text-cyan-500',
    label: 'Связь',
  },
};

export function AIInsightCard({
  title,
  description,
  type,
  relatedModules,
  action,
  onDismiss,
  className,
}: AIInsightCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Card className={cn(
      "overflow-hidden",
      config.bgColor,
      "border",
      config.borderColor,
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            "bg-white/50"
          )}>
            <Icon className={cn("w-5 h-5", config.iconColor)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  "bg-white/70",
                  config.iconColor
                )}>
                  {config.label}
                </span>
                
                {/* Related modules */}
                {relatedModules && relatedModules.length > 0 && (
                  <div className="flex gap-1">
                    {relatedModules.map((module) => (
                      <div
                        key={module}
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: moduleColors[module].bg }}
                        title={module}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: moduleColors[module].primary }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Title */}
            <h4 className="font-semibold text-gray-900 mt-2">{title}</h4>

            {/* Description */}
            <p className="text-sm text-gray-700 mt-1">{description}</p>

            {/* Action */}
            {action && (
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "mt-3 h-8 px-3",
                  "hover:bg-white/50",
                  config.iconColor
                )}
                onClick={action.onClick}
              >
                {action.label}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for lists
export function AIInsightCompact({
  description,
  type,
  className,
}: Pick<AIInsightCardProps, 'description' | 'type' | 'className'>) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      "flex items-start gap-2 p-3 rounded-lg",
      config.bgColor,
      className
    )}>
      <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", config.iconColor)} />
      <p className="text-sm text-gray-700">{description}</p>
    </div>
  );
}

// Insight list for multiple insights
interface AIInsightListProps {
  insights: Array<{
    id: string;
    title: string;
    description: string;
    type: InsightType;
    relatedModules?: HealthModule[];
    action?: { label: string; onClick: () => void };
  }>;
  onDismiss?: (id: string) => void;
  maxItems?: number;
  className?: string;
}

export function AIInsightList({
  insights,
  onDismiss,
  maxItems = 3,
  className,
}: AIInsightListProps) {
  const displayInsights = insights.slice(0, maxItems);

  if (displayInsights.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
        💡 AI Рекомендации
      </h3>
      
      {displayInsights.map((insight) => (
        <AIInsightCard
          key={insight.id}
          title={insight.title}
          description={insight.description}
          type={insight.type}
          relatedModules={insight.relatedModules}
          action={insight.action}
          onDismiss={onDismiss ? () => onDismiss(insight.id) : undefined}
        />
      ))}

      {insights.length > maxItems && (
        <button className="text-sm text-gray-500 hover:text-gray-700 w-full text-center py-2">
          + {insights.length - maxItems} ещё
        </button>
      )}
    </div>
  );
}
