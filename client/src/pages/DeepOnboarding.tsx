import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Brain,
  Activity,
  Moon,
  Utensils,
  Users,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { ONBOARDING } from '@/config';

// Типы данных онбординга
interface OnboardingData {
  mood: number;
  energy: number;
  stress: number;
  goals: string[];
  activity_level: string;
  diet_type: string;
  sleep_duration: string;
  medical_history: string[];
  specialists: string[];
  preferences: Record<string, any>;
}

// Шаги онбординга
const STEPS = ONBOARDING.STEPS;

// Исследования для каждого шага
const RESEARCH_LINKS: Record<string, { title: string; url: string; summary: string }> = {
  mood: {
    title: 'Влияние настроения на здоровье',
    url: 'https://www.apa.org/topics/mental-health/mood-health',
    summary: 'Исследования показывают, что позитивное настроение улучшает иммунную функцию на 20-30%.',
  },
  goals: {
    title: 'Постановка целей и успех',
    url: 'https://www.lockeandlatham.com/goal-setting-theory/',
    summary: 'Конкретные и измеримые цели увеличивают вероятность успеха на 70%.',
  },
  activity: {
    title: 'Физическая активность и долголетие',
    url: 'https://www.who.int/news-room/fact-sheets/detail/physical-activity',
    summary: 'ВОЗ рекомендует 150 минут умеренной активности в неделю для снижения риска заболеваний.',
  },
  sleep: {
    title: 'Важность качественного сна',
    url: 'https://sleepfoundation.org/sleep-hygiene',
    summary: '7-9 часов сна снижают риск сердечно-сосудистых заболеваний на 45%.',
  },
  nutrition: {
    title: 'Сбалансированное питание',
    url: 'https://nutrition.org/nutrition-science',
    summary: 'Правильное питание обеспечивает 60% профилактики хронических заболеваний.',
  },
};

export default function DeepOnboarding() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    mood: 5,
    energy: 5,
    stress: 5,
    goals: [],
    activity_level: 'moderate',
    diet_type: 'omnivore',
    sleep_duration: '7-8',
    medical_history: [],
    specialists: [],
    preferences: {},
  });
  const [showResearch, setShowResearch] = useState(false);

  const totalSteps = STEPS.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Завершение онбординга
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    // TODO: Отправка данных на сервер
    console.log('Onboarding completed:', data);
    setLocation('/health-center');
  };

  // Рендер шага
  const renderStep = () => {
    const step = STEPS[currentStep];

    switch (step.id) {
      case 'mood':
        return (
          <MoodStep
            data={data}
            setData={setData}
            onNext={handleNext}
            research={RESEARCH_LINKS.mood}
          />
        );
      case 'goals':
        return (
          <GoalsStep
            data={data}
            setData={setData}
            onNext={handleNext}
            research={RESEARCH_LINKS.goals}
          />
        );
      // ... другие шаги
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">Шаг в разработке</p>
            <Button onClick={handleNext} className="mt-4">
              Продолжить
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">EthoLife</h1>
                <p className="text-xs text-gray-500">Персональная настройка</p>
              </div>
            </div>
            <Badge variant="outline">
              Шаг {currentStep + 1} из {totalSteps}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      {currentStep > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowResearch(true)}
              className="text-emerald-600"
            >
              <Info className="w-4 h-4 mr-2" />
              Зачем это нужно?
            </Button>
          </div>
        </div>
      )}

      {/* Research Dialog */}
      {showResearch && RESEARCH_LINKS[STEPS[currentStep].id] && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Научное обоснование</h3>
                  <p className="text-xs text-gray-500">Исследования и факты</p>
                </div>
              </div>
              <button
                onClick={() => setShowResearch(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-700">
                {RESEARCH_LINKS[STEPS[currentStep].id].summary}
              </p>

              <a
                href={RESEARCH_LINKS[STEPS[currentStep].id].url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Читать исследование
              </a>

              <Button onClick={() => setShowResearch(false)} className="w-full">
                Понятно
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Шаг 1: Настроение
function MoodStep({ data, setData, onNext, research }: any) {
  return (
    <Card className="shadow-xl">
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <Smile className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold">Как вы себя чувствуете?</CardTitle>
        <CardDescription>
          Оцените ваше текущее состояние по шкале от 1 до 10
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Slider */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Ужасно</span>
            <span>Отлично</span>
          </div>
          <div className="flex justify-center gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <button
                key={value}
                onClick={() => setData({ ...data, mood: value })}
                className={`w-12 h-12 rounded-xl text-2xl transition-all ${
                  data.mood === value
                    ? 'bg-emerald-500 text-white scale-110 shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {value <= 3 ? '😞' : value <= 7 ? '😐' : '😊'}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={onNext}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          size="lg"
        >
          Продолжить
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

// Шаг 2: Цели
function GoalsStep({ data, setData, onNext, research }: any) {
  const goals = [
    { id: 'weight', label: 'Снижение веса', icon: '⚖️' },
    { id: 'energy', label: 'Повышение энергии', icon: '⚡' },
    { id: 'sleep', label: 'Улучшение сна', icon: '😴' },
    { id: 'stress', label: 'Снижение стресса', icon: '🧘' },
    { id: 'fitness', label: 'Улучшение формы', icon: '💪' },
    { id: 'nutrition', label: 'Здоровое питание', icon: '🥗' },
  ];

  return (
    <Card className="shadow-xl">
      <CardHeader className="text-center pb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <Target className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold">Какие цели для вас приоритетны?</CardTitle>
        <CardDescription>
          Выберите 1-3 основные цели для фокуса
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => {
                const newGoals = data.goals.includes(goal.id)
                  ? data.goals.filter((g: string) => g !== goal.id)
                  : [...data.goals, goal.id];
                setData({ ...data, goals: newGoals });
              }}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                data.goals.includes(goal.id)
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{goal.icon}</span>
              <p className="font-medium text-gray-900 mt-2 text-sm">{goal.label}</p>
            </button>
          ))}
        </div>

        <Button
          onClick={onNext}
          disabled={data.goals.length === 0}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
          size="lg"
        >
          Продолжить
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

// Импорты для компонентов
import { Target } from 'lucide-react';
