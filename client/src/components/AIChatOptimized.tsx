import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2, Trash2, Mic, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIChatOptimizedProps {
  className?: string;
  compact?: boolean;
}

const QUICK_SUGGESTIONS = [
  "Как улучшить сон?",
  "Составь план питания",
  "Трекер настроения",
  "Упражнения для спины",
];

export function AIChatOptimized({ className, compact = false }: AIChatOptimizedProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Привет! Я AI-помощник EthoLife. Чем могу помочь с твоим здоровьем сегодня?',
      timestamp: new Date(),
      suggestions: QUICK_SUGGESTIONS,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate AI response - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(input),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось получить ответ от AI',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('сон') || lowerQuery.includes('спать')) {
      return 'Для улучшения сна рекомендую:\n\n1️⃣ Ложиться в одно и то же время\n2️⃣ Избегать кофеина после 16:00\n3️⃣ Создать темную и прохладную обстановку в спальне\n4️⃣ Использовать модуль "Сон" для трекинга\n\nХочешь подробный план?';
    }
    
    if (lowerQuery.includes('питание') || lowerQuery.includes('еда') || lowerQuery.includes('диета')) {
      return 'Вот основы здорового питания:\n\n🥗 Разнообразь рацион (овощи, фрукты, белки)\n💧 Пей 2-3 литра воды в день\n🍽️ Ешь регулярно, не пропускай завтрак\n📊 Используй трекер питания в EthoLife\n\nНужен персональный план?';
    }
    
    if (lowerQuery.includes('тренировк') || lowerQuery.includes('спорт') || lowerQuery.includes('фитнес')) {
      return 'Для начала тренировок:\n\n🏃 Начни с 30 минут ходьбы в день\n💪 Добавь силовые 2-3 раза в неделю\n🧘 Не забывай про растяжку\n📱 Используй модуль "Движение"\n\nКакой у тебя уровень подготовки?';
    }
    
    return 'Интересный вопрос! Я могу помочь с:\n\n• Анализом твоих показателей здоровья\n• Рекомендациями по питанию и тренировкам\n• Планированием здорового образа жизни\n• Ответами на вопросы о модулях EthoLife\n\nЧто конкретно тебя интересует?';
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Привет! Я AI-помощник EthoLife. Чем могу помочь?',
        timestamp: new Date(),
        suggestions: QUICK_SUGGESTIONS,
      },
    ]);
  };

  return (
    <div className={`flex flex-col bg-white rounded-xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Помощник</h3>
            <p className="text-xs opacity-80">Всегда на связи</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-white/20"
          onClick={clearChat}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex gap-2 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback
                    className={
                      message.role === 'user'
                        ? 'bg-gray-200'
                        : 'bg-emerald-100 text-emerald-600'
                    }
                  >
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    message.role === 'user'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  
                  {/* Suggestions */}
                  {message.suggestions && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => setInput(suggestion)}
                          className="text-xs px-3 py-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2"
            >
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className="bg-emerald-100 text-emerald-600">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-3 border-t bg-gray-50">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Mic className="w-4 h-4 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" className="shrink-0">
            <ImageIcon className="w-4 h-4 text-gray-500" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Спроси о здоровье..."
            className="flex-1 bg-white"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="shrink-0 bg-emerald-500 hover:bg-emerald-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
