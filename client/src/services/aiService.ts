/**
 * AI Service for EthoLife
 * Supports Gemini and Groq APIs
 */

interface AIRequest {
  message: string;
  context?: {
    healthData?: any;
    userProfile?: any;
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

    if (model === 'gemini' && this.geminiKey) {
      return this.callGemini(message, context);
    } else if (this.groqKey) {
      return this.callGroq(message, context);
    } else {
      return this.mockResponse(message);
    }
  }

  private async callGemini(message: string, context?: any): Promise<AIResponse> {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: this.buildPrompt(message, context) }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1000,
            }
          })
        }
      );

      if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Нет ответа от AI';
      
      return { content: text, suggestions: this.generateSuggestions(message) };
    } catch (error) {
      console.error('Gemini error:', error);
      return this.mockResponse(message);
    }
  }

  private async callGroq(message: string, context?: any): Promise<AIResponse> {
    try {
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
              content: 'Ты AI-помощник приложения EthoLife, специализирующийся на здоровье. Давай краткие, конкретные ответы с эмодзи.'
            },
            { role: 'user', content: this.buildPrompt(message, context) }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (!response.ok) throw new Error(`Groq API error: ${response.status}`);

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content || 'Нет ответа от AI';

      return { content: text, suggestions: this.generateSuggestions(message) };
    } catch (error) {
      console.error('Groq error:', error);
      return this.mockResponse(message);
    }
  }

  private buildPrompt(message: string, context?: any): string {
    let prompt = `Пользователь: "${message}"\n\n`;
    
    if (context?.healthData) {
      const scores = context.healthData.module_scores;
      prompt += `Health Score: ${scores?.overall || 'N/A'}/100\n`;
      prompt += `Модули: Питание ${scores?.nutrition || 0}%, Движение ${scores?.movement || 0}%\n\n`;
    }
    
    return prompt + `Дай полезный ответ с конкретными рекомендациями.`;
  }

  private mockResponse(message: string): AIResponse {
    const lower = message.toLowerCase();
    
    if (lower.includes('сон')) {
      return {
        content: `💤 Советы для сна:\n\n1️⃣ Ложись в одно время\n2️⃣ Не кофеин после 16:00\n3️⃣ Экраны за час до сна\n4️⃣ Прохладная комната (18-20°)`,
        suggestions: ["План сна", "Трекер", "Техники", "Назад"]
      };
    }
    
    if (lower.includes('питание') || lower.includes('еда')) {
      return {
        content: `🥗 Питание:\n\n• Белки: 1.6-2г/кг веса\n• Жиры: 25-35% калорий\n• Вода: 2-3 литра/день\n• Разнообразие овощей`,
        suggestions: ["Расчет нормы", "Меню", "Трекер", "Назад"]
      };
    }
    
    return {
      content: `Привет! 👋 Я AI-помощник EthoLife.\n\nМогу помочь с:\n• 🍎 Питанием\n• 🏃 Тренировками\n• 😴 Сном\n• 🧠 Настроением`,
      suggestions: ["Питание", "Тренировки", "Сон", "Настроение"]
    };
  }

  private generateSuggestions(msg: string): string[] {
    if (msg.includes('сон')) return ["План сна", "Трекер", "Техники", "Назад"];
    if (msg.includes('питание')) return ["Расчет нормы", "Меню", "Трекер", "Назад"];
    if (msg.includes('тренировк')) return ["План", "Упражнения", "Трекер", "Назад"];
    return ["Питание", "Тренировки", "Сон", "Настроение"];
  }
}

export const aiService = new AIService();
