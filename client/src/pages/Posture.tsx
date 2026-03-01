import { PostureTracker } from '@/components/PostureTracker';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Camera, Bell, Dumbbell, Info } from 'lucide-react';

export default function PosturePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Коррекция осанки
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            AI-powered трекер осанки с использованием камеры. Отслеживает положение шеи, 
            плеч и спины в реальном времени с рекомендациями и напоминаниями.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg">
                <Camera className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-sm">AI Vision</p>
                <p className="text-xs text-gray-500">MediaPipe</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Real-time</p>
                <p className="text-xs text-gray-500">30 FPS</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">
                <Bell className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Alerts</p>
                <p className="text-xs text-gray-500">Sound + Visual</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Dumbbell className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Exercises</p>
                <p className="text-xs text-gray-500">Video guides</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tracker */}
        <PostureTracker />

        {/* Privacy Notice */}
        <Card className="mt-8 bg-amber-50 dark:bg-amber-900/20 border-amber-200">
          <CardContent className="p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">Приватность</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Все данные обрабатываются локально в браузере. Видео не отправляется 
                на сервер и не сохраняется. Требуется разрешение на доступ к камере.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
