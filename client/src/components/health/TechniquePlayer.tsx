import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Wind,
  Clock,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { usePsychologyStore } from '@/stores/modules/psychologyStore';

interface TechniquePlayerProps {
  techniqueId: string;
  onClose: () => void;
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'hold_empty';

interface BreathingConfig {
  pattern: string;
  phases: { phase: BreathingPhase; duration: number; label: string }[];
}

const BREATHING_CONFIGS: Record<string, BreathingConfig> = {
  '4-7-8': {
    pattern: '4-7-8',
    phases: [
      { phase: 'inhale', duration: 4000, label: 'Вдох' },
      { phase: 'hold', duration: 7000, label: 'Задержка' },
      { phase: 'exhale', duration: 8000, label: 'Выдох' },
    ],
  },
  'box': {
    pattern: '4-4-4-4',
    phases: [
      { phase: 'inhale', duration: 4000, label: 'Вдох' },
      { phase: 'hold', duration: 4000, label: 'Задержка' },
      { phase: 'exhale', duration: 4000, label: 'Выдох' },
      { phase: 'hold_empty', duration: 4000, label: 'Пауза' },
    ],
  },
  'relaxing': {
    pattern: '4-6',
    phases: [
      { phase: 'inhale', duration: 4000, label: 'Вдох' },
      { phase: 'exhale', duration: 6000, label: 'Выдох' },
    ],
  },
};

export default function TechniquePlayer({ techniqueId, onClose }: TechniquePlayerProps) {
  const { toast } = useToast();
  const {
    techniques,
    startTechnique,
    completeTechnique,
    activeSession,
  } = usePsychologyStore();

  const technique = techniques.find((t) => t.id === techniqueId);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [effectivenessRating, setEffectivenessRating] = useState(5);
  const [preStressLevel, setPreStressLevel] = useState<number>(5);
  const [postStressLevel, setPostStressLevel] = useState<number>(5);
  const [moodBefore, setMoodBefore] = useState<number>(5);
  const [moodAfter, setMoodAfter] = useState<number>(5);
  const [showRating, setShowRating] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Breathing animation state
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase>('inhale');
  const [breathingProgress, setBreathingProgress] = useState(0);
  const breathingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const breathingStartTimeRef = useRef<number>(0);

  // Get breathing config for this technique
  const getBreathingConfig = useCallback((): BreathingConfig | null => {
    if (!technique) return null;
    
    const name = technique.name.toLowerCase();
    if (name.includes('4-7-8')) return BREATHING_CONFIGS['4-7-8'];
    if (name.includes('box') || name.includes('квадрат')) return BREATHING_CONFIGS['box'];
    if (technique.category === 'breathing') return BREATHING_CONFIGS['relaxing'];
    return null;
  }, [technique]);

  const breathingConfig = getBreathingConfig();

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      const session = await startTechnique(techniqueId);
      if (session) {
        sessionRef.current = session.id;
      }
    };
    initSession();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (breathingTimerRef.current) clearInterval(breathingTimerRef.current);
    };
  }, [techniqueId, startTechnique]);

  // Timer for elapsed time
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Breathing animation
  useEffect(() => {
    if (!isPlaying || !breathingConfig) return;

    const runBreathingCycle = () => {
      const phases = breathingConfig.phases;
      let currentPhaseIndex = 0;

      const runPhase = () => {
        if (currentPhaseIndex >= phases.length) {
          setCompletedCycles((prev) => prev + 1);
          currentPhaseIndex = 0;
        }

        const phase = phases[currentPhaseIndex];
        setBreathingPhase(phase.phase);
        breathingStartTimeRef.current = Date.now();

        breathingTimerRef.current = setInterval(() => {
          const elapsed = Date.now() - breathingStartTimeRef.current;
          const progress = Math.min(100, (elapsed / phase.duration) * 100);
          setBreathingProgress(progress);

          if (elapsed >= phase.duration) {
            if (breathingTimerRef.current) clearInterval(breathingTimerRef.current);
            currentPhaseIndex++;
            runPhase();
          }
        }, 50);
      };

      runPhase();
    };

    runBreathingCycle();

    return () => {
      if (breathingTimerRef.current) clearInterval(breathingTimerRef.current);
    };
  }, [isPlaying, breathingConfig]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setElapsedTime(0);
    setCompletedCycles(0);
    setCurrentStep(0);
    setBreathingPhase('inhale');
    setBreathingProgress(0);
  };

  const handleComplete = () => {
    setIsPlaying(false);
    setShowCompletion(true);
  };

  const handleSubmitRating = async () => {
    if (sessionRef.current) {
      await completeTechnique(sessionRef.current, {
        duration_seconds: elapsedTime,
        completion_rate: 100,
        effectiveness_rating: effectivenessRating,
        pre_stress_level: preStressLevel,
        post_stress_level: postStressLevel,
        mood_before: moodBefore,
        mood_after: moodAfter,
      });

      toast({
        title: 'Отлично! ✨',
        description: 'Сессия сохранена. Спасибо за обратную связь!',
      });
    }
    onClose();
  };

  if (!technique) {
    return null;
  }

  const getCurrentPhaseLabel = (): string => {
    if (!breathingConfig) return '';
    const phase = breathingConfig.phases.find((p) => p.phase === breathingPhase);
    return phase?.label || '';
  };

  const getCurrentPhaseDuration = (): number => {
    if (!breathingConfig) return 0;
    const phase = breathingConfig.phases.find((p) => p.phase === breathingPhase);
    return phase?.duration || 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-white"
    >
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold truncate flex-1 text-center mx-4">
            {technique.name_ru || technique.name}
          </h1>
          <Button variant="ghost" size="icon" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Completion Screen */}
        {showCompletion ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Сессия завершена!</h2>
              <p className="text-gray-500">
                {formatTime(elapsedTime)} • {completedCycles} циклов
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Effectiveness Rating */}
                <div className="space-y-3">
                  <label className="font-medium">Насколько это помогло?</label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                      <button
                        key={value}
                        onClick={() => setEffectivenessRating(value)}
                        className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                          effectivenessRating >= value
                            ? 'bg-cyan-500 text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Не помогло</span>
                    <span>Очень помогло</span>
                  </div>
                </div>

                {/* Mood Before/After */}
                <div className="space-y-3">
                  <label className="font-medium">Настроение до</label>
                  <Slider
                    value={[moodBefore]}
                    onValueChange={(value) => setMoodBefore(value[0])}
                    min={1}
                    max={10}
                    step={1}
                  />
                </div>

                <div className="space-y-3">
                  <label className="font-medium">Настроение после</label>
                  <Slider
                    value={[moodAfter]}
                    onValueChange={(value) => setMoodAfter(value[0])}
                    min={1}
                    max={10}
                    step={1}
                  />
                </div>

                {/* Stress Before/After */}
                <div className="space-y-3">
                  <label className="font-medium">Стресс до</label>
                  <Slider
                    value={[preStressLevel]}
                    onValueChange={(value) => setPreStressLevel(value[0])}
                    min={1}
                    max={10}
                    step={1}
                  />
                </div>

                <div className="space-y-3">
                  <label className="font-medium">Стресс после</label>
                  <Slider
                    value={[postStressLevel]}
                    onValueChange={(value) => setPostStressLevel(value[0])}
                    min={1}
                    max={10}
                    step={1}
                  />
                </div>

                <Button className="w-full bg-cyan-500 hover:bg-cyan-600" onClick={handleSubmitRating}>
                  Сохранить
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            {/* Breathing Visualization */}
            {technique.category === 'breathing' && breathingConfig && (
              <div className="flex flex-col items-center justify-center py-8">
                {/* Breathing Circle */}
                <div className="relative mb-8">
                  {/* Outer glow rings */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-cyan-200 opacity-20"
                    animate={{
                      scale: breathingPhase === 'inhale' ? 1.3 : breathingPhase === 'exhale' ? 1 : 1.15,
                      opacity: breathingPhase === 'hold' ? 0.4 : 0.2,
                    }}
                    transition={{
                      duration: getCurrentPhaseDuration() / 1000,
                      ease: 'easeInOut',
                    }}
                    style={{
                      width: 200,
                      height: 200,
                      top: -25,
                      left: -25,
                    }}
                  />
                  
                  <motion.div
                    className="w-[150px] h-[150px] rounded-full flex items-center justify-center relative"
                    style={{
                      background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                    }}
                    animate={{
                      scale: breathingPhase === 'inhale' ? 1.2 : breathingPhase === 'exhale' ? 0.9 : 1,
                    }}
                    transition={{
                      duration: getCurrentPhaseDuration() / 1000,
                      ease: breathingPhase === 'hold' ? 'linear' : 'easeInOut',
                    }}
                  >
                    <div className="text-white text-center">
                      <Wind className="w-8 h-8 mx-auto mb-1" />
                      <div className="text-2xl font-bold">{getCurrentPhaseLabel()}</div>
                    </div>
                  </motion.div>

                  {/* Progress ring */}
                  <svg
                    className="absolute inset-0 w-[150px] h-[150px] pointer-events-none"
                    style={{ top: 0, left: 0 }}
                  >
                    <circle
                      cx="75"
                      cy="75"
                      r="70"
                      fill="none"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="75"
                      cy="75"
                      r="70"
                      fill="none"
                      stroke="white"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 70}`}
                      strokeDashoffset={`${2 * Math.PI * 70 * (1 - breathingProgress / 100)}`}
                      transform="rotate(-90 75 75)"
                      style={{
                        transition: 'stroke-dashoffset 0.05s linear',
                      }}
                    />
                  </svg>
                </div>

                {/* Phase indicators */}
                <div className="flex gap-2 mb-6">
                  {breathingConfig.phases.map((phase, idx) => (
                    <div
                      key={phase.phase}
                      className={`w-2 h-2 rounded-full transition-all ${
                        breathingPhase === phase.phase
                          ? 'w-6 bg-cyan-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Instructions */}
                <p className="text-center text-gray-600 mb-6">
                  {breathingPhase === 'inhale' && 'Медленно вдохни носом...'}
                  {breathingPhase === 'hold' && 'Задержи дыхание...'}
                  {breathingPhase === 'exhale' && 'Медленно выдохни ртом...'}
                  {breathingPhase === 'hold_empty' && 'Пауза перед следующим вдохом...'}
                </p>
              </div>
            )}

            {/* Timer Display */}
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-800">
                {formatTime(elapsedTime)}
              </div>
              {technique.duration_minutes && (
                <div className="text-sm text-gray-400 mt-1">
                  из {technique.duration_minutes}:00
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">{completedCycles}</div>
                <div className="text-xs text-gray-400">циклов</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-600">
                  {Math.round((elapsedTime / ((technique.duration_minutes || 5) * 60)) * 100)}%
                </div>
                <div className="text-xs text-gray-400">прогресс</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                className="w-14 h-14 rounded-full"
                onClick={() => setShowRating(true)}
              >
                <Volume2 className="w-5 h-5" />
              </Button>

              <Button
                size="lg"
                className="w-20 h-20 rounded-full bg-cyan-500 hover:bg-cyan-600"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-14 h-14 rounded-full"
                onClick={handleComplete}
              >
                <CheckCircle2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Instructions List */}
            {technique.instructions && technique.instructions.length > 0 && (
              <Card className="mt-8">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">Инструкции:</h3>
                  <ol className="space-y-2">
                    {technique.instructions.map((instruction, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-gray-600">
                        <span className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center flex-shrink-0 text-xs font-medium">
                          {idx + 1}
                        </span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
