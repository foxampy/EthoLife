import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { useHealthStore } from '../healthStore';

export interface Habit {
  id: string;
  user_id: string;
  template_id?: string;
  custom_name: string;
  description?: string;
  habit_type: 'build' | 'quit' | 'maintain';
  category: string;
  target_frequency: {
    type: 'daily' | 'weekly' | 'specific_days' | 'times_per_week';
    days_of_week?: number[];
    times_per_week?: number;
    specific_times?: string[];
  };
  trigger_habit_id?: string;
  cue_description?: string;
  location?: string;
  estimated_duration_minutes?: number;
  why_important?: string;
  success_criteria?: string;
  start_date: string;
  target_end_date?: string;
  is_active: boolean;
  current_streak: number;
  longest_streak: number;
  total_completions: number;
  success_rate_percent: number;
  last_completed_at?: string;
  reminder_enabled: boolean;
  reminder_time?: string[];
  created_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_at: string;
  completion_date: string;
  notes?: string;
  difficulty_rating?: number;
  satisfaction_rating?: number;
  location?: string;
  mood_before?: number;
  mood_after?: number;
  proof_photo_url?: string;
}

interface HabitsState {
  // Data
  habits: Habit[];
  todayCompletions: HabitCompletion[];
  achievements: any[];
  
  // UI State
  isLoading: boolean;
  selectedDate: string;
  
  // Actions
  initialize: () => Promise<void>;
  fetchHabits: () => Promise<void>;
  fetchTodayCompletions: () => Promise<void>;
  createHabit: (habit: Partial<Habit>) => Promise<Habit | null>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  completeHabit: (habitId: string, data?: Partial<HabitCompletion>) => Promise<void>;
  uncompleteHabit: (completionId: string) => Promise<void>;
  
  // Getters
  getTodaysHabits: () => Habit[];
  isHabitCompletedToday: (habitId: string) => boolean;
  getCompletionForToday: (habitId: string) => HabitCompletion | undefined;
  getStreakEmoji: (streak: number) => string;
  getCategoryColor: (category: string) => string;
}

const categoryColors: Record<string, string> = {
  health: '#22c55e',
  fitness: '#f97316',
  nutrition: '#84cc16',
  sleep: '#8b5cf6',
  productivity: '#3b82f6',
  learning: '#06b6d4',
  social: '#ec4899',
  creativity: '#f59e0b',
  mindfulness: '#14b8a6',
  finance: '#10b981',
  environment: '#6366f1',
  other: '#6b7280',
};

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set, get) => ({
      habits: [],
      todayCompletions: [],
      achievements: [],
      isLoading: false,
      selectedDate: new Date().toISOString().split('T')[0],

      initialize: async () => {
        await Promise.all([
          get().fetchHabits(),
          get().fetchTodayCompletions(),
        ]);
      },

      fetchHabits: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('habits_user_habits')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

          if (!error && data) {
            set({ habits: data as Habit[] });
          }
        } catch (err) {
          console.error('Error fetching habits:', err);
        }
      },

      fetchTodayCompletions: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const today = new Date().toISOString().split('T')[0];

          const { data, error } = await supabase
            .from('habits_completions')
            .select('*')
            .eq('user_id', user.id)
            .eq('completion_date', today);

          if (!error && data) {
            set({ todayCompletions: data as HabitCompletion[] });
          }
        } catch (err) {
          console.error('Error fetching completions:', err);
        }
      },

      createHabit: async (habitData) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return null;

          const { data, error } = await supabase
            .from('habits_user_habits')
            .insert({
              ...habitData,
              user_id: user.id,
            })
            .select()
            .single();

          if (error) {
            console.error('Error creating habit:', error);
            return null;
          }

          // Update local state
          set((state) => ({
            habits: [data as Habit, ...state.habits],
          }));

          return data as Habit;
        } catch (err) {
          console.error('Error in createHabit:', err);
          return null;
        }
      },

      updateHabit: async (id, updates) => {
        try {
          const { error } = await supabase
            .from('habits_user_habits')
            .update(updates)
            .eq('id', id);

          if (!error) {
            set((state) => ({
              habits: state.habits.map((h) =>
                h.id === id ? { ...h, ...updates } : h
              ),
            }));
          }
        } catch (err) {
          console.error('Error updating habit:', err);
        }
      },

      deleteHabit: async (id) => {
        try {
          const { error } = await supabase
            .from('habits_user_habits')
            .update({ is_active: false })
            .eq('id', id);

          if (!error) {
            set((state) => ({
              habits: state.habits.filter((h) => h.id !== id),
            }));
          }
        } catch (err) {
          console.error('Error deleting habit:', err);
        }
      },

      completeHabit: async (habitId, completionData = {}) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const today = new Date().toISOString().split('T')[0];

          const { data, error } = await supabase
            .from('habits_completions')
            .insert({
              habit_id: habitId,
              user_id: user.id,
              completion_date: today,
              ...completionData,
            })
            .select()
            .single();

          if (!error && data) {
            set((state) => ({
              todayCompletions: [...state.todayCompletions, data as HabitCompletion],
            }));

            // Update health store score
            const habit = get().habits.find((h) => h.id === habitId);
            if (habit) {
              const completedCount = get().todayCompletions.length + 1;
              const totalHabits = get().getTodaysHabits().length;
              const score = Math.round((completedCount / totalHabits) * 100);
              
              useHealthStore.getState().updateModuleScore('habits', score);
            }
          }
        } catch (err) {
          console.error('Error completing habit:', err);
        }
      },

      uncompleteHabit: async (completionId) => {
        try {
          const { error } = await supabase
            .from('habits_completions')
            .delete()
            .eq('id', completionId);

          if (!error) {
            set((state) => ({
              todayCompletions: state.todayCompletions.filter(
                (c) => c.id !== completionId
              ),
            }));

            // Recalculate score
            const completedCount = get().todayCompletions.length - 1;
            const totalHabits = get().getTodaysHabits().length;
            const score = Math.round((completedCount / totalHabits) * 100);
            
            useHealthStore.getState().updateModuleScore('habits', Math.max(0, score));
          }
        } catch (err) {
          console.error('Error uncompleting habit:', err);
        }
      },

      getTodaysHabits: () => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday
        
        return get().habits.filter((habit) => {
          if (!habit.is_active) return false;
          if (habit.start_date > today.toISOString().split('T')[0]) return false;
          if (habit.target_end_date && habit.target_end_date < today.toISOString().split('T')[0]) return false;

          // Check frequency
          const freq = habit.target_frequency;
          if (freq.type === 'daily') return true;
          if (freq.type === 'weekly') return true;
          if (freq.type === 'specific_days' && freq.days_of_week?.includes(dayOfWeek)) return true;
          if (freq.type === 'times_per_week') return true;

          return false;
        });
      },

      isHabitCompletedToday: (habitId) => {
        return get().todayCompletions.some((c) => c.habit_id === habitId);
      },

      getCompletionForToday: (habitId) => {
        return get().todayCompletions.find((c) => c.habit_id === habitId);
      },

      getStreakEmoji: (streak) => {
        if (streak >= 100) return '🔥🔥🔥';
        if (streak >= 30) return '🔥🔥';
        if (streak >= 7) return '🔥';
        if (streak >= 3) return '⚡';
        return '🌱';
      },

      getCategoryColor: (category) => {
        return categoryColors[category] || categoryColors.other;
      },
    }),
    {
      name: 'habits-store',
      partialize: (state) => ({
        selectedDate: state.selectedDate,
      }),
    }
  )
);
