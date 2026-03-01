import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Phone,
  MessageCircle,
  Video,
  Users,
  Mail,
  Mic,
  Camera,
  FileText,
  Clock,
  Heart,
  Zap,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Plus,
  Tag,
  MapPin,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { moduleColors } from '@/stores/healthStore';
import { 
  useRelationshipsStore, 
  Contact, 
  InteractionType,
} from '@/stores/modules/relationshipsStore';

// Local ContactSelector component
const ContactSelector: React.FC<{
  contacts: Contact[];
  selectedId?: string;
  onSelect: (contact: Contact) => void;
}> = ({ contacts, selectedId, onSelect }) => {
  return (
    <div className="space-y-2">
      {contacts.map((contact) => (
        <button
          key={contact.id}
          onClick={() => onSelect(contact)}
          className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
            selectedId === contact.id
              ? 'border-pink-500 bg-pink-50'
              : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
            <User className="w-5 h-5 text-pink-600" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium">{contact.name}</p>
            <p className="text-sm text-gray-500">{contact.relationship_type}</p>
          </div>
          {selectedId === contact.id && <CheckCircle2 className="w-5 h-5 text-pink-500" />}
        </button>
      ))}
    </div>
  );
};

const RELATIONSHIPS_COLOR = moduleColors.relationships.primary;
const RELATIONSHIPS_BG = moduleColors.relationships.bg;

interface InteractionLoggerProps {
  contact?: Contact | null;
  onSave: () => void;
  onCancel: () => void;
}

const interactionTypes: { type: InteractionType; icon: React.ReactNode; label: string }[] = [
  { type: 'call', icon: <Phone className="w-5 h-5" />, label: 'Звонок' },
  { type: 'video_call', icon: <Video className="w-5 h-5" />, label: 'Видеозвонок' },
  { type: 'text_message', icon: <MessageCircle className="w-5 h-5" />, label: 'Сообщение' },
  { type: 'voice_message', icon: <Mic className="w-5 h-5" />, label: 'Голосовое' },
  { type: 'in_person', icon: <Users className="w-5 h-5" />, label: 'Встреча' },
  { type: 'social_media', icon: <Camera className="w-5 h-5" />, label: 'Соцсети' },
  { type: 'email', icon: <Mail className="w-5 h-5" />, label: 'Письмо' },
  { type: 'other', icon: <FileText className="w-5 h-5" />, label: 'Другое' },
];

const topicSuggestions = [
  'здоровье',
  'работа',
  'семья',
  'хобби',
  'планы',
  'воспоминания',
  'проблемы',
  'радости',
  'новости',
  'поддержка',
];

export default function InteractionLogger({ 
  contact: initialContact, 
  onSave, 
  onCancel 
}: InteractionLoggerProps) {
  const { toast } = useToast();
  const { contacts, logInteraction, planInteraction } = useRelationshipsStore();
  
  const [step, setStep] = useState<'contact' | 'details' | 'review'>(
    initialContact ? 'details' : 'contact'
  );
  const [selectedContact, setSelectedContact] = useState<Contact | null>(initialContact || null);
  
  // Form state
  const [interactionType, setInteractionType] = useState<InteractionType>('call');
  const [initiatedBy, setInitiatedBy] = useState<'me' | 'them' | 'mutual'>('me');
  const [qualityRating, setQualityRating] = useState(7);
  const [energyChange, setEnergyChange] = useState(0);
  const [duration, setDuration] = useState(15);
  const [topics, setTopics] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState('');
  const [location, setLocation] = useState('');
  const [wasSupportive, setWasSupportive] = useState(false);
  const [hadConflict, setHadConflict] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTopic = (topic: string) => {
    if (!topics.includes(topic)) {
      setTopics([...topics, topic]);
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setTopics(topics.filter(t => t !== topic));
  };

  const handleCustomTopicAdd = () => {
    if (customTopic.trim() && !topics.includes(customTopic.trim())) {
      setTopics([...topics, customTopic.trim()]);
      setCustomTopic('');
    }
  };

  const handleSubmit = async () => {
    if (!selectedContact) {
      toast({
        title: 'Выберите контакт',
        description: 'Необходимо выбрать человека',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const interaction = await logInteraction({
        contact_id: selectedContact.id,
        interaction_type: interactionType,
        initiated_by: initiatedBy,
        start_time: new Date(Date.now() - duration * 60000).toISOString(),
        end_time: new Date().toISOString(),
        duration_minutes: duration,
        quality_rating: qualityRating,
        energy_change: energyChange,
        topics_discussed: topics,
        was_supportive: wasSupportive,
        had_conflict: hadConflict,
        location: location || undefined,
        notes: notes || undefined,
      });

      if (interaction) {
        toast({
          title: 'Сохранено! 💕',
          description: 'Взаимодействие записано',
        });
        onSave();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEnergyLabel = (value: number) => {
    if (value <= -4) return 'Истощен';
    if (value <= -2) return 'Устал';
    if (value === 0) return 'Нейтрально';
    if (value >= 4) return 'Заряжен';
    if (value >= 2) return 'Бодрый';
    return 'Нейтрально';
  };

  const getQualityEmoji = (value: number) => {
    if (value >= 9) return '😄';
    if (value >= 7) return '🙂';
    if (value >= 5) return '😐';
    if (value >= 3) return '😕';
    return '😞';
  };

  const getQualityLabel = (value: number) => {
    if (value >= 9) return 'Отлично';
    if (value >= 7) return 'Хорошо';
    if (value >= 5) return 'Нормально';
    if (value >= 3) return 'Плохо';
    return 'Ужасно';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="px-6 py-4 text-white flex items-center justify-between"
          style={{ backgroundColor: RELATIONSHIPS_COLOR }}
        >
          <div className="flex items-center gap-3">
            {step !== 'contact' && (
              <button 
                onClick={() => setStep(step === 'review' ? 'details' : 'contact')}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-lg font-semibold">
              {step === 'contact' && 'Выберите контакт'}
              {step === 'details' && 'Детали взаимодействия'}
              {step === 'review' && 'Проверьте'}
            </h2>
          </div>
          <button 
            onClick={onCancel}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {step === 'contact' && (
            <div className="p-6">
              <ContactSelector
                contacts={contacts}
                selectedId={selectedContact?.id}
                onSelect={(contact) => {
                  setSelectedContact(contact);
                  setStep('details');
                }}
              />
            </div>
          )}

          {step === 'details' && selectedContact && (
            <div className="p-6 space-y-6">
              {/* Selected Contact */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                  style={{ backgroundColor: RELATIONSHIPS_BG }}
                >
                  👤
                </div>
                <div className="flex-1">
                  <p className="font-medium">{selectedContact.name}</p>
                  <p className="text-sm text-gray-500">{selectedContact.relationship_type}</p>
                </div>
                <button 
                  onClick={() => setStep('contact')}
                  className="text-sm text-pink-600 hover:underline"
                >
                  Изменить
                </button>
              </div>

              {/* Interaction Type */}
              <div>
                <label className="block text-sm font-medium mb-3">Тип взаимодействия</label>
                <div className="grid grid-cols-4 gap-2">
                  {interactionTypes.map(({ type, icon, label }) => (
                    <button
                      key={type}
                      onClick={() => setInteractionType(type)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                        interactionType === type
                          ? 'text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      style={interactionType === type ? { backgroundColor: RELATIONSHIPS_COLOR } : {}}
                    >
                      {icon}
                      <span className="text-xs">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Initiated By */}
              <div>
                <label className="block text-sm font-medium mb-3">Кто инициировал?</label>
                <div className="flex gap-2">
                  {(['me', 'them', 'mutual'] as const).map((who) => (
                    <button
                      key={who}
                      onClick={() => setInitiatedBy(who)}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                        initiatedBy === who
                          ? 'text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                      style={initiatedBy === who ? { backgroundColor: RELATIONSHIPS_COLOR } : {}}
                    >
                      {who === 'me' && 'Я'}
                      {who === 'them' && 'Он/Она'}
                      {who === 'mutual' && 'Вместе'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Длительность: {duration} мин
                </label>
                <Slider
                  value={[duration]}
                  onValueChange={([v]) => setDuration(v)}
                  min={1}
                  max={180}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 мин</span>
                  <span>1 ч</span>
                  <span>3 ч</span>
                </div>
              </div>

              {/* Quality Rating */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Как прошло? {getQualityEmoji(qualityRating)} {getQualityLabel(qualityRating)}
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-2xl">😞</span>
                  <Slider
                    value={[qualityRating]}
                    onValueChange={([v]) => setQualityRating(v)}
                    min={1}
                    max={10}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-2xl">😄</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span className="font-bold text-pink-600">{qualityRating}</span>
                  <span>10</span>
                </div>
              </div>

              {/* Energy Change */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  Энергия после: {getEnergyLabel(energyChange)} {energyChange > 0 ? '⚡' : energyChange < 0 ? '😫' : '😐'}
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-red-500 font-medium">-5</span>
                  <Slider
                    value={[energyChange + 5]}
                    onValueChange={([v]) => setEnergyChange(v - 5)}
                    min={0}
                    max={10}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-green-500 font-medium">+5</span>
                </div>
                <div className="text-center mt-2">
                  <Badge 
                    variant="secondary"
                    className={`${
                      energyChange > 0 ? 'bg-green-100 text-green-700' :
                      energyChange < 0 ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {energyChange > 0 ? '+' : ''}{energyChange} энергии
                  </Badge>
                </div>
              </div>

              {/* Topics */}
              <div>
                <label className="block text-sm font-medium mb-3">Темы разговора</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {topics.map((topic) => (
                    <Badge
                      key={topic}
                      variant="secondary"
                      className="cursor-pointer hover:bg-red-100"
                      onClick={() => handleRemoveTopic(topic)}
                    >
                      {topic} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {topicSuggestions
                    .filter(t => !topics.includes(t))
                    .map((topic) => (
                      <button
                        key={topic}
                        onClick={() => handleAddTopic(topic)}
                        className="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-pink-100 hover:text-pink-700 transition-colors"
                      >
                        + {topic}
                      </button>
                    ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Другая тема..."
                    value={customTopic}
                    onChange={(e) => setCustomTopic(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCustomTopicAdd()}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCustomTopicAdd}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-3">Где?</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Место встречи"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <button
                  onClick={() => setWasSupportive(!wasSupportive)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                    wasSupportive 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Heart className={`w-5 h-5 ${wasSupportive ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={wasSupportive ? 'text-green-800' : 'text-gray-700'}>
                      Получена/оказана поддержка
                    </span>
                  </div>
                  {wasSupportive && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                </button>

                <button
                  onClick={() => setHadConflict(!hadConflict)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${
                    hadConflict 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className={`w-5 h-5 ${hadConflict ? 'text-red-600' : 'text-gray-400'}`} />
                    <span className={hadConflict ? 'text-red-800' : 'text-gray-700'}>
                      Был конфликт
                    </span>
                  </div>
                  {hadConflict && <CheckCircle2 className="w-5 h-5 text-red-600" />}
                </button>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-3">Заметки</label>
                <Textarea
                  placeholder="Что обсуждали? Важные моменты..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          {step === 'review' && selectedContact && (
            <div className="p-6 space-y-4">
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">{selectedContact.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {interactionTypes.find(t => t.type === interactionType)?.icon}
                    <span>{interactionTypes.find(t => t.type === interactionType)?.label}</span>
                    <span className="text-gray-400">•</span>
                    <span>{duration} мин</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <span>Качество: {qualityRating}/10</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span>Энергия: {energyChange > 0 ? '+' : ''}{energyChange}</span>
                  </div>
                  {topics.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {topics.map(t => (
                          <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span>{location}</span>
                    </div>
                  )}
                  {wasSupportive && (
                    <div className="flex items-center gap-3 text-green-600">
                      <Heart className="w-5 h-5" />
                      <span>Поддержка оказана/получена</span>
                    </div>
                  )}
                  {hadConflict && (
                    <div className="flex items-center gap-3 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <span>Был конфликт</span>
                    </div>
                  )}
                  {notes && (
                    <div className="pt-3 border-t">
                      <p className="text-sm text-gray-600">{notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex gap-3">
          {step === 'details' && (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={onCancel}
              >
                Отмена
              </Button>
              <Button
                className="flex-1"
                style={{ backgroundColor: RELATIONSHIPS_COLOR }}
                onClick={() => setStep('review')}
              >
                Далее
              </Button>
            </>
          )}
          {step === 'review' && (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep('details')}
              >
                Назад
              </Button>
              <Button
                className="flex-1"
                style={{ backgroundColor: RELATIONSHIPS_COLOR }}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
