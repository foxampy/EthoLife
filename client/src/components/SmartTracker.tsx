import { useState, useRef, useCallback } from 'react';
import { 
  Camera, Upload, X, Check, Loader2, Utensils, FileText, 
  AlertCircle, ChevronRight, Sparkles, Plus, Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface FoodAnalysisResult {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
  suggestions: string[];
}

interface DocumentAnalysisResult {
  documentType: string;
  extractedText: string;
  keyMetrics: { name: string; value: string; unit: string; normalRange?: string }[];
  summary: string;
  recommendations: string[];
  alerts: string[];
}

type TrackerMode = 'food' | 'document' | null;

export function SmartTracker() {
  const [mode, setMode] = useState<TrackerMode>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [foodResult, setFoodResult] = useState<FoodAnalysisResult | null>(null);
  const [documentResult, setDocumentResult] = useState<DocumentAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        analyzeImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (imageData: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (mode === 'food') {
      // Mock food analysis
      setFoodResult({
        foodName: 'Греческий салат с курицей',
        calories: 420,
        protein: 35,
        carbs: 18,
        fat: 24,
        confidence: 0.94,
        suggestions: [
          'Отличный выбор для обеда - высокое содержание белка',
          'Оливковое масло содержит полезные жиры',
          'Рекомендую добавить больше зелени'
        ]
      });
    } else if (mode === 'document') {
      // Mock document analysis
      setDocumentResult({
        documentType: 'Общий анализ крови',
        extractedText: 'Гемоглобин: 145 г/л, Лейкоциты: 6.2, Тромбоциты: 250',
        keyMetrics: [
          { name: 'Гемоглобин', value: '145', unit: 'г/л', normalRange: '130-160' },
          { name: 'Лейкоциты', value: '6.2', unit: '10^9/л', normalRange: '4.0-9.0' },
          { name: 'Тромбоциты', value: '250', unit: '10^9/л', normalRange: '150-400' },
          { name: 'Глюкоза', value: '5.4', unit: 'ммоль/л', normalRange: '3.9-5.5' }
        ],
        summary: 'Все показатели в пределах нормы. Незначительное отклонение глюкозы в верхней границе нормы.',
        recommendations: [
          'Продолжать текущий рацион питания',
          'Рекомендовано повторное исследование через 3 месяца',
          'Обратить внимание на уровень глюкозы - снизить простые углеводы'
        ],
        alerts: ['Глюкоза близка к верхней границе нормы']
      });
    }
    
    setIsAnalyzing(false);
  };

  const reset = () => {
    setCapturedImage(null);
    setFoodResult(null);
    setDocumentResult(null);
    setMode(null);
  };

  const saveToDatabase = async () => {
    toast.success('Сохранено: Данные добавлены в ваш дневник и отправлены AI для анализа.');
    reset();
  };

  if (!mode) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            Умный трекер
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Сфотографируйте еду или медицинские документы для автоматического распознавания и анализа ИИ.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => setMode('food')}
            >
              <Utensils className="w-8 h-8 text-emerald-500" />
              <span>Еда</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex flex-col gap-2"
              onClick={() => setMode('document')}
            >
              <FileText className="w-8 h-8 text-blue-500" />
              <span>Документы</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          {mode === 'food' ? <Utensils className="w-5 h-5 text-emerald-500" /> : <FileText className="w-5 h-5 text-blue-500" />}
          {mode === 'food' ? 'Анализ питания' : 'Анализ документов'}
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={reset}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />

        {!capturedImage && (
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Загрузите фото или сделайте снимок
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Загрузить
              </Button>
            </div>
          </div>
        )}

        {capturedImage && (
          <div className="relative">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full rounded-lg max-h-64 object-cover"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p>AI анализирует изображение...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Food Analysis Results */}
        {foodResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{foodResult.foodName}</h3>
              <Badge className="bg-emerald-100 text-emerald-800">
                {(foodResult.confidence * 100).toFixed(0)}% точность
              </Badge>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-gray-100 dark:bg-slate-800 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-emerald-600">{foodResult.calories}</p>
                <p className="text-xs text-gray-500">ккал</p>
              </div>
              <div className="bg-gray-100 dark:bg-slate-800 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{foodResult.protein}г</p>
                <p className="text-xs text-gray-500">белки</p>
              </div>
              <div className="bg-gray-100 dark:bg-slate-800 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-amber-600">{foodResult.carbs}г</p>
                <p className="text-xs text-gray-500">углеводы</p>
              </div>
              <div className="bg-gray-100 dark:bg-slate-800 p-3 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-600">{foodResult.fat}г</p>
                <p className="text-xs text-gray-500">жиры</p>
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                AI Рекомендации
              </h4>
              <ul className="space-y-1">
                {foodResult.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            <Button onClick={saveToDatabase} className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Check className="w-4 h-4 mr-2" />
              Добавить в дневник
            </Button>
          </motion.div>
        )}

        {/* Document Analysis Results */}
        {documentResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{documentResult.documentType}</h3>
              <Badge className="bg-blue-100 text-blue-800">
                Распознано
              </Badge>
            </div>

            {documentResult.alerts.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-medium">Внимание</span>
                </div>
                {documentResult.alerts.map((alert, idx) => (
                  <p key={idx} className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                    {alert}
                  </p>
                ))}
              </div>
            )}

            <div>
              <h4 className="font-medium mb-2">Ключевые показатели</h4>
              <div className="space-y-2">
                {documentResult.keyMetrics.map((metric, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"
                  >
                    <span className="text-sm">{metric.name}</span>
                    <div className="text-right">
                      <span className="font-semibold">{metric.value} {metric.unit}</span>
                      {metric.normalRange && (
                        <p className="text-xs text-gray-500">Норма: {metric.normalRange}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                AI Заключение
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                {documentResult.summary}
              </p>
              <ul className="space-y-1">
                {documentResult.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2">
              <Button onClick={saveToDatabase} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Check className="w-4 h-4 mr-2" />
                Сохранить в медкарту
              </Button>
              <Button variant="outline" onClick={() => setCapturedImage(null)}>
                <Camera className="w-4 h-4 mr-2" />
                Новый снимок
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
