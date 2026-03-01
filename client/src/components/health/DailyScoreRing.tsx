import React from 'react';
import { cn } from '@/lib/utils';
import { HealthModule, moduleColors } from '@/stores/healthStore';

interface ModuleSegment {
  module: HealthModule;
  score: number;
  weight: number;
}

interface DailyScoreRingProps {
  overallScore: number;
  moduleScores: Record<HealthModule, number>;
  size?: 'sm' | 'md' | 'lg';
  showModules?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { width: 120, strokeWidth: 8, fontSize: 24, subFontSize: 10 },
  md: { width: 180, strokeWidth: 12, fontSize: 36, subFontSize: 12 },
  lg: { width: 240, strokeWidth: 16, fontSize: 48, subFontSize: 14 },
};

export function DailyScoreRing({
  overallScore,
  moduleScores,
  size = 'md',
  showModules = true,
  className,
}: DailyScoreRingProps) {
  const config = sizeConfig[size];
  const center = config.width / 2;
  const radius = (config.width - config.strokeWidth) / 2 - 4;
  const circumference = 2 * Math.PI * radius;

  // Module weights for overall calculation
  const moduleWeights: Record<HealthModule, number> = {
    nutrition: 0.15,
    movement: 0.15,
    sleep: 0.20,
    psychology: 0.20,
    medicine: 0.10,
    relationships: 0.10,
    habits: 0.10,
  };

  const modules = Object.entries(moduleScores) as [HealthModule, number][];
  
  // Calculate segments
  let currentOffset = 0;
  const segments = modules.map(([module, score]) => {
    const weight = moduleWeights[module];
    const segmentLength = circumference * weight;
    const segment = {
      module,
      score,
      color: moduleColors[module].primary,
      offset: currentOffset,
      length: segmentLength,
      dashArray: `${segmentLength} ${circumference - segmentLength}`,
    };
    currentOffset -= segmentLength;
    return segment;
  });

  // Determine score color and message
  const getScoreInfo = (score: number) => {
    if (score >= 80) return { color: '#22c55e', message: 'Отлично!', emoji: '🌟' };
    if (score >= 60) return { color: '#eab308', message: 'Хорошо', emoji: '👍' };
    if (score >= 40) return { color: '#f97316', message: 'Неплохо', emoji: '💪' };
    return { color: '#ef4444', message: 'Начни сегодня', emoji: '🌱' };
  };

  const scoreInfo = getScoreInfo(overallScore);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div 
        className="relative"
        style={{ width: config.width, height: config.width }}
      >
        <svg
          width={config.width}
          height={config.width}
          viewBox={`0 0 ${config.width} ${config.width}`}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#f3f4f6"
            strokeWidth={config.strokeWidth}
          />
          
          {/* Module segments */}
          {segments.map((segment) => (
            <circle
              key={segment.module}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={config.strokeWidth}
              strokeDasharray={segment.dashArray}
              strokeDashoffset={segment.offset}
              strokeLinecap="round"
              className="transition-all duration-500"
              style={{
                opacity: segment.score > 0 ? 0.8 + (segment.score / 500) : 0.3,
              }}
            />
          ))}
          
          {/* Inner decoration */}
          <circle
            cx={center}
            cy={center}
            r={radius - config.strokeWidth - 4}
            fill="white"
          />
        </svg>
        
        {/* Center content */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ transform: 'rotate(0deg)' }}
        >
          <span 
            className="font-bold"
            style={{ 
              fontSize: config.fontSize, 
              color: scoreInfo.color,
              lineHeight: 1
            }}
          >
            {overallScore}
          </span>
          <span 
            className="text-gray-400 font-medium"
            style={{ fontSize: config.subFontSize }}
          >
            / 100
          </span>
        </div>
      </div>
      
      {/* Score message */}
      <div className="mt-3 text-center">
        <span className="text-2xl mr-2">{scoreInfo.emoji}</span>
        <span 
          className="font-semibold"
          style={{ color: scoreInfo.color }}
        >
          {scoreInfo.message}
        </span>
      </div>

      {/* Module breakdown */}
      {showModules && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {segments.map((segment) => (
            <div 
              key={segment.module}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs"
              style={{ backgroundColor: `${segment.color}20` }}
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-gray-600 capitalize">
                {getModuleLabel(segment.module)}
              </span>
              <span className="font-semibold" style={{ color: segment.color }}>
                {segment.score}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getModuleLabel(module: HealthModule): string {
  const labels: Record<HealthModule, string> = {
    nutrition: 'Питание',
    movement: 'Движение',
    sleep: 'Сон',
    psychology: 'Психология',
    medicine: 'Медицина',
    relationships: 'Отношения',
    habits: 'Привычки',
  };
  return labels[module];
}

// Simplified version for compact layouts
export function ScoreBadge({ 
  score, 
  size = 'md' 
}: { 
  score: number; 
  size?: 'sm' | 'md' | 'lg';
}) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return '#22c55e';
    if (s >= 60) return '#eab308';
    if (s >= 40) return '#f97316';
    return '#ef4444';
  };

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  };

  const color = getScoreColor(score);

  return (
    <div 
      className={cn(
        "rounded-full flex items-center justify-center font-bold",
        sizeClasses[size]
      )}
      style={{ 
        backgroundColor: `${color}20`,
        color: color,
        border: `2px solid ${color}40`
      }}
    >
      {score}
    </div>
  );
}
