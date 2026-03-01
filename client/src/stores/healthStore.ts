import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

export type HealthModule = 
  | 'nutrition' 
  | 'movement' 
  | 'sleep' 
  | 'psychology' 
  | 'medicine' 
  | 'relationships' 
  | 'habits';

export interface ModuleScore {
  nutrition: number;
  movement: number;
  sleep: number;
  psychology: number;
  medicine: number;
  relationships: number;
  habits: number;
}

export interface DailySnapshot {
  id: string;
  date: string;
  overall_score: number;
  module_scores: ModuleScore;
  key_metrics: Record<string, any>;
  streaks: Record<string, number>;
  ai_insights: any[];
  modules_completed: string[];
}

export interface HealthProfile {
  id: string;
  user_id: string;
  birth_date?: string;
  gender?: string;
  blood_type?: string;
  height_cm?: number;
  current_weight_kg?: number;
  activity_level?: string;
  chronotype?: string;
  primary_goal?: string;
  current_overall_streak: number;
  longest_overall_streak: number;
}

interface HealthState {
  // Data
  profile: HealthProfile | null;
  todaySnapshot: DailySnapshot | null;
  weekSnapshots: DailySnapshot[];
  correlations: any[];
  notifications: any[];
  
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  fetchTodaySnapshot: () => Promise<void>;
  fetchWeekSnapshots: () => Promise<void>;
  updateModuleScore: (module: HealthModule, score: number) => Promise<void>;
  updateKeyMetric: (key: string, value: any) => Promise<void>;
  markModuleCompleted: (module: HealthModule) => Promise<void>;
  calculateOverallScore: () => number;
  
  // Getters
  getModuleScore: (module: HealthModule) => number;
  getModuleColor: (module: HealthModule) => string;
  getStreak: (type: string) => number;
}

export const moduleColors: Record<HealthModule, { primary: string; secondary: string; bg: string }> = {
  nutrition: { primary: '#22c55e', secondary: '#86efac', bg: '#f0fdf4' },
  movement: { primary: '#f97316', secondary: '#fdba74', bg: '#fff7ed' },
  sleep: { primary: '#8b5cf6', secondary: '#c4b5fd', bg: '#f5f3ff' },
  psychology: { primary: '#06b6d4', secondary: '#67e8f9', bg: '#ecfeff' },
  medicine: { primary: '#ef4444', secondary: '#fca5a5', bg: '#fef2f2' },
  relationships: { primary: '#ec4899', secondary: '#f9a8d4', bg: '#fdf2f8' },
  habits: { primary: '#eab308', secondary: '#fde047', bg: '#fefce8' },
};

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      profile: null,
      todaySnapshot: null,
      weekSnapshots: [],
      correlations: [],
      notifications: [],
      isLoading: false,
      isInitialized: false,

      initialize: async () => {
        const { fetchProfile, fetchTodaySnapshot, fetchWeekSnapshots } = get();
        await Promise.all([
          fetchProfile(),
          fetchTodaySnapshot(),
          fetchWeekSnapshots(),
        ]);
        set({ isInitialized: true });
      },

      fetchProfile: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('health_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
            return;
          }

          if (data) {
            set({ profile: data });
          } else {
            // Create default profile
            const { data: newProfile, error: createError } = await supabase
              .from('health_profiles')
              .insert({ user_id: user.id })
              .select()
              .single();
            
            if (!createError && newProfile) {
              set({ profile: newProfile });
            }
          }
        } catch (err) {
          console.error('Error in fetchProfile:', err);
        }
      },

      fetchTodaySnapshot: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const today = new Date().toISOString().split('T')[0];
          
          const { data, error } = await supabase
            .from('daily_health_snapshots')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', today)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching snapshot:', error);
            return;
          }

          if (data) {
            set({ todaySnapshot: data });
          } else {
            // Create today's snapshot
            const { data: newSnapshot, error: createError } = await supabase
              .from('daily_health_snapshots')
              .insert({ 
                user_id: user.id,
                date: today,
                module_scores: {
                  nutrition: 0,
                  movement: 0,
                  sleep: 0,
                  psychology: 0,
                  medicine: 0,
                  relationships: 0,
                  habits: 0,
                },
                overall_score: 0,
              })
              .select()
              .single();
            
            if (!createError && newSnapshot) {
              set({ todaySnapshot: newSnapshot });
            }
          }
        } catch (err) {
          console.error('Error in fetchTodaySnapshot:', err);
        }
      },

      fetchWeekSnapshots: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);

          const { data, error } = await supabase
            .from('daily_health_snapshots')
            .select('*')
            .eq('user_id', user.id)
            .gte('date', weekAgo.toISOString().split('T')[0])
            .order('date', { ascending: false });

          if (!error && data) {
            set({ weekSnapshots: data });
          }
        } catch (err) {
          console.error('Error in fetchWeekSnapshots:', err);
        }
      },

      updateModuleScore: async (module, score) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const today = new Date().toISOString().split('T')[0];
          const snapshot = get().todaySnapshot;

          if (!snapshot) return;

          const newModuleScores = {
            ...snapshot.module_scores,
            [module]: Math.min(100, Math.max(0, score)),
          };

          // Calculate overall score with weights
          const weights = {
            nutrition: 0.15,
            movement: 0.15,
            sleep: 0.20,
            psychology: 0.20,
            medicine: 0.10,
            relationships: 0.10,
            habits: 0.10,
          };

          const overallScore = Math.round(
            Object.entries(newModuleScores).reduce(
              (sum, [key, value]) => sum + (value as number) * (weights[key as HealthModule] || 0),
              0
            )
          );

          const { error } = await supabase
            .from('daily_health_snapshots')
            .update({
              module_scores: newModuleScores,
              overall_score: overallScore,
              updated_at: new Date().toISOString(),
            })
            .eq('id', snapshot.id);

          if (!error) {
            set({
              todaySnapshot: {
                ...snapshot,
                module_scores: newModuleScores,
                overall_score: overallScore,
              },
            });
          }
        } catch (err) {
          console.error('Error updating module score:', err);
        }
      },

      updateKeyMetric: async (key, value) => {
        try {
          const snapshot = get().todaySnapshot;
          if (!snapshot) return;

          const newKeyMetrics = {
            ...snapshot.key_metrics,
            [key]: value,
          };

          const { error } = await supabase
            .from('daily_health_snapshots')
            .update({
              key_metrics: newKeyMetrics,
              updated_at: new Date().toISOString(),
            })
            .eq('id', snapshot.id);

          if (!error) {
            set({
              todaySnapshot: {
                ...snapshot,
                key_metrics: newKeyMetrics,
              },
            });
          }
        } catch (err) {
          console.error('Error updating key metric:', err);
        }
      },

      markModuleCompleted: async (module) => {
        try {
          const snapshot = get().todaySnapshot;
          if (!snapshot) return;

          const completed = snapshot.modules_completed || [];
          if (completed.includes(module)) return;

          const newCompleted = [...completed, module];

          const { error } = await supabase
            .from('daily_health_snapshots')
            .update({
              modules_completed: newCompleted,
              updated_at: new Date().toISOString(),
            })
            .eq('id', snapshot.id);

          if (!error) {
            set({
              todaySnapshot: {
                ...snapshot,
                modules_completed: newCompleted,
              },
            });
          }
        } catch (err) {
          console.error('Error marking module completed:', err);
        }
      },

      calculateOverallScore: () => {
        const snapshot = get().todaySnapshot;
        if (!snapshot) return 0;

        const weights = {
          nutrition: 0.15,
          movement: 0.15,
          sleep: 0.20,
          psychology: 0.20,
          medicine: 0.10,
          relationships: 0.10,
          habits: 0.10,
        };

        return Math.round(
          Object.entries(snapshot.module_scores).reduce(
            (sum, [key, value]) => sum + (value as number) * (weights[key as HealthModule] || 0),
            0
          )
        );
      },

      getModuleScore: (module) => {
        return get().todaySnapshot?.module_scores[module] || 0;
      },

      getModuleColor: (module) => {
        return moduleColors[module].primary;
      },

      getStreak: (type) => {
        if (type === 'overall') {
          return get().profile?.current_overall_streak || 0;
        }
        return get().todaySnapshot?.streaks?.[type] || 0;
      },
    }),
    {
      name: 'health-store',
      partialize: (state) => ({
        profile: state.profile,
        isInitialized: state.isInitialized,
      }),
    }
  )
);
