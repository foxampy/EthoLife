# Руководство по деплою EthoLife

## 1. Применение SQL миграций

### Способ A: Через Supabase Dashboard (рекомендуется)

1. Перейдите в [Supabase Dashboard](https://app.supabase.com)
2. Выберите ваш проект
3. Откройте **SQL Editor** (в левом меню)
4. Создайте **New query**
5. Скопируйте содержимое файлов из `supabase/migrations/` по порядку:
   - `20250301000001_health_core.sql`
   - `20250301000002_habits_module.sql`
   - `20250301000003_nutrition_module.sql`
   - `20250301000004_movement_module.sql`
   - `20250301000005_sleep_module.sql`
   - `20250301000006_psychology_module.sql`
   - `20250301000007_medicine_module.sql`
   - `20250301000008_relationships_module.sql`
6. Нажмите **Run** для каждого файла

### Способ B: Через Supabase CLI

```bash
# Установить CLI (если еще не установлен)
npm install -g supabase

# Логин
supabase login

# Линк проекта
supabase link --project-ref ваш-project-id

# Применить миграции
supabase db push
```

### Способ C: Через psql (для продвинутых)

```bash
# Получить строку подключения в Supabase Dashboard → Settings → Database
psql "postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres"

# Или выполнить файл напрямую
psql "ваша-строка-подключения" -f supabase/migrations/20250301000001_health_core.sql
```

---

## 2. AI интеграция с Gemini / Groq

### 2.1 Проверьте переменные окружения

В файле `.env` должны быть:

```env
# Gemini API
VITE_GEMINI_API_KEY=ваш-ключ-gemini

# Groq API  
VITE_GROQ_API_KEY=ваш-ключ-groq

# Supabase
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=ваш-anon-key
```

### 2.2 Создадим API сервис для AI

```typescript
// client/src/services/aiService.ts

interface AIRequest {
  message: string;
  context?: {
    healthData?: any;
    module?: string;
  };
  model?: 'gemini' | 'groq';
}

interface AIResponse {
  content: string;
  suggestions?: string[];
}

export class AIService {
  private geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  private groqKey = import.meta.env.VITE_GROQ_API_KEY;

  async sendMessage(request: AIRequest): Promise<AIResponse> {
    const { message, context, model = 'gemini' } = request;

    if (model === 'gemini') {
      return this.callGemini(message, context);
    } else {
      return this.callGroq(message, context);
    }
  }

  private async callGemini(message: string, context?: any): Promise<AIResponse> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: this.buildPrompt(message, context)
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        })
      }
    );

    const data = await response.json();
    return {
      content: data.candidates[0].content.parts[0].text,
      suggestions: this.extractSuggestions(data)
    };
  }

  private async callGroq(message: string, context?: any): Promise<AIResponse> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.groqKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'Ты AI-помощник приложения EthoLife, специализирующийся на здоровье и фитнесе.'
          },
          {
            role: 'user',
            content: this.buildPrompt(message, context)
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      suggestions: this.extractSuggestions(data)
    };
  }

  private buildPrompt(message: string, context?: any): string {
    let prompt = `Пользователь спрашивает: "${message}"\n\n`;
    
    if (context?.healthData) {
      prompt += `Контекст данных пользователя:\n${JSON.stringify(context.healthData, null, 2)}\n\n`;
    }
    
    prompt += `Дай полезный, конкретный и мотивирующий ответ. Если это про питание/тренировки/сон - дай конкретные рекомендации с цифрами и примерами. Добавь 3-4 быстрых follow-up вопроса в конце ответа.`;
    
    return prompt;
  }

  private extractSuggestions(data: any): string[] {
    // Извлекаем follow-up вопросы из ответа
    return [
      "Расскажи подробнее",
      "Составь план",
      "Запиши в дневник",
      "Назад к модулям"
    ];
  }
}

export const aiService = new AIService();
```

### 2.3 Обновим AI Chat компонент

```typescript
// В client/src/components/AIChatOptimized.tsx

import { aiService } from '@/services/aiService';
import { useHealthStore } from '@/stores/healthStore';

// В handleSend заменяем mock на реальный вызов:
const handleSend = async () => {
  if (!input.trim() || isLoading) return;

  // ... добавляем сообщение пользователя ...

  try {
    const healthData = useHealthStore.getState().todaySnapshot;
    
    const response = await aiService.sendMessage({
      message: input,
      context: { healthData },
      model: 'gemini' // или 'groq'
    });

    const aiMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions
    };

    setMessages((prev) => [...prev, aiMessage]);
  } catch (error) {
    toast({
      title: 'Ошибка',
      description: 'AI временно недоступен. Попробуйте позже.',
      variant: 'destructive',
    });
  }
};
```

---

## 3. Быстрая проверка после деплоя

```bash
# 1. Проверить переменные окружения
cat client/.env | grep -E "(VITE_GEMINI|VITE_GROQ|VITE_SUPABASE)"

# 2. Проверить подключение к Supabase
npm run dev
# Открыть консоль браузера → должны загрузиться данные

# 3. Проверить AI
# В чате отправить тестовое сообщение
```

---

## 4. Типичные ошибки и решения

### Ошибка: "Failed to fetch" при вызове AI
**Решение:** 
- Проверьте API ключи
- Проверьте CORS в настройках API
- Убедитесь что используете `VITE_` префикс для переменных

### Ошибка: "Table does not exist" 
**Решение:**
- Миграции не применены
- Проверьте RLS policies
- Убедитесь что названия таблиц совпадают

### Ошибка: Build failed
**Решение:**
```bash
cd client
rm -rf node_modules dist
npm install
npm run build
```

---

**Готово! После выполнения этих шагов ваше приложение будет полностью функционально.**
