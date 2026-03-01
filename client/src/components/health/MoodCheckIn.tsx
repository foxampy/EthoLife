import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  usePsychologyStore,
  emotionOptions,
  getEmotionConfig,
} from '@/stores/modules/psychologyStore';

interface MoodCheckInProps {
  onSave: () => void;
  onCancel: () => void;
}

const MOOD_EMOJIS = [
  { value: 1, emoji: '😢', label: 'Очень плохо' },
  { value: 2, emoji: '😞', label: 'Плохо' },
  { value: 3, emoji: '😕', label: 'Не очень' },
  { value: 4, emoji: '😐', label: 'Так себе' },
  { value: 5, emoji: '🙂', label: 'Нормально' },
  { value: 6, emoji: '😊', label: 'Хорошо' },
  { value: 7, emoji: '😀', label: 'Отлично' },
  { value: 8, emoji: '😄', label: 'Прекрасно' },
  { value: 9, emoji: '🤩', label: 'Восхитительно' },
  { value: 10, emoji: '🥰', label: 'Супер!' },
];

export default function MoodCheckIn({ onSave, onCancel }: MoodCheckInProps) {
  const { toast } = useToast();
  const { logMood, getMoodColor } = usePsychologyStore();

  const [overallMood, setOverallMood] = useState<number>(5);
  const [energyLevel, setEnergyLevel] = useState<number>(5);
  const [stressLevel, setStressLevel] = useState<number>(5);
  const [anxietyLevel, setAnxietyLevel] = useState<number>(5);
  const [focusLevel, setFocusLevel] = useState<number>(5);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [journalNote, setJournalNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentMoodConfig = MOOD_EMOJIS.find((m) => m.value === overallMood);
  const moodColor = getMoodColor(overallMood);

  const toggleEmotion = (emotionName: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(emotionName)
        ? prev.filter((e) => e !== emotionName)
        : [...prev, emotionName]
    );
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    const result = await logMood({
      overall_mood: overallMood,
      energy_level: energyLevel,
      stress_level: stressLevel,
      anxiety_level: anxietyLevel,
      focus_level: focusLevel,
      emotions: selectedEmotions,
      journal_entry: journalNote || undefined,
    });

    setIsSubmitting(false);

    if (result) {
      onSave();
    } else {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить настроение',
        variant: 'destructive',
      });
    }
  };

  const positiveEmotions = emotionOptions.filter((e) => e.valence === 'positive');
  const neutralEmotions = emotionOptions.filter((e) => e.valence === 'neutral');
  const negativeEmotions = emotionOptions.filter((e) => e.valence === 'negative');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <Card className="overflow-hidden border-2" style={{ borderColor: moodColor + '40' }}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: moodColor }} />
              Как ты себя чувствуешь?
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overall Mood */}
          <div className="text-center">
            <motion.div
              key={overallMood}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-6xl mb-2"
            >
              {currentMoodConfig?.emoji}
            </motion.div>
            <div className="text-lg font-medium" style={{ color: moodColor }}>
              {currentMoodConfig?.label}
            </div>
            <div className="text-2xl font-bold mt-1">{overallMood}/10</div>
          </div>

          {/* Mood Slider */}
          <div className="space-y-2">
            <Slider
              value={[overallMood]}
              onValueChange={(value) => setOverallMood(value[0])}
              min={1}
              max={10}
              step={1}
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>😢 1</span>
              <span>😐 5</span>
              <span>🥰 10</span>
            </div>
          </div>

          {/* Quick Emoji Selector */}
          <div className="flex justify-center gap-1">
            {[1, 3, 5, 7, 10].map((value) => {
              const config = MOOD_EMOJIS.find((m) => m.value === value);
              return (
                <button
                  key={value}
                  onClick={() => setOverallMood(value)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
                    overallMood === value
                      ? 'ring-2 ring-offset-2 scale-110'
                      : 'opacity-50 hover:opacity-75'
                  }`}
                  style={{
                    ringColor: overallMood === value ? moodColor : undefined,
                  }}
                >
                  {config?.emoji}
                </button>
              );
            })}
          </div>

          {/* Detailed Metrics */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium text-sm text-gray-700">Детальнее:</h4>

            {/* Energy */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">⚡ Энергия</span>
                <span className="font-medium">{energyLevel}/10</span>
              </div>
              <Slider
                value={[energyLevel]}
                onValueChange={(value) => setEnergyLevel(value[0])}
                min={1}
                max={10}
                step={1}
              />
            </div>

            {/* Stress */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">😰 Стресс</span>
                <span className="font-medium">{stressLevel}/10</span>
              </div>
              <Slider
                value={[stressLevel]}
                onValueChange={(value) => setStressLevel(value[0])}
                min={1}
                max={10}
                step={1}
              />
            </div>

            {/* Anxiety */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">😟 Тревога</span>
                <span className="font-medium">{anxietyLevel}/10</span>
              </div>
              <Slider
                value={[anxietyLevel]}
                onValueChange={(value) => setAnxietyLevel(value[0])}
                min={1}
                max={10}
                step={1}
              />
            </div>

            {/* Focus */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">🎯 Концентрация</span>
                <span className="font-medium">{focusLevel}/10</span>
              </div>
              <Slider
                value={[focusLevel]}
                onValueChange={(value) => setFocusLevel(value[0])}
                min={1}
                max={10}
                step={1}
              />
            </div>
          </div>

          {/* Emotions */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-sm text-gray-700">Что ты чувствуешь?</h4>
            
            {/* Positive Emotions */}
            <div className="flex flex-wrap gap-2">
              {positiveEmotions.map((emotion) => (
                <EmotionChip
                  key={emotion.name}
                  emotion={emotion}
                  isSelected={selectedEmotions.includes(emotion.name)}
                  onClick={() => toggleEmotion(emotion.name)}
                  variant="positive"
                />
              ))}
            </div>

            {/* Neutral Emotions */}
            <div className="flex flex-wrap gap-2">
              {neutralEmotions.map((emotion) => (
                <EmotionChip
                  key={emotion.name}
                  emotion={emotion}
                  isSelected={selectedEmotions.includes(emotion.name)}
                  onClick={() => toggleEmotion(emotion.name)}
                  variant="neutral"
                />
              ))}
            </div>

            {/* Negative Emotions */}
            <div className="flex flex-wrap gap-2">
              {negativeEmotions.map((emotion) => (
                <EmotionChip
                  key={emotion.name}
                  emotion={emotion}
                  isSelected={selectedEmotions.includes(emotion.name)}
                  onClick={() => toggleEmotion(emotion.name)}
                  variant="negative"
                />
              ))}
            </div>
          </div>

          {/* Journal Note */}
          <div className="space-y-2 pt-4 border-t">
            <h4 className="font-medium text-sm text-gray-700">Заметка (опционально)</h4>
            <Textarea
              placeholder="Что сейчас происходит? Что вызвало эти чувства?"
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onCancel}>
              Отмена
            </Button>
            <Button
              className="flex-1 text-white"
              style={{ backgroundColor: moodColor }}
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface EmotionChipProps {
  emotion: {
    name: string;
    emoji: string;
    label: string;
  };
  isSelected: boolean;
  onClick: () => void;
  variant: 'positive' | 'neutral' | 'negative';
}

function EmotionChip({ emotion, isSelected, onClick, variant }: EmotionChipProps) {
  const colors = {
    positive: {
      bg: 'bg-green-100',
      border: 'border-green-300',
      text: 'text-green-800',
      selectedBg: 'bg-green-500',
      selectedText: 'text-white',
    },
    neutral: {
      bg: 'bg-gray-100',
      border: 'border-gray-300',
      text: 'text-gray-700',
      selectedBg: 'bg-gray-500',
      selectedText: 'text-white',
    },
    negative: {
      bg: 'bg-orange-100',
      border: 'border-orange-300',
      text: 'text-orange-800',
      selectedBg: 'bg-orange-500',
      selectedText: 'text-white',
    },
  };

  const color = colors[variant];

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
        isSelected
          ? `${color.selectedBg} ${color.selectedText} shadow-md`
          : `${color.bg} ${color.text} border ${color.border} hover:shadow-sm`
      }`}
    >
      {emotion.emoji} {emotion.label}
    </button>
  );
}
