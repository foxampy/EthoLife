import { useEffect, useRef, useState, useCallback } from 'react';
import { Pose, POSE_CONNECTIONS, Results } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { 
  Camera as CameraIcon, Play, Square, Settings, AlertTriangle,
  Volume2, VolumeX, Monitor, Chair, ArrowUp, ArrowDown,
  CheckCircle2, XCircle, Info, Dumbbell, Clock, ChevronRight,
  Sparkles, Activity, AlertOctagon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Exercise data with YouTube links and instructions
const exercises = {
  sitting: [
    {
      id: 'neck-stretch',
      name: 'Растяжка шеи',
      duration: 60,
      description: 'Медленно наклоняйте голову вправо, лево, вперед и назад',
      youtubeUrl: 'https://www.youtube.com/watch?v=s-7lyvblFCU',
      imageUrl: '/exercises/neck-stretch.jpg',
      forConditions: ['neck_pain', 'tension', 'headaches']
    },
    {
      id: 'shoulder-rolls',
      name: 'Вращение плечами',
      duration: 45,
      description: 'Медленные круговые движения плечами вперед и назад',
      youtubeUrl: 'https://www.youtube.com/watch?v=K8SRqP1_irk',
      imageUrl: '/exercises/shoulder-rolls.jpg',
      forConditions: ['shoulder_pain', 'tension', 'poor_posture']
    },
    {
      id: 'spinal-twist',
      name: 'Скручивание позвоночника',
      duration: 90,
      description: 'Сидя, повернитесь вправо, обхватив спинку стула',
      youtubeUrl: 'https://www.youtube.com/watch?v=8K8QH6P5yXw',
      imageUrl: '/exercises/spinal-twist.jpg',
      forConditions: ['back_pain', 'stiffness', 'poor_posture']
    },
    {
      id: 'wrist-stretch',
      name: 'Растяжка запястий',
      duration: 45,
      description: 'Вытяните руку, оттягивайте пальцы к себе и от себя',
      youtubeUrl: 'https://www.youtube.com/watch?v=1E5b6xuoYLU',
      imageUrl: '/exercises/wrist-stretch.jpg',
      forConditions: ['wrist_pain', 'carpal_tunnel', 'typing']
    }
  ],
  standing: [
    {
      id: 'wall-angel',
      name: 'Стеновые ангелы',
      duration: 60,
      description: 'Станьте спиной к стене, поднимайте руки вверх и вниз',
      youtubeUrl: 'https://www.youtube.com/watch?v=4qytI6fJh8Y',
      imageUrl: '/exercises/wall-angel.jpg',
      forConditions: ['poor_posture', 'rounded_shoulders', 'neck_pain']
    },
    {
      id: 'hip-flexor',
      name: 'Растяжка подвздошных мышц',
      duration: 90,
      description: 'Выпад одной ногой назад, таз вперед',
      youtubeUrl: 'https://www.youtube.com/watch?v=6XS3DM7Y-7g',
      imageUrl: '/exercises/hip-flexor.jpg',
      forConditions: ['lower_back_pain', 'hip_tightness', 'sitting']
    },
    {
      id: 'chest-opener',
      name: 'Раскрытие грудной клетки',
      duration: 60,
      description: 'Сцепите руки за спиной, раскрывайте грудь',
      youtubeUrl: 'https://www.youtube.com/watch?v=DXw9lB3g01U',
      imageUrl: '/exercises/chest-opener.jpg',
      forConditions: ['rounded_shoulders', 'poor_posture', 'breathing']
    }
  ],
  mat: [
    {
      id: 'cat-cow',
      name: 'Кошка-Корова',
      duration: 90,
      description: 'На четвереньках, прогибайте и округляйте спину',
      youtubeUrl: 'https://www.youtube.com/watch?v=kqnua4rHVVA',
      imageUrl: '/exercises/cat-cow.jpg',
      forConditions: ['back_pain', 'spinal_mobility', 'stiffness']
    },
    {
      id: 'child-pose',
      name: 'Поза ребенка',
      duration: 120,
      description: 'Сядьте на пятки, вытяните руки вперед, расслабьтесь',
      youtubeUrl: 'https://www.youtube.com/watch?v=qYvYsFrTI0U',
      imageUrl: '/exercises/child-pose.jpg',
      forConditions: ['back_pain', 'stress', 'relaxation']
    },
    {
      id: 'cobra',
      name: 'Поза кобры',
      duration: 60,
      description: 'Лежа на животе, поднимайте верхнюю часть тела',
      youtubeUrl: 'https://www.youtube.com/watch?v=z21McHHOpAg',
      imageUrl: '/exercises/cobra.jpg',
      forConditions: ['lower_back_pain', 'core_strength', 'posture']
    },
    {
      id: 'thread-needle',
      name: 'Нить в игольном ушке',
      duration: 90,
      description: 'На четвереньках, просуньте одну руку под другую',
      youtubeUrl: 'https://www.youtube.com/watch?v=8qXbZ3J1F9w',
      imageUrl: '/exercises/thread-needle.jpg',
      forConditions: ['thoracic_mobility', 'shoulder_tension', 'stiffness']
    }
  ]
};

interface PostureData {
  neckAngle: number;
  shoulderLevel: number;
  backAngle: number;
  isGoodPosture: boolean;
  timestamp: number;
}

interface AlertSettings {
  soundEnabled: boolean;
  visualEnabled: boolean;
  interval: number; // seconds
  neckThreshold: number;
  shoulderThreshold: number;
  backThreshold: number;
}

export function PostureTracker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  
  const [isTracking, setIsTracking] = useState(false);
  const [postureData, setPostureData] = useState<PostureData | null>(null);
  const [alertCount, setAlertCount] = useState(0);
  const [lastAlertTime, setLastAlertTime] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedExerciseType, setSelectedExerciseType] = useState<'sitting' | 'standing' | 'mat'>('sitting');
  const [userConditions, setUserConditions] = useState<string[]>(['poor_posture']);
  
  const [settings, setSettings] = useState<AlertSettings>({
    soundEnabled: true,
    visualEnabled: true,
    interval: 30,
    neckThreshold: 15, // degrees from vertical
    shoulderThreshold: 5, // degrees difference between shoulders
    backThreshold: 10 // degrees from vertical
  });

  // Calculate angle between three points
  const calculateAngle = (a: any, b: any, c: any): number => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
  };

  // Analyze posture from pose landmarks
  const analyzePosture = useCallback((landmarks: any[]): PostureData => {
    // Key landmarks
    const nose = landmarks[0];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftEar = landmarks[7];
    const rightEar = landmarks[8];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    // Calculate neck angle (vertical alignment)
    const neckAngle = calculateAngle(
      { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 },
      { x: (leftEar.x + rightEar.x) / 2, y: (leftEar.y + rightEar.y) / 2 },
      { x: (leftEar.x + rightEar.x) / 2, y: 0 }
    );

    // Calculate shoulder level difference
    const shoulderLevel = Math.abs(leftShoulder.y - rightShoulder.y) * 100;

    // Calculate back angle (spine alignment)
    const backAngle = calculateAngle(
      { x: (leftHip.x + rightHip.x) / 2, y: (leftHip.y + rightHip.y) / 2 },
      { x: (leftShoulder.x + rightShoulder.x) / 2, y: (leftShoulder.y + rightShoulder.y) / 2 },
      { x: (leftShoulder.x + rightShoulder.x) / 2, y: 0 }
    );

    // Determine if posture is good
    const isGoodPosture = 
      neckAngle < settings.neckThreshold &&
      shoulderLevel < settings.shoulderThreshold &&
      backAngle < settings.backThreshold;

    return {
      neckAngle: Math.round(neckAngle),
      shoulderLevel: Math.round(shoulderLevel),
      backAngle: Math.round(backAngle),
      isGoodPosture,
      timestamp: Date.now()
    };
  }, [settings]);

  // Trigger alert
  const triggerAlert = useCallback(() => {
    const now = Date.now();
    if (now - lastAlertTime < settings.interval * 1000) return;

    setAlertCount(prev => prev + 1);
    setLastAlertTime(now);

    if (settings.soundEnabled) {
      const audio = new Audio('/alert-sound.mp3');
      audio.play().catch(() => {});
    }

    toast.warning('Исправьте осанку!', {
      description: 'Ваше положение тела неоптимально',
      duration: 5000
    });
  }, [lastAlertTime, settings.interval, settings.soundEnabled]);

  // Initialize MediaPipe Pose
  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    pose.onResults((results: Results) => {
      if (!canvasRef.current || !videoRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw video frame
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.poseLandmarks) {
        // Draw landmarks
        drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: '#00FF00',
          lineWidth: 2
        });
        drawLandmarks(ctx, results.poseLandmarks, {
          color: '#FF0000',
          lineWidth: 1,
          radius: 3
        });

        // Analyze posture
        const data = analyzePosture(results.poseLandmarks);
        setPostureData(data);

        // Trigger alert if bad posture
        if (!data.isGoodPosture && isTracking) {
          triggerAlert();
        }
      }

      ctx.restore();
    });

    poseRef.current = pose;

    return () => {
      pose.close();
    };
  }, [analyzePosture, triggerAlert, isTracking]);

  // Start/Stop camera
  const toggleTracking = async () => {
    if (isTracking) {
      cameraRef.current?.stop();
      setIsTracking(false);
      toast.info('Отслеживание остановлено');
    } else {
      if (!videoRef.current || !poseRef.current) return;

      try {
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            await poseRef.current?.send({ image: videoRef.current! });
          },
          width: 640,
          height: 480
        });

        await camera.start();
        cameraRef.current = camera;
        setIsTracking(true);
        toast.success('Отслеживание запущено');
      } catch (error) {
        toast.error('Ошибка доступа к камере');
        console.error(error);
      }
    }
  };

  // Get recommended exercises based on user conditions
  const getRecommendedExercises = () => {
    const typeExercises = exercises[selectedExerciseType];
    return typeExercises.filter(ex => 
      ex.forConditions.some(condition => userConditions.includes(condition))
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Tracking Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-500" />
                AI Трекер осанки
              </CardTitle>
              <CardDescription>
                Отслеживание положения тела в реальном времени
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Настройки
              </Button>
              <Button
                variant={isTracking ? 'destructive' : 'default'}
                size="sm"
                onClick={toggleTracking}
                className={isTracking ? '' : 'bg-emerald-600 hover:bg-emerald-700'}
              >
                {isTracking ? (
                  <><Square className="w-4 h-4 mr-2" /> Стоп</>
                ) : (
                  <><Play className="w-4 h-4 mr-2" /> Старт</>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Video Preview */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video mb-4">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
              playsInline
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
              width={640}
              height={480}
            />
            {!isTracking && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center text-white">
                  <CameraIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Нажмите Старт для отслеживания</p>
                </div>
              </div>
            )}
            
            {/* Posture Status Overlay */}
            {isTracking && postureData && (
              <div className="absolute top-4 left-4 space-y-2">
                <Badge className={postureData.isGoodPosture ? 'bg-green-500' : 'bg-red-500'}>
                  {postureData.isGoodPosture ? '✓ Хорошая осанка' : '✗ Исправьте осанку'}
                </Badge>
                <div className="bg-black/70 text-white text-xs p-2 rounded space-y-1">
                  <p>Шея: {postureData.neckAngle}°</p>
                  <p>Плечи: {postureData.shoulderLevel}%</p>
                  <p>Спина: {postureData.backAngle}°</p>
                </div>
              </div>
            )}

            {/* Alert Count */}
            {alertCount > 0 && (
              <div className="absolute top-4 right-4">
                <Badge variant="destructive" className="text-sm">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {alertCount} нарушений
                </Badge>
              </div>
            )}
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg space-y-4">
                  <h4 className="font-medium">Настройки алертов</h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Звуковой сигнал</span>
                        <Switch
                          checked={settings.soundEnabled}
                          onCheckedChange={(checked) => 
                            setSettings(s => ({ ...s, soundEnabled: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Визуальный сигнал</span>
                        <Switch
                          checked={settings.visualEnabled}
                          onCheckedChange={(checked) => 
                            setSettings(s => ({ ...s, visualEnabled: checked }))
                          }
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm">Интервал алертов (сек)</span>
                        <Slider
                          value={[settings.interval]}
                          onValueChange={([value]) => 
                            setSettings(s => ({ ...s, interval: value }))
                          }
                          min={10}
                          max={300}
                          step={10}
                        />
                        <span className="text-xs text-gray-500">{settings.interval} сек</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Workspace Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-blue-500" />
            Рекомендации по рабочему месту
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Monitor className="w-8 h-8 text-blue-500 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-1">Монитор</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• На уровне глаз или чуть ниже</li>
                  <li>• Расстояние 50-70 см</li>
                  <li>• Верх экрана на 10-15° ниже взгляда</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Chair className="w-8 h-8 text-green-500 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-1">Стул</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Высота: стопы на полу</li>
                  <li>• Угол коленей 90-110°</li>
                  <li>• Поясная поддержка</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <ArrowUp className="w-8 h-8 text-amber-500 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-1">Положение</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Спина прямая</li>
                  <li>• Плечи расправлены</li>
                  <li>• Шея не наклонена вперед</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-purple-500" />
              Рекомендуемые разминки
            </CardTitle>
            <Select
              value={selectedExerciseType}
              onValueChange={(v) => setSelectedExerciseType(v as any)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sitting">Сидя</SelectItem>
                <SelectItem value="standing">Стоя</SelectItem>
                <SelectItem value="mat">С ковриком</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardDescription>
            Выберите упражнения в зависимости от ваших жалоб и доступного времени
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {getRecommendedExercises().map((exercise) => (
              <Card key={exercise.id} className="overflow-hidden">
                <div className="flex">
                  <div className="w-24 bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{exercise.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Clock className="w-4 h-4" />
                          {exercise.duration} сек
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {exercise.description}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(exercise.youtubeUrl, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Видео
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {getRecommendedExercises().length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Info className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Выберите тип упражнений для просмотра рекомендаций</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
