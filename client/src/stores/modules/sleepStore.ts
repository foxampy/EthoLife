import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

// ============================================
// TYPES
// ============================================

export type SleepPhaseType = 'deep' | 'light' | 'rem' | 'awake';
export type SleepSource = 'manual' | 'wearable' | 'phone_app' | 'smart_alarm';
export type Chronotype = 'lion' | 'bear' | 'wolf' | 'dolphin';
export type SleepFactorType = 'caffeine' | 'alcohol' | 'exercise' | 'stress' | 'medication' | 'late_meal' | 'nap' | 'travel' | 'illness' | 'other';
export type FactorImpact = 'positive' | 'negative' | 'neutral';
export type NapType = 'power_nap_20min' | 'restorative_90min' | 'other';
export type NapEffect = 'improved' | 'no_effect' | 'worsened';

export interface SleepPhase {
  id: string;
  phase_type: SleepPhaseType;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  percentage_of_total: number;
}

export interface SleepSession {
  id: string;
  user_id: string;
  date: string;
  bedtime: string;
  wake_time?: string;
  duration_minutes: number;
  sleep_latency_minutes: number;
  awake_duration_minutes: number;
  sleep_efficiency_percent: number;
  source: SleepSource;
  quality_score: number;
  notes?: string;
  phases?: SleepPhase[];
  created_at: string;
}

export interface SleepGoals {
  id: string;
  user_id: string;
  target_bedtime: string;
  target_wake_time: string;
  target_duration_minutes: number;
  target_sleep_efficiency: number;
  workdays_schedule: {
    bedtime: string;
    wake_time: string;
    is_enabled: boolean;
  };
  weekend_schedule: {
    bedtime: string;
    wake_time: string;
    is_enabled: boolean;
  };
  chronotype: Chronotype;
  is_smart_alarm_enabled: boolean;
  smart_alarm_window_minutes: number;
  alarm_sound: string;
  is_active: boolean;
}

export interface SleepRoutineChecklist {
  id: string;
  user_id: string;
  date: string;
  no_caffeine_after_14h: boolean;
  no_heavy_meal_3h_before: boolean;
  no_screens_1h_before: boolean;
  dimmed_lights: boolean;
  meditation_or_relaxation: boolean;
  consistent_bedtime: boolean;
  cool_room: boolean;
  darkness_and_silence: boolean;
  environment_score: number;
  completed_at?: string;
}

export interface SleepFactor {
  id: string;
  sleep_session_id: string;
  factor_type: SleepFactorType;
  factor_value?: string;
  estimated_impact: FactorImpact;
  severity: number;
  notes?: string;
}

export interface SleepNap {
  id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  nap_type: NapType;
  quality_rating?: number;
  effect_on_night_sleep?: NapEffect;
  notes?: string;
}

export interface SmartAlarm {
  id: string;
  user_id: string;
  sleep_session_id?: string;
  scheduled_time: string;
  actual_trigger_time?: string;
  phase_at_trigger?: SleepPhaseType;
  user_response?: 'dismissed' | 'snoozed' | 'missed';
  effectiveness_rating?: number;
}

export interface SleepInsight {
  id: string;
  user_id: string;
  date: string;
  insight_type: 'pattern' | 'warning' | 'recommendation' | 'achievement' | 'prediction' | 'hygiene_tip';
  title: string;
  description?: string;
  related_factors: Record<string, any>;
  priority: 'low' | 'medium' | 'high';
  is_read: boolean;
}

export interface WeeklySleepData {
  date: string;
  duration_minutes: number;
  quality_score: number;
  sleep_efficiency_percent: number;
  deep_percent: number;
  rem_percent: number;
}

export interface TodaySleep {
  session?: SleepSession;
  routine?: SleepRoutineChecklist;
  score: number;
  goalProgress: number;
  isGoalMet: boolean;
}

// ============================================
// STORE STATE
// ============================================

interface SleepState {
  // Data
  sessions: SleepSession[];
  goals: SleepGoals | null;
  todaySleep: TodaySleep;
  routineHistory: SleepRoutineChecklist[];
  naps: SleepNap[];
  insights: SleepInsight[];
  weeklyData: WeeklySleepData[];
  smartAlarms: SmartAlarm[];
  
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  fetchSessions: (days?: number) => Promise<void>;
  fetchTodaySleep: () => Promise<void>;
  fetchGoals: () => Promise<void>;
  fetchRoutine: (date?: string) => Promise<void>;
  fetchWeeklyData: () => Promise<void>;
  fetchInsights: () => Promise<void>;
  
  // Mutations
  logSleep: (session: Partial<SleepSession>) => Promise<SleepSession | null>;
  updateSleep: (id: string, updates: Partial<SleepSession>) => Promise<void>;
  deleteSleep: (id: string) => Promise<void>;
  updateGoals: (updates: Partial<SleepGoals>) => Promise<void>;
  completeChecklistItem: (item: keyof Omit<SleepRoutineChecklist, 'id' | 'user_id' | 'date' | 'environment_score' | 'completed_at'>, date?: string) => Promise<void>;
  logNap: (nap: Partial<SleepNap>) => Promise<void>;
  addSleepFactor: (sessionId: string, factor: Partial<SleepFactor>) => Promise<void>;
  markInsightRead: (insightId: string) => Promise<void>;
  
  // Calculations
  calculateSleepScore: (session: SleepSession) => number;
  calculateSleepDebt: () => number;
  getSleepQualityLabel: (score: number) => string;
  getRecommendedBedtime: () => string;
  formatDuration: (minutes: number) => string;
}

const defaultTodaySleep: TodaySleep = {
  session: undefined,
  routine: undefined,
  score: 0,
  goalProgress: 0,
  isGoalMet: false,
};

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useSleepStore = create<SleepState>()(
  persist(
    (set, get) => ({
      sessions: [],
      goals: null,
      todaySleep: defaultTodaySleep,
      routineHistory: [],
      naps: [],
      insights: [],
      weeklyData: [],
      smartAlarms: [],
      isLoading: false,
      isInitialized: false,

      // ============================================
      // INITIALIZATION
      // ============================================
      
      initialize: async () => {
        const { fetchGoals, fetchTodaySleep, fetchWeeklyData, fetchInsights } = get();
        set({ isLoading: true });
        
        try {
          await Promise.all([
            fetchGoals(),
            fetchTodaySleep(),
            fetchWeeklyData(),
            fetchInsights(),
          ]);
          set({ isInitialized: true });
        } catch (error) {
          console.error('Error initializing sleep store:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      // ============================================
      // FETCH ACTIONS
      // ============================================
      
      fetchSessions: async (days = 7) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const fromDate = new Date();
          fromDate.setDate(fromDate.getDate() - days);

          const { data, error } = await supabase
            .from('sleep_sessions')
            .select(`
              *,
              phases:sleep_phases(*)
            `)
            .eq('user_id', user.id)
            .gte('date', fromDate.toISOString().split('T')[0])
            .order('date', { ascending: false });

          if (error) throw error;
          set({ sessions: data || [] });
        } catch (error) {
          console.error('Error fetching sleep sessions:', error);
        }
      },

      fetchTodaySleep: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const today = new Date().toISOString().split('T')[0];

          // Fetch today's session
          const { data: session, error: sessionError } = await supabase
            .from('sleep_sessions')
            .select(`
              *,
              phases:sleep_phases(*)
            `)
            .eq('user_id', user.id)
            .eq('date', today)
            .maybeSingle();

          if (sessionError && sessionError.code !== 'PGRST116') {
            console.error('Error fetching today sleep:', sessionError);
          }

          // Fetch today's routine
          const { data: routine, error: routineError } = await supabase
            .from('sleep_routine_checklist')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', today)
            .maybeSingle();

          if (routineError && routineError.code !== 'PGRST116') {
            console.error('Error fetching routine:', routineError);
          }

          const goals = get().goals;
          const duration = session?.duration_minutes || 0;
          const targetDuration = goals?.target_duration_minutes || 480;
          const goalProgress = Math.min(100, Math.round((duration / targetDuration) * 100));
          
          const score = session 
            ? get().calculateSleepScore(session)
            : 0;

          set({
            todaySleep: {
              session: session || undefined,
              routine: routine || undefined,
              score,
              goalProgress,
              isGoalMet: duration >= targetDuration * 0.9,
            },
          });
        } catch (error) {
          console.error('Error fetching today sleep:', error);
        }
      },

      fetchGoals: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('sleep_goals')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching sleep goals:', error);
            return;
          }

          if (data) {
            set({ goals: data });
          } else {
            // Create default goals
            const { data: newGoals, error: createError } = await supabase
              .from('sleep_goals')
              .insert({
                user_id: user.id,
                target_bedtime: '22:30',
                target_wake_time: '06:30',
                target_duration_minutes: 480,
              })
              .select()
              .single();

            if (!createError && newGoals) {
              set({ goals: newGoals });
            }
          }
        } catch (error) {
          console.error('Error fetching sleep goals:', error);
        }
      },

      fetchRoutine: async (date) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const targetDate = date || new Date().toISOString().split('T')[0];

          const { data, error } = await supabase
            .from('sleep_routine_checklist')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', targetDate)
            .maybeSingle();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching routine:', error);
            return;
          }

          if (!data) {
            // Create empty routine for today
            const { data: newRoutine, error: createError } = await supabase
              .from('sleep_routine_checklist')
              .insert({
                user_id: user.id,
                date: targetDate,
              })
              .select()
              .single();

            if (!createError && newRoutine) {
              if (targetDate === new Date().toISOString().split('T')[0]) {
                set((state) => ({
                  todaySleep: { ...state.todaySleep, routine: newRoutine },
                }));
              }
            }
          } else if (targetDate === new Date().toISOString().split('T')[0]) {
            set((state) => ({
              todaySleep: { ...state.todaySleep, routine: data },
            }));
          }
        } catch (error) {
          console.error('Error fetching routine:', error);
        }
      },

      fetchWeeklyData: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('v_sleep_dashboard')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false })
            .limit(7);

          if (error) throw error;

          const weeklyData: WeeklySleepData[] = (data || []).map((item: any) => ({
            date: item.date,
            duration_minutes: item.duration_minutes || 0,
            quality_score: item.quality_score || 0,
            sleep_efficiency_percent: item.sleep_efficiency_percent || 0,
            deep_percent: item.deep_percent || 0,
            rem_percent: item.rem_percent || 0,
          }));

          set({ weeklyData });
        } catch (error) {
          console.error('Error fetching weekly data:', error);
        }
      },

      fetchInsights: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('sleep_ai_insights')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10);

          if (error) throw error;
          set({ insights: data || [] });
        } catch (error) {
          console.error('Error fetching sleep insights:', error);
        }
      },

      // ============================================
      // MUTATIONS
      // ============================================
      
      logSleep: async (session) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return null;

          const today = new Date().toISOString().split('T')[0];
          
          const { data, error } = await supabase
            .from('sleep_sessions')
            .upsert({
              user_id: user.id,
              date: today,
              ...session,
            }, {
              onConflict: 'user_id,date',
            })
            .select()
            .single();

          if (error) throw error;

          // Refresh data
          get().fetchTodaySleep();
          get().fetchWeeklyData();

          return data;
        } catch (error) {
          console.error('Error logging sleep:', error);
          return null;
        }
      },

      updateSleep: async (id, updates) => {
        try {
          const { error } = await supabase
            .from('sleep_sessions')
            .update(updates)
            .eq('id', id);

          if (error) throw error;

          get().fetchTodaySleep();
          get().fetchWeeklyData();
        } catch (error) {
          console.error('Error updating sleep:', error);
        }
      },

      deleteSleep: async (id) => {
        try {
          const { error } = await supabase
            .from('sleep_sessions')
            .delete()
            .eq('id', id);

          if (error) throw error;

          get().fetchTodaySleep();
          get().fetchWeeklyData();
        } catch (error) {
          console.error('Error deleting sleep:', error);
        }
      },

      updateGoals: async (updates) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const goals = get().goals;
          
          if (goals) {
            const { data, error } = await supabase
              .from('sleep_goals')
              .update(updates)
              .eq('id', goals.id)
              .select()
              .single();

            if (error) throw error;
            set({ goals: data });
          } else {
            const { data, error } = await supabase
              .from('sleep_goals')
              .insert({
                user_id: user.id,
                ...updates,
              })
              .select()
              .single();

            if (error) throw error;
            set({ goals: data });
          }
        } catch (error) {
          console.error('Error updating sleep goals:', error);
        }
      },

      completeChecklistItem: async (item, date) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const targetDate = date || new Date().toISOString().split('T')[0];

          // Check if routine exists
          const { data: existing } = await supabase
            .from('sleep_routine_checklist')
            .select('id')
            .eq('user_id', user.id)
            .eq('date', targetDate)
            .maybeSingle();

          let data;
          if (existing) {
            const result = await supabase
              .from('sleep_routine_checklist')
              .update({ [item]: true })
              .eq('id', existing.id)
              .select()
              .single();
            data = result.data;
          } else {
            const result = await supabase
              .from('sleep_routine_checklist')
              .insert({
                user_id: user.id,
                date: targetDate,
                [item]: true,
              })
              .select()
              .single();
            data = result.data;
          }

          if (data) {
            if (targetDate === new Date().toISOString().split('T')[0]) {
              set((state) => ({
                todaySleep: { ...state.todaySleep, routine: data },
              }));
            }
          }
        } catch (error) {
          console.error('Error completing checklist item:', error);
        }
      },

      logNap: async (nap) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('sleep_naps')
            .insert({
              user_id: user.id,
              ...nap,
            })
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            naps: [data, ...state.naps],
          }));
        } catch (error) {
          console.error('Error logging nap:', error);
        }
      },

      addSleepFactor: async (sessionId, factor) => {
        try {
          const { error } = await supabase
            .from('sleep_factors')
            .insert({
              sleep_session_id: sessionId,
              ...factor,
            });

          if (error) throw error;
        } catch (error) {
          console.error('Error adding sleep factor:', error);
        }
      },

      markInsightRead: async (insightId) => {
        try {
          const { error } = await supabase
            .from('sleep_ai_insights')
            .update({ is_read: true, read_at: new Date().toISOString() })
            .eq('id', insightId);

          if (error) throw error;

          set((state) => ({
            insights: state.insights.map((i) =>
              i.id === insightId ? { ...i, is_read: true } : i
            ),
          }));
        } catch (error) {
          console.error('Error marking insight read:', error);
        }
      },

      // ============================================
      // CALCULATIONS & UTILITIES
      // ============================================
      
      calculateSleepScore: (session) => {
        if (!session) return 0;

        const duration = session.duration_minutes || 0;
        const efficiency = session.sleep_efficiency_percent || 0;
        const quality = session.quality_score || 50;

        // Duration score (optimal: 420-540 minutes / 7-9 hours)
        const durationScore = Math.min(35, Math.round((duration / 480) * 35));

        // Efficiency score (optimal: 85%+)
        const efficiencyScore = Math.min(30, Math.round((efficiency / 100) * 30));

        // Quality subjective score (0-35 points)
        const qualityScore = Math.round(quality * 0.35);

        return Math.min(100, durationScore + efficiencyScore + qualityScore);
      },

      calculateSleepDebt: () => {
        const { sessions, goals } = get();
        if (!goals) return 0;

        const targetMinutes = goals.target_duration_minutes || 480;
        const recentSessions = sessions.slice(0, 7);
        
        if (recentSessions.length === 0) return 0;

        const totalDebt = recentSessions.reduce((acc, session) => {
          const actual = session.duration_minutes || 0;
          return acc + Math.max(0, targetMinutes - actual);
        }, 0);

        return Math.round(totalDebt);
      },

      getSleepQualityLabel: (score) => {
        if (score >= 90) return 'Отличный';
        if (score >= 75) return 'Хороший';
        if (score >= 60) return 'Удовлетворительный';
        if (score >= 40) return 'Плохой';
        return 'Очень плохой';
      },

      getRecommendedBedtime: () => {
        const { goals } = get();
        if (!goals?.target_wake_time) return '22:30';

        const [hours, minutes] = goals.target_wake_time.split(':').map(Number);
        const targetMinutes = goals.target_duration_minutes || 480;
        
        const wakeTimeMinutes = hours * 60 + minutes;
        const bedtimeMinutes = wakeTimeMinutes - targetMinutes;
        
        const bedtimeHours = Math.floor((bedtimeMinutes + 1440) % 1440 / 60);
        const bedtimeMins = (bedtimeMinutes + 1440) % 60;
        
        return `${bedtimeHours.toString().padStart(2, '0')}:${bedtimeMins.toString().padStart(2, '0')}`;
      },

      formatDuration: (minutes) => {
        if (!minutes || minutes <= 0) return '0ч 0мин';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}ч ${mins}мин`;
      },
    }),
    {
      name: 'sleep-store',
      partialize: (state) => ({
        goals: state.goals,
        isInitialized: state.isInitialized,
      }),
    }
  )
);
