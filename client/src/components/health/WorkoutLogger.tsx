import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Timer, 
  Plus, 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  MoreHorizontal,
  Flame,
  Heart,
  Clock,
  Dumbbell,
  Pause,
  Play,
  Flag,
  AlertCircle,
  Save,
  Trash2
} from 'lucide-react';
import { useMovementStore, Exercise, WorkoutSet } from '@/stores/modules/movementStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface WorkoutLoggerProps {
  onComplete: () => void;
  onCancel: () => void;
}

// Module color theme
const theme = {
  primary: '#f97316',
  bg: '#fff7ed',
  secondary: '#fdba74',
};

export function WorkoutLogger({ onComplete, onCancel }: WorkoutLoggerProps) {
  const {
    activeWorkout,
    activeWorkoutExercises,
    isWorkoutActive,
    workoutStartTime,
    exercises,
    addExerciseToWorkout,
    addSetToExercise,
    updateSet,
    completeWorkout,
    cancelWorkout,
    formatDuration,
    fetchExercises,
  } = useMovementStore();

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [showExerciseDialog, setShowExerciseDialog] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [feelingRating, setFeelingRating] = useState<number>(5);
  const [notes, setNotes] = useState('');

  // Fetch exercises on mount
  useEffect(() => {
    if (exercises.length === 0) {
      fetchExercises();
    }
  }, [exercises.length, fetchExercises]);

  // Timer effect
  useEffect(() => {
    if (!isWorkoutActive || isPaused) return;

    const interval = setInterval(() => {
      if (workoutStartTime) {
        setElapsedTime(Math.floor((Date.now() - workoutStartTime) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isWorkoutActive, isPaused, workoutStartTime]);

  // Rest timer effect
  useEffect(() => {
    if (restTimer === null || restTimer <= 0) return;

    const interval = setInterval(() => {
      setRestTimer((prev) => {
        if (prev === null || prev <= 1) {
          // Play notification sound or vibration
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [restTimer]);

  const handleAddExercise = (exercise: Exercise) => {
    addExerciseToWorkout(exercise);
    setShowExerciseDialog(false);
    setExpandedExercise(exercise.id);
  };

  const handleAddSet = (exerciseId: string) => {
    const exercise = activeWorkoutExercises.find((e) => e.id === exerciseId);
    const lastSet = exercise?.sets[exercise.sets.length - 1];
    
    const newSet: WorkoutSet = {
      reps: lastSet?.reps || 10,
      weight_kg: lastSet?.weight_kg || 0,
      rpe: lastSet?.rpe || 7,
    };
    
    addSetToExercise(exerciseId, newSet);
  };

  const handleStartRest = (seconds: number) => {
    setRestTimer(seconds);
  };

  const handleComplete = async () => {
    await completeWorkout({
      feeling_rating: feelingRating,
      notes: notes || undefined,
    });
    onComplete();
  };

  const handleCancel = () => {
    if (confirm('Отменить тренировку? Все данные будут потеряны.')) {
      cancelWorkout();
      onCancel();
    }
  };

  if (!isWorkoutActive) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-foreground/30" />
        <p className="text-foreground/60">Тренировка не активна</p>
        <Button className="mt-4" onClick={onCancel}>
          Закрыть
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Workout Header */}
      <Card className="border-2" style={{ borderColor: theme.primary }}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: theme.bg }}
              >
                <Timer className="w-8 h-8" style={{ color: theme.primary }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-mono">
                  {formatDuration(elapsedTime)}
                </h2>
                <p className="text-sm text-foreground/60">
                  {activeWorkout?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <div className="text-center">
              <Dumbbell className="w-4 h-4 mx-auto mb-1 text-foreground/40" />
              <p className="text-lg font-bold">{activeWorkoutExercises.length}</p>
              <p className="text-xs text-foreground/60">Упражнений</p>
            </div>
            <div className="text-center">
              <Flame className="w-4 h-4 mx-auto mb-1 text-foreground/40" />
              <p className="text-lg font-bold">
                {Math.round((elapsedTime / 60) * 6)}
              </p>
              <p className="text-xs text-foreground/60">Ккал (примерно)</p>
            </div>
            <div className="text-center">
              <Flag className="w-4 h-4 mx-auto mb-1 text-foreground/40" />
              <p className="text-lg font-bold">
                {activeWorkoutExercises.reduce((acc, ex) => acc + ex.sets.length, 0)}
              </p>
              <p className="text-xs text-foreground/60">Подходов</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rest Timer */}
      <AnimatePresence>
        {restTimer !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-orange-500 animate-pulse" />
                    <div>
                      <p className="font-medium">Отдых</p>
                      <p className="text-3xl font-bold font-mono text-orange-600">
                        {formatDuration(restTimer)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleStartRest(30)}>
                      +30с
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleStartRest(60)}>
                      +1м
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setRestTimer(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercises List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Упражнения</h3>
          <Dialog open={showExerciseDialog} onOpenChange={setShowExerciseDialog}>
            <DialogTrigger asChild>
              <Button size="sm" style={{ backgroundColor: theme.primary }}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Выберите упражнение</DialogTitle>
              </DialogHeader>
              <ExerciseSelector 
                exercises={exercises} 
                onSelect={handleAddExercise}
              />
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="h-[300px]">
          <div className="space-y-3">
            <AnimatePresence>
              {activeWorkoutExercises.map((exercise, index) => (
                <motion.div
                  key={exercise.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ExerciseLogger
                    exercise={exercise}
                    index={index}
                    isExpanded={expandedExercise === exercise.id}
                    onToggle={() => setExpandedExercise(
                      expandedExercise === exercise.id ? null : exercise.id
                    )}
                    onAddSet={() => handleAddSet(exercise.id)}
                    onUpdateSet={(setIndex, set) => updateSet(exercise.id, setIndex, set)}
                    onStartRest={handleStartRest}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {activeWorkoutExercises.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <Dumbbell className="w-12 h-12 mx-auto mb-3 text-foreground/20" />
            <p className="text-foreground/60">Добавьте первое упражнение</p>
            <Button 
              variant="outline" 
              className="mt-3"
              onClick={() => setShowExerciseDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить
            </Button>
          </div>
        )}
      </div>

      {/* Notes & Rating */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Как себя чувствовали? (1-10)</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
              <Button
                key={rating}
                variant={feelingRating === rating ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => setFeelingRating(rating)}
                style={feelingRating === rating ? { backgroundColor: theme.primary } : {}}
              >
                {rating}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Заметки</label>
          <Input
            placeholder="Дополнительные комментарии..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleCancel}
        >
          <X className="w-4 h-4 mr-2" />
          Отменить
        </Button>
        <Button
          className="flex-[2]"
          style={{ backgroundColor: theme.primary }}
          onClick={handleComplete}
          disabled={activeWorkoutExercises.length === 0}
        >
          <Check className="w-4 h-4 mr-2" />
          Завершить тренировку
        </Button>
      </div>
    </div>
  );
}

// ============================================
// EXERCISE LOGGER COMPONENT
// ============================================

interface ExerciseLoggerProps {
  exercise: any;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onAddSet: () => void;
  onUpdateSet: (setIndex: number, set: WorkoutSet) => void;
  onStartRest: (seconds: number) => void;
}

function ExerciseLogger({
  exercise,
  index,
  isExpanded,
  onToggle,
  onAddSet,
  onUpdateSet,
  onStartRest,
}: ExerciseLoggerProps) {
  const [quickValues, setQuickValues] = useState({ reps: 10, weight: 0 });

  const totalVolume = exercise.sets.reduce((acc: number, set: WorkoutSet) => {
    return acc + ((set.reps || 0) * (set.weight_kg || 0));
  }, 0);

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card className={cn(isExpanded && 'border-orange-300')}>
        <CollapsibleTrigger asChild>
          <CardHeader className="p-4 cursor-pointer hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: theme.bg, color: theme.primary }}
              >
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium">{exercise.exercise_name}</p>
                <p className="text-sm text-foreground/60">
                  {exercise.sets.length} подходов
                  {totalVolume > 0 && ` • ${totalVolume} кг объем`}
                </p>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-foreground/40" />
              ) : (
                <ChevronDown className="w-5 h-5 text-foreground/40" />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="p-4 pt-0">
            {/* Sets Table */}
            <div className="space-y-2 mb-4">
              <div className="grid grid-cols-5 gap-2 text-xs text-foreground/60 font-medium px-2">
                <span>Подход</span>
                <span>Повторы</span>
                <span>Вес (кг)</span>
                <span>RPE</span>
                <span></span>
              </div>
              
              {exercise.sets.map((set: WorkoutSet, setIndex: number) => (
                <SetRow
                  key={setIndex}
                  set={set}
                  setIndex={setIndex}
                  onUpdate={(updatedSet) => onUpdateSet(setIndex, updatedSet)}
                  onComplete={() => onStartRest(exercise.rest_seconds)}
                />
              ))}
            </div>

            {/* Quick Add */}
            <div className="flex gap-2 mb-4">
              <Input
                type="number"
                placeholder="Повторы"
                value={quickValues.reps}
                onChange={(e) => setQuickValues({ ...quickValues, reps: parseInt(e.target.value) || 0 })}
                className="w-20"
              />
              <Input
                type="number"
                placeholder="Вес"
                value={quickValues.weight}
                onChange={(e) => setQuickValues({ ...quickValues, weight: parseFloat(e.target.value) || 0 })}
                className="w-24"
              />
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  onAddSet();
                  setQuickValues({ reps: quickValues.reps, weight: quickValues.weight });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить
              </Button>
            </div>

            {/* Rest Timer Quick Buttons */}
            <div className="flex gap-2">
              <span className="text-sm text-foreground/60 self-center">Отдых:</span>
              {[30, 60, 90, 120].map((seconds) => (
                <Button
                  key={seconds}
                  variant="outline"
                  size="sm"
                  onClick={() => onStartRest(seconds)}
                >
                  {seconds < 60 ? `${seconds}с` : `${seconds / 60}м`}
                </Button>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// ============================================
// SET ROW COMPONENT
// ============================================

function SetRow({ 
  set, 
  setIndex, 
  onUpdate, 
  onComplete 
}: { 
  set: WorkoutSet; 
  setIndex: number; 
  onUpdate: (set: WorkoutSet) => void;
  onComplete: () => void;
}) {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(!isCompleted);
    if (!isCompleted) {
      onComplete();
    }
  };

  return (
    <motion.div 
      className={cn(
        "grid grid-cols-5 gap-2 items-center p-2 rounded-lg transition-colors",
        isCompleted ? "bg-green-50" : "bg-slate-50"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <span className="font-medium text-sm">{setIndex + 1}</span>
      <Input
        type="number"
        value={set.reps || ''}
        onChange={(e) => onUpdate({ ...set, reps: parseInt(e.target.value) || 0 })}
        className="h-8 text-center"
        placeholder="0"
      />
      <Input
        type="number"
        value={set.weight_kg || ''}
        onChange={(e) => onUpdate({ ...set, weight_kg: parseFloat(e.target.value) || 0 })}
        className="h-8 text-center"
        placeholder="0"
        step="0.5"
      />
      <Input
        type="number"
        value={set.rpe || ''}
        onChange={(e) => onUpdate({ ...set, rpe: parseInt(e.target.value) || 0 })}
        className="h-8 text-center"
        placeholder="7"
        min="1"
        max="10"
      />
      <Button
        variant={isCompleted ? 'default' : 'outline'}
        size="icon"
        className="h-8 w-8"
        onClick={handleComplete}
        style={isCompleted ? { backgroundColor: '#22c55e' } : {}}
      >
        <Check className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

// ============================================
// EXERCISE SELECTOR COMPONENT
// ============================================

function ExerciseSelector({ 
  exercises, 
  onSelect 
}: { 
  exercises: Exercise[]; 
  onSelect: (exercise: Exercise) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = 
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ex.name_ru && ex.name_ru.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'strength', 'cardio', 'flexibility', 'mobility'];

  return (
    <div className="space-y-4">
      <Input
        placeholder="Поиск упражнений..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        autoFocus
      />
      
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory(cat)}
            style={selectedCategory === cat ? { backgroundColor: theme.primary } : {}}
          >
            {cat === 'all' ? 'Все' : 
             cat === 'strength' ? 'Сила' :
             cat === 'cardio' ? 'Кардио' :
             cat === 'flexibility' ? 'Гибкость' : 'Мобильность'}
          </Badge>
        ))}
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {filteredExercises.map((exercise) => (
            <button
              key={exercise.id}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-50 border transition-colors"
              onClick={() => onSelect(exercise)}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: theme.bg }}
                >
                  {exercise.category === 'strength' && <Dumbbell className="w-5 h-5" style={{ color: theme.primary }} />}
                  {exercise.category === 'cardio' && <Activity className="w-5 h-5" style={{ color: '#3b82f6' }} />}
                  {exercise.category === 'flexibility' && <span>🧘</span>}
                  {exercise.category === 'mobility' && <span>🤸</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{exercise.name_ru || exercise.name}</p>
                  <p className="text-sm text-foreground/60">
                    {exercise.muscle_groups?.slice(0, 3).join(', ')}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-foreground/30" />
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
