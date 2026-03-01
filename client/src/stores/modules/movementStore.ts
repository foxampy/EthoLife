import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { useHealthStore } from '../healthStore';

// ============================================
// TYPES
// ============================================

export type WorkoutType = 'cardio' | 'strength' | 'hiit' | 'yoga' | 'pilates' | 'running' | 'cycling' | 'swimming' | 'walking' | 'hiking' | 'sports' | 'martial_arts' | 'dance' | 'other';
export type ExerciseCategory = 'cardio' | 'strength' | 'flexibility' | 'balance' | 'plyometrics' | 'mobility';
export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type EquipmentType = 'none' | 'dumbbells' | 'barbell' | 'kettlebell' | 'machine' | 'cable' | 'bodyweight';
export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';

export interface Exercise {
  id: string;
  name: string;
  name_ru?: string;
  category: ExerciseCategory;
  muscle_groups: MuscleGroup[];
  equipment: EquipmentType[];
  difficulty: ExerciseDifficulty;
  instructions: string[];
  video_url?: string;
  image_url?: string;
  met_value?: number;
  calories_per_hour?: number;
  is_verified: boolean;
  tags: string[];
}

export interface WorkoutSet {
  reps?: number;
  weight_kg?: number;
  duration_seconds?: number;
  distance_meters?: number;
  rpe?: number;
  notes?: string;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id?: string;
  exercise_name: string;
  order_index: number;
  notes?: string;
  rest_seconds: number;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  user_id: string;
  workout_type: WorkoutType;
  name?: string;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  calories_burned?: number;
  heart_rate_avg?: number;
  heart_rate_max?: number;
  heart_rate_min?: number;
  notes?: string;
  feeling_rating?: number;
  rpe?: number;
  is_planned: boolean;
  exercises?: WorkoutExercise[];
  created_at: string;
}

export interface DailyActivity {
  id: string;
  user_id: string;
  date: string;
  steps: number;
  distance_meters: number;
  calories_burned: number;
  active_minutes: number;
  floors_climbed: number;
  source: 'manual' | 'phone' | 'wearable' | 'mixed';
  is_goal_achieved: boolean;
}

export interface Program {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  goal?: string;
  difficulty?: ExerciseDifficulty;
  duration_weeks: number;
  days_per_week: number;
  equipment_needed: string[];
  is_ai_generated: boolean;
  is_public: boolean;
  likes_count: number;
  weeks: any[];
  created_at: string;
}

export interface PlannedWorkout {
  id: string;
  user_id: string;
  program_id?: string;
  name: string;
  scheduled_date: string;
  scheduled_time?: string;
  workout_type: WorkoutType;
  estimated_duration_minutes?: number;
  estimated_calories?: number;
  exercises: any[];
  is_completed: boolean;
  reminder_enabled: boolean;
}

export interface PersonalRecord {
  id: string;
  exercise_id?: string;
  exercise_name?: string;
  pr_type: 'weight' | 'reps' | 'distance' | 'time' | 'speed' | 'power' | 'volume';
  value: number;
  unit: string;
  achieved_at: string;
  improvement_percent?: number;
}

export interface RecoveryStatus {
  recovery_score: number;
  readiness_to_train: 'low' | 'moderate' | 'high' | 'optimal';
  recommended_intensity: 'rest' | 'light' | 'moderate' | 'hard' | 'max';
  muscle_groups_fatigue: Record<string, number>;
  ai_recommendation?: string;
}

export interface WeeklyProgress {
  date: string;
  steps: number;
  calories: number;
  activeMinutes: number;
  workouts: number;
}

export interface TodayActivity {
  steps: number;
  calories: number;
  activeMinutes: number;
  distance: number;
  stepGoal: number;
  calorieGoal: number;
  activeMinutesGoal: number;
  isGoalAchieved: boolean;
}

// ============================================
// STORE STATE
// ============================================

interface MovementState {
  // Data
  exercises: Exercise[];
  workouts: Workout[];
  todayActivity: TodayActivity;
  weeklyProgress: WeeklyProgress[];
  programs: Program[];
  plannedWorkouts: PlannedWorkout[];
  personalRecords: PersonalRecord[];
  recoveryStatus: RecoveryStatus | null;
  
  // Active workout state
  activeWorkout: Workout | null;
  activeWorkoutExercises: WorkoutExercise[];
  isWorkoutActive: boolean;
  workoutStartTime: number | null;
  
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  fetchExercises: (category?: ExerciseCategory) => Promise<void>;
  fetchWorkouts: (limit?: number) => Promise<void>;
  fetchTodayActivity: () => Promise<void>;
  fetchWeeklyProgress: () => Promise<void>;
  fetchPrograms: () => Promise<void>;
  fetchPlannedWorkouts: () => Promise<void>;
  fetchPersonalRecords: () => Promise<void>;
  
  // Mutations
  updateDailyActivity: (data: Partial<DailyActivity>) => Promise<void>;
  startWorkout: (type: WorkoutType, name?: string) => Promise<void>;
  addExerciseToWorkout: (exercise: Exercise) => Promise<void>;
  addSetToExercise: (exerciseId: string, set: WorkoutSet) => Promise<void>;
  updateSet: (exerciseId: string, setIndex: number, set: WorkoutSet) => Promise<void>;
  completeWorkout: (data?: Partial<Workout>) => Promise<void>;
  cancelWorkout: () => void;
  logWorkout: (workout: Partial<Workout>, exercises: Partial<WorkoutExercise>[]) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
  createProgram: (program: Partial<Program>) => Promise<void>;
  
  // Calculations
  calculateCaloriesBurned: (exercise: Exercise, durationMinutes: number, userWeightKg?: number) => number;
  getWeeklyProgress: () => WeeklyProgress[];
  getTodayProgress: () => { steps: number; goal: number; percentage: number };
  formatDuration: (seconds: number) => string;
  getWorkoutTypeIcon: (type: WorkoutType) => string;
  getMuscleGroupColor: (group: MuscleGroup) => string;
}

const defaultTodayActivity: TodayActivity = {
  steps: 0,
  calories: 0,
  activeMinutes: 0,
  distance: 0,
  stepGoal: 10000,
  calorieGoal: 500,
  activeMinutesGoal: 60,
  isGoalAchieved: false,
};

const defaultRecoveryStatus: RecoveryStatus = {
  recovery_score: 75,
  readiness_to_train: 'moderate',
  recommended_intensity: 'moderate',
  muscle_groups_fatigue: {
    chest: 30,
    back: 40,
    legs: 20,
    shoulders: 35,
    arms: 25,
    core: 15,
  },
};

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useMovementStore = create<MovementState>()(
  persist(
    (set, get) => ({
      exercises: [],
      workouts: [],
      todayActivity: defaultTodayActivity,
      weeklyProgress: [],
      programs: [],
      plannedWorkouts: [],
      personalRecords: [],
      recoveryStatus: defaultRecoveryStatus,
      activeWorkout: null,
      activeWorkoutExercises: [],
      isWorkoutActive: false,
      workoutStartTime: null,
      isLoading: false,
      isInitialized: false,

      // ============================================
      // INITIALIZATION
      // ============================================
      
      initialize: async () => {
        const { 
          fetchExercises, 
          fetchWorkouts, 
          fetchTodayActivity, 
          fetchWeeklyProgress,
          fetchPrograms,
          fetchPlannedWorkouts,
        } = get();
        
        set({ isLoading: true });
        
        try {
          await Promise.all([
            fetchExercises(),
            fetchWorkouts(10),
            fetchTodayActivity(),
            fetchWeeklyProgress(),
            fetchPrograms(),
            fetchPlannedWorkouts(),
          ]);
          set({ isInitialized: true });
        } catch (error) {
          console.error('Error initializing movement store:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      // ============================================
      // FETCH ACTIONS
      // ============================================
      
      fetchExercises: async (category) => {
        try {
          let query = supabase
            .from('movement_exercises')
            .select('*')
            .eq('is_verified', true)
            .order('name');
          
          if (category) {
            query = query.eq('category', category);
          }
          
          const { data, error } = await query;
          
          if (error) throw error;
          set({ exercises: data || [] });
        } catch (error) {
          console.error('Error fetching exercises:', error);
        }
      },

      fetchWorkouts: async (limit = 10) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('movement_workouts')
            .select(`
              *,
              exercises:movement_workout_exercises(*)
            `)
            .eq('user_id', user.id)
            .order('start_time', { ascending: false })
            .limit(limit);

          if (error) throw error;
          set({ workouts: data || [] });
        } catch (error) {
          console.error('Error fetching workouts:', error);
        }
      },

      fetchTodayActivity: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const today = new Date().toISOString().split('T')[0];

          const { data, error } = await supabase
            .from('movement_daily_activity')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', today)
            .maybeSingle();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching today activity:', error);
          }

          if (data) {
            set({
              todayActivity: {
                steps: data.steps || 0,
                calories: data.calories_burned || 0,
                activeMinutes: data.active_minutes || 0,
                distance: data.distance_meters || 0,
                stepGoal: 10000,
                calorieGoal: 500,
                activeMinutesGoal: 60,
                isGoalAchieved: data.is_goal_achieved || false,
              },
            });
          }
        } catch (error) {
          console.error('Error fetching today activity:', error);
        }
      },

      fetchWeeklyProgress: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const fromDate = new Date();
          fromDate.setDate(fromDate.getDate() - 7);

          const { data: activityData, error: activityError } = await supabase
            .from('movement_daily_activity')
            .select('date, steps, calories_burned, active_minutes')
            .eq('user_id', user.id)
            .gte('date', fromDate.toISOString().split('T')[0])
            .order('date', { ascending: true });

          if (activityError) throw activityError;

          // Get workout counts per day
          const { data: workoutData, error: workoutError } = await supabase
            .from('movement_workouts')
            .select('start_time')
            .eq('user_id', user.id)
            .gte('start_time', fromDate.toISOString());

          if (workoutError) throw workoutError;

          const workoutCounts: Record<string, number> = {};
          workoutData?.forEach((w) => {
            const date = new Date(w.start_time).toISOString().split('T')[0];
            workoutCounts[date] = (workoutCounts[date] || 0) + 1;
          });

          const weeklyProgress: WeeklyProgress[] = (activityData || []).map((day) => ({
            date: day.date,
            steps: day.steps || 0,
            calories: day.calories_burned || 0,
            activeMinutes: day.active_minutes || 0,
            workouts: workoutCounts[day.date] || 0,
          }));

          set({ weeklyProgress });
        } catch (error) {
          console.error('Error fetching weekly progress:', error);
        }
      },

      fetchPrograms: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('movement_programs')
            .select('*')
            .or(`user_id.eq.${user.id},is_public.eq.true`)
            .order('created_at', { ascending: false });

          if (error) throw error;
          set({ programs: data || [] });
        } catch (error) {
          console.error('Error fetching programs:', error);
        }
      },

      fetchPlannedWorkouts: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const today = new Date().toISOString().split('T')[0];

          const { data, error } = await supabase
            .from('movement_planned_workouts')
            .select('*')
            .eq('user_id', user.id)
            .gte('scheduled_date', today)
            .order('scheduled_date', { ascending: true })
            .limit(10);

          if (error) throw error;
          set({ plannedWorkouts: data || [] });
        } catch (error) {
          console.error('Error fetching planned workouts:', error);
        }
      },

      fetchPersonalRecords: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('movement_personal_records')
            .select(`
              *,
              exercise:movement_exercises(name)
            `)
            .eq('user_id', user.id)
            .order('achieved_at', { ascending: false })
            .limit(10);

          if (error) throw error;
          
          const records: PersonalRecord[] = (data || []).map((r: any) => ({
            ...r,
            exercise_name: r.exercise?.name,
          }));
          
          set({ personalRecords: records });
        } catch (error) {
          console.error('Error fetching personal records:', error);
        }
      },

      // ============================================
      // MUTATIONS
      // ============================================
      
      updateDailyActivity: async (data) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const today = new Date().toISOString().split('T')[0];
          
          const { data: result, error } = await supabase
            .from('movement_daily_activity')
            .upsert({
              user_id: user.id,
              date: today,
              ...data,
            }, {
              onConflict: 'user_id,date',
            })
            .select()
            .single();

          if (error) throw error;

          // Update local state
          set((state) => ({
            todayActivity: {
              ...state.todayActivity,
              steps: result.steps || state.todayActivity.steps,
              calories: result.calories_burned || state.todayActivity.calories,
              activeMinutes: result.active_minutes || state.todayActivity.activeMinutes,
              distance: result.distance_meters || state.todayActivity.distance,
              isGoalAchieved: result.is_goal_achieved || false,
            },
          }));

          // Update health store
          const { todayActivity } = get();
          const stepsProgress = Math.min(100, (todayActivity.steps / todayActivity.stepGoal) * 100);
          useHealthStore.getState().updateModuleScore('movement', Math.round(stepsProgress));
        } catch (error) {
          console.error('Error updating daily activity:', error);
        }
      },

      startWorkout: async (type, name) => {
        const newWorkout: Workout = {
          id: crypto.randomUUID(),
          user_id: '', // Will be set on save
          workout_type: type,
          name: name || getWorkoutTypeLabel(type),
          start_time: new Date().toISOString(),
          is_planned: false,
          created_at: new Date().toISOString(),
        };

        set({
          activeWorkout: newWorkout,
          activeWorkoutExercises: [],
          isWorkoutActive: true,
          workoutStartTime: Date.now(),
        });
      },

      addExerciseToWorkout: async (exercise) => {
        const { activeWorkout, activeWorkoutExercises } = get();
        if (!activeWorkout) return;

        const newExercise: WorkoutExercise = {
          id: crypto.randomUUID(),
          workout_id: activeWorkout.id,
          exercise_id: exercise.id,
          exercise_name: exercise.name_ru || exercise.name,
          order_index: activeWorkoutExercises.length,
          rest_seconds: 60,
          sets: [],
        };

        set({
          activeWorkoutExercises: [...activeWorkoutExercises, newExercise],
        });
      },

      addSetToExercise: async (exerciseId, set) => {
        const { activeWorkoutExercises } = get();
        
        set({
          activeWorkoutExercises: activeWorkoutExercises.map((ex) => {
            if (ex.id === exerciseId) {
              return {
                ...ex,
                sets: [...ex.sets, set],
              };
            }
            return ex;
          }),
        });
      },

      updateSet: async (exerciseId, setIndex, set) => {
        const { activeWorkoutExercises } = get();
        
        set({
          activeWorkoutExercises: activeWorkoutExercises.map((ex) => {
            if (ex.id === exerciseId) {
              const newSets = [...ex.sets];
              newSets[setIndex] = { ...newSets[setIndex], ...set };
              return { ...ex, sets: newSets };
            }
            return ex;
          }),
        });
      },

      completeWorkout: async (data = {}) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { activeWorkout, activeWorkoutExercises, workoutStartTime } = get();
          if (!activeWorkout) return;

          const endTime = new Date();
          const durationSeconds = workoutStartTime 
            ? Math.round((endTime.getTime() - workoutStartTime) / 1000)
            : 0;

          // Calculate calories based on duration and workout type
          const caloriesPerMinute: Record<WorkoutType, number> = {
            cardio: 10,
            strength: 6,
            hiit: 12,
            yoga: 3,
            pilates: 4,
            running: 11,
            cycling: 8,
            swimming: 9,
            walking: 4,
            hiking: 6,
            sports: 8,
            martial_arts: 10,
            dance: 7,
            other: 6,
          };

          const calories = Math.round((caloriesPerMinute[activeWorkout.workout_type] || 6) * (durationSeconds / 60));

          // Save workout
          const { data: savedWorkout, error: workoutError } = await supabase
            .from('movement_workouts')
            .insert({
              user_id: user.id,
              workout_type: activeWorkout.workout_type,
              name: activeWorkout.name,
              start_time: activeWorkout.start_time,
              end_time: endTime.toISOString(),
              duration_seconds: durationSeconds,
              calories_burned: calories,
              ...data,
            })
            .select()
            .single();

          if (workoutError) throw workoutError;

          // Save exercises
          if (activeWorkoutExercises.length > 0) {
            const exercisesToSave = activeWorkoutExercises.map((ex) => ({
              workout_id: savedWorkout.id,
              exercise_id: ex.exercise_id,
              exercise_name: ex.exercise_name,
              order_index: ex.order_index,
              notes: ex.notes,
              rest_seconds: ex.rest_seconds,
              sets: ex.sets,
            }));

            const { error: exercisesError } = await supabase
              .from('movement_workout_exercises')
              .insert(exercisesToSave);

            if (exercisesError) throw exercisesError;
          }

          // Reset active workout state
          set({
            activeWorkout: null,
            activeWorkoutExercises: [],
            isWorkoutActive: false,
            workoutStartTime: null,
          });

          // Refresh data
          get().fetchWorkouts();
          get().fetchTodayActivity();
          get().fetchWeeklyProgress();
        } catch (error) {
          console.error('Error completing workout:', error);
        }
      },

      cancelWorkout: () => {
        set({
          activeWorkout: null,
          activeWorkoutExercises: [],
          isWorkoutActive: false,
          workoutStartTime: null,
        });
      },

      logWorkout: async (workout, exercises) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data: savedWorkout, error: workoutError } = await supabase
            .from('movement_workouts')
            .insert({
              user_id: user.id,
              ...workout,
            })
            .select()
            .single();

          if (workoutError) throw workoutError;

          if (exercises.length > 0) {
            const exercisesToSave = exercises.map((ex, idx) => ({
              workout_id: savedWorkout.id,
              ...ex,
              order_index: idx,
            }));

            await supabase
              .from('movement_workout_exercises')
              .insert(exercisesToSave);
          }

          get().fetchWorkouts();
          get().fetchTodayActivity();
        } catch (error) {
          console.error('Error logging workout:', error);
        }
      },

      deleteWorkout: async (id) => {
        try {
          const { error } = await supabase
            .from('movement_workouts')
            .delete()
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            workouts: state.workouts.filter((w) => w.id !== id),
          }));
        } catch (error) {
          console.error('Error deleting workout:', error);
        }
      },

      createProgram: async (program) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('movement_programs')
            .insert({
              user_id: user.id,
              ...program,
            })
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            programs: [data, ...state.programs],
          }));
        } catch (error) {
          console.error('Error creating program:', error);
        }
      },

      // ============================================
      // CALCULATIONS & UTILITIES
      // ============================================
      
      calculateCaloriesBurned: (exercise, durationMinutes, userWeightKg = 70) => {
        if (exercise.met_value) {
          return Math.round(exercise.met_value * userWeightKg * (durationMinutes / 60));
        }
        if (exercise.calories_per_hour) {
          return Math.round(exercise.calories_per_hour * (durationMinutes / 60));
        }
        return Math.round(5 * userWeightKg * (durationMinutes / 60)); // Default MET of 5
      },

      getWeeklyProgress: () => {
        return get().weeklyProgress;
      },

      getTodayProgress: () => {
        const { todayActivity } = get();
        const percentage = Math.min(100, Math.round((todayActivity.steps / todayActivity.stepGoal) * 100));
        return {
          steps: todayActivity.steps,
          goal: todayActivity.stepGoal,
          percentage,
        };
      },

      formatDuration: (seconds) => {
        if (!seconds || seconds <= 0) return '00:00';
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) {
          return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      },

      getWorkoutTypeIcon: (type) => {
        const icons: Record<WorkoutType, string> = {
          cardio: '🏃',
          strength: '💪',
          hiit: '⚡',
          yoga: '🧘',
          pilates: '🤸',
          running: '🏃',
          cycling: '🚴',
          swimming: '🏊',
          walking: '🚶',
          hiking: '🥾',
          sports: '⚽',
          martial_arts: '🥋',
          dance: '💃',
          other: '🏋️',
        };
        return icons[type] || '🏋️';
      },

      getMuscleGroupColor: (group) => {
        const colors: Record<MuscleGroup, string> = {
          chest: '#f97316',
          back: '#8b5cf6',
          legs: '#22c55e',
          shoulders: '#06b6d4',
          arms: '#ec4899',
          core: '#eab308',
        };
        return colors[group] || '#6b7280';
      },
    }),
    {
      name: 'movement-store',
      partialize: (state) => ({
        isInitialized: state.isInitialized,
        todayActivity: state.todayActivity,
      }),
    }
  )
);

// Helper function
function getWorkoutTypeLabel(type: WorkoutType): string {
  const labels: Record<WorkoutType, string> = {
    cardio: 'Кардио',
    strength: 'Силовая',
    hiit: 'HIIT',
    yoga: 'Йога',
    pilates: 'Пилатес',
    running: 'Бег',
    cycling: 'Велосипед',
    swimming: 'Плавание',
    walking: 'Ходьба',
    hiking: 'Треккинг',
    sports: 'Спорт',
    martial_arts: 'Единоборства',
    dance: 'Танцы',
    other: 'Другое',
  };
  return labels[type] || 'Тренировка';
}
