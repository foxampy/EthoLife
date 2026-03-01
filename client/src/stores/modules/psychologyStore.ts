import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { useHealthStore } from '../healthStore';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
export type EmotionValence = 'positive' | 'neutral' | 'negative';
export type AssessmentType = 'phq9' | 'gad7' | 'pss' | 'wb5' | 'who5' | 'custom';
export type SeverityLevel = 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe';
export type TechniqueCategory = 'breathing' | 'meditation' | 'cbt' | 'grounding' | 'mindfulness' | 'gratitude' | 'journaling' | 'visualization' | 'somatic' | 'relaxation';
export type CrisisFlagType = 'low_mood_streak' | 'high_anxiety' | 'suicidal_ideation' | 'self_harm' | 'isolation' | 'sudden_change';
export type CrisisSeverity = 'low' | 'moderate' | 'high' | 'immediate';

export interface MoodEntry {
  id: string;
  user_id: string;
  date: string;
  time_of_day: TimeOfDay;
  overall_mood: number;
  energy_level: number;
  stress_level: number;
  anxiety_level: number;
  focus_level: number;
  emotions: string[];
  mood_tags: string[];
  journal_entry?: string;
  voice_note_url?: string;
  photo_mood_url?: string;
  weather?: string;
  location_context?: string;
  social_context?: string;
  trigger_event?: string;
  created_at: string;
}

export interface EmotionCheckin {
  id: string;
  user_id: string;
  mood_entry_id: string;
  emotion_name: string;
  emotion_intensity: number;
  valence: EmotionValence;
  arousal: number;
  body_sensation?: string;
  duration_minutes?: number;
  resolved: boolean;
  created_at: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  assessment_type: AssessmentType;
  assessment_name: string;
  total_score: number;
  severity_level: SeverityLevel;
  answers: Record<string, number>;
  interpretation?: string;
  taken_at: string;
  next_recommended_at?: string;
  is_completed: boolean;
  created_at: string;
}

export interface PHQ9Score {
  id: string;
  assessment_id: string;
  user_id: string;
  total_score: number;
  severity: string;
  suicidal_ideation_flag: boolean;
  requires_follow_up: boolean;
  created_at: string;
}

export interface GAD7Score {
  id: string;
  assessment_id: string;
  user_id: string;
  total_score: number;
  severity: string;
  created_at: string;
}

export interface Technique {
  id: string;
  name: string;
  name_ru?: string;
  category: TechniqueCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  description: string;
  instructions: string[];
  audio_url?: string;
  video_url?: string;
  image_url?: string;
  tags: string[];
  target_symptoms: string[];
  is_premium: boolean;
  created_at: string;
}

export interface TechniqueSession {
  id: string;
  user_id: string;
  technique_id: string;
  started_at: string;
  completed_at?: string;
  duration_seconds?: number;
  completion_rate?: number;
  effectiveness_rating?: number;
  pre_stress_level?: number;
  post_stress_level?: number;
  mood_before?: number;
  mood_after?: number;
  notes?: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  entry_type: 'free_form' | 'gratitude' | 'worry_dump' | 'cognitive_restructuring' | 'goal_setting' | 'reflection';
  title?: string;
  content: string;
  ai_analysis?: {
    sentiment_score?: number;
    key_themes?: string[];
    suggested_techniques?: string[];
    cognitive_distortions_detected?: string[];
    ai_summary?: string;
  };
  word_count?: number;
  writing_duration_minutes?: number;
  mood_before?: number;
  mood_after?: number;
  is_favorite: boolean;
  is_shared_with_therapist: boolean;
  created_at: string;
  updated_at: string;
}

export interface PsychologyGoal {
  id: string;
  user_id: string;
  goal_type: 'reduce_anxiety' | 'improve_mood' | 'better_sleep' | 'increase_resilience' | 'stress_management' | 'build_confidence' | 'overcome_phobia' | 'other';
  description: string;
  target_metric?: string;
  current_baseline?: number;
  target_value?: number;
  deadline?: string;
  action_plan?: string[];
  progress_percent: number;
  is_active: boolean;
  achieved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CrisisFlag {
  id: string;
  user_id: string;
  flag_type: CrisisFlagType;
  severity: CrisisSeverity;
  trigger_data?: Record<string, any>;
  is_resolved: boolean;
  resolved_at?: string;
  resolution_notes?: string;
  created_at: string;
}

export interface MoodTrend {
  date: string;
  avgMood: number;
  avgEnergy: number;
  avgStress: number;
  entryCount: number;
}

interface PsychologyState {
  // Data
  moodEntries: MoodEntry[];
  emotionCheckins: EmotionCheckin[];
  assessments: Assessment[];
  phq9Scores: PHQ9Score[];
  gad7Scores: GAD7Score[];
  techniques: Technique[];
  techniqueSessions: TechniqueSession[];
  journalEntries: JournalEntry[];
  goals: PsychologyGoal[];
  crisisFlags: CrisisFlag[];
  
  // UI State
  isLoading: boolean;
  selectedDate: string;
  activeSession: TechniqueSession | null;
  
  // Actions
  initialize: () => Promise<void>;
  fetchMoodEntries: (days?: number) => Promise<void>;
  fetchAssessments: () => Promise<void>;
  fetchTechniques: () => Promise<void>;
  fetchTechniqueSessions: () => Promise<void>;
  fetchJournalEntries: () => Promise<void>;
  fetchGoals: () => Promise<void>;
  fetchCrisisFlags: () => Promise<void>;
  
  logMood: (moodData: Partial<MoodEntry>) => Promise<MoodEntry | null>;
  logEmotions: (emotions: Partial<EmotionCheckin>[]) => Promise<void>;
  completeAssessment: (assessmentData: Partial<Assessment>) => Promise<Assessment | null>;
  startTechnique: (techniqueId: string) => Promise<TechniqueSession | null>;
  completeTechnique: (sessionId: string, data: Partial<TechniqueSession>) => Promise<void>;
  createJournalEntry: (entryData: Partial<JournalEntry>) => Promise<JournalEntry | null>;
  createGoal: (goalData: Partial<PsychologyGoal>) => Promise<PsychologyGoal | null>;
  updateGoal: (id: string, updates: Partial<PsychologyGoal>) => Promise<void>;
  
  // Getters
  getTodayMood: () => MoodEntry | undefined;
  getMoodTrend: (days: number) => MoodTrend[];
  getAverageMood: (days: number) => number;
  getMoodStreak: () => number;
  getCrisisAlerts: () => CrisisFlag[];
  getRecommendedTechniques: () => Technique[];
  getLastAssessment: (type: AssessmentType) => Assessment | undefined;
  getMoodColor: (mood: number) => string;
  getMoodEmoji: (mood: number) => string;
  getSeverityColor: (severity: SeverityLevel) => string;
}

const emotionList = [
  { name: 'happy', emoji: '😊', label: 'Счастье', valence: 'positive' as EmotionValence },
  { name: 'grateful', emoji: '🙏', label: 'Благодарность', valence: 'positive' as EmotionValence },
  { name: 'calm', emoji: '😌', label: 'Спокойствие', valence: 'positive' as EmotionValence },
  { name: 'energetic', emoji: '💪', label: 'Энергия', valence: 'positive' as EmotionValence },
  { name: 'excited', emoji: '🤩', label: 'Вдохновение', valence: 'positive' as EmotionValence },
  { name: 'loved', emoji: '❤️', label: 'Любовь', valence: 'positive' as EmotionValence },
  { name: 'confident', emoji: '😎', label: 'Уверенность', valence: 'positive' as EmotionValence },
  { name: 'hopeful', emoji: '🌟', label: 'Надежда', valence: 'positive' as EmotionValence },
  { name: 'proud', emoji: '🦚', label: 'Гордость', valence: 'positive' as EmotionValence },
  { name: 'content', emoji: '😊', label: 'Довольство', valence: 'positive' as EmotionValence },
  { name: 'neutral', emoji: '😐', label: 'Нейтрально', valence: 'neutral' as EmotionValence },
  { name: 'tired', emoji: '😴', label: 'Усталость', valence: 'negative' as EmotionValence },
  { name: 'bored', emoji: '😑', label: 'Скука', valence: 'negative' as EmotionValence },
  { name: 'anxious', emoji: '😰', label: 'Тревога', valence: 'negative' as EmotionValence },
  { name: 'worried', emoji: '😟', label: 'Беспокойство', valence: 'negative' as EmotionValence },
  { name: 'stressed', emoji: '😫', label: 'Стресс', valence: 'negative' as EmotionValence },
  { name: 'sad', emoji: '😔', label: 'Грусть', valence: 'negative' as EmotionValence },
  { name: 'lonely', emoji: '🥺', label: 'Одиночество', valence: 'negative' as EmotionValence },
  { name: 'frustrated', emoji: '😤', label: 'Раздражение', valence: 'negative' as EmotionValence },
  { name: 'angry', emoji: '😠', label: 'Злость', valence: 'negative' as EmotionValence },
  { name: 'overwhelmed', emoji: '😵', label: 'Перегруз', valence: 'negative' as EmotionValence },
  { name: 'disappointed', emoji: '😞', label: 'Разочарование', valence: 'negative' as EmotionValence },
  { name: 'insecure', emoji: '😶', label: 'Неуверенность', valence: 'negative' as EmotionValence },
  { name: 'guilty', emoji: '😓', label: 'Вина', valence: 'negative' as EmotionValence },
];

export const getEmotionConfig = (emotionName: string) => {
  return emotionList.find(e => e.name === emotionName) || { emoji: '😐', label: emotionName, valence: 'neutral' as EmotionValence };
};

export const emotionOptions = emotionList;

export const usePsychologyStore = create<PsychologyState>()(
  persist(
    (set, get) => ({
      moodEntries: [],
      emotionCheckins: [],
      assessments: [],
      phq9Scores: [],
      gad7Scores: [],
      techniques: [],
      techniqueSessions: [],
      journalEntries: [],
      goals: [],
      crisisFlags: [],
      isLoading: false,
      selectedDate: new Date().toISOString().split('T')[0],
      activeSession: null,

      initialize: async () => {
        await Promise.all([
          get().fetchMoodEntries(30),
          get().fetchAssessments(),
          get().fetchTechniques(),
          get().fetchTechniqueSessions(),
          get().fetchGoals(),
          get().fetchCrisisFlags(),
        ]);
      },

      fetchMoodEntries: async (days = 30) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const startDate = new Date();
          startDate.setDate(startDate.getDate() - days);

          const { data, error } = await supabase
            .from('psychology_mood_entries')
            .select('*')
            .eq('user_id', user.id)
            .gte('date', startDate.toISOString().split('T')[0])
            .order('date', { ascending: false })
            .order('created_at', { ascending: false });

          if (!error && data) {
            set({ moodEntries: data as MoodEntry[] });
          }
        } catch (err) {
          console.error('Error fetching mood entries:', err);
        }
      },

      fetchAssessments: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('psychology_assessments')
            .select('*')
            .eq('user_id', user.id)
            .order('taken_at', { ascending: false });

          if (!error && data) {
            set({ assessments: data as Assessment[] });
          }

          // Fetch PHQ-9 and GAD-7 scores
          const { data: phq9Data } = await supabase
            .from('psychology_phq9_scores')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (phq9Data) set({ phq9Scores: phq9Data as PHQ9Score[] });

          const { data: gad7Data } = await supabase
            .from('psychology_gad7_scores')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (gad7Data) set({ gad7Scores: gad7Data as GAD7Score[] });
        } catch (err) {
          console.error('Error fetching assessments:', err);
        }
      },

      fetchTechniques: async () => {
        try {
          const { data, error } = await supabase
            .from('psychology_techniques')
            .select('*')
            .order('name');

          if (!error && data) {
            set({ techniques: data as Technique[] });
          }
        } catch (err) {
          console.error('Error fetching techniques:', err);
        }
      },

      fetchTechniqueSessions: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('psychology_technique_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('started_at', { ascending: false });

          if (!error && data) {
            set({ techniqueSessions: data as TechniqueSession[] });
          }
        } catch (err) {
          console.error('Error fetching technique sessions:', err);
        }
      },

      fetchJournalEntries: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('psychology_journal_entries')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (!error && data) {
            set({ journalEntries: data as JournalEntry[] });
          }
        } catch (err) {
          console.error('Error fetching journal entries:', err);
        }
      },

      fetchGoals: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('psychology_goals')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

          if (!error && data) {
            set({ goals: data as PsychologyGoal[] });
          }
        } catch (err) {
          console.error('Error fetching goals:', err);
        }
      },

      fetchCrisisFlags: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('psychology_crisis_flags')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_resolved', false)
            .order('created_at', { ascending: false });

          if (!error && data) {
            set({ crisisFlags: data as CrisisFlag[] });
          }
        } catch (err) {
          console.error('Error fetching crisis flags:', err);
        }
      },

      logMood: async (moodData) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return null;

          const today = new Date().toISOString().split('T')[0];
          const timeOfDay = getCurrentTimeOfDay();

          const { data, error } = await supabase
            .from('psychology_mood_entries')
            .upsert({
              ...moodData,
              user_id: user.id,
              date: moodData.date || today,
              time_of_day: moodData.time_of_day || timeOfDay,
            }, {
              onConflict: 'user_id,date,time_of_day',
            })
            .select()
            .single();

          if (error) {
            console.error('Error logging mood:', error);
            return null;
          }

          // Update local state
          set((state) => ({
            moodEntries: [data as MoodEntry, ...state.moodEntries.filter(
              e => !(e.date === (data as MoodEntry).date && e.time_of_day === (data as MoodEntry).time_of_day)
            )],
          }));

          // Update health store score
          const moodScore = calculateMoodScore(data as MoodEntry);
          useHealthStore.getState().updateModuleScore('psychology', moodScore);
          useHealthStore.getState().markModuleCompleted('psychology');

          return data as MoodEntry;
        } catch (err) {
          console.error('Error in logMood:', err);
          return null;
        }
      },

      logEmotions: async (emotions) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const todayMood = get().getTodayMood();
          if (!todayMood) return;

          const emotionsWithIds = emotions.map(e => ({
            ...e,
            user_id: user.id,
            mood_entry_id: todayMood.id,
          }));

          const { error } = await supabase
            .from('psychology_emotion_checkins')
            .insert(emotionsWithIds);

          if (error) {
            console.error('Error logging emotions:', error);
          }
        } catch (err) {
          console.error('Error in logEmotions:', err);
        }
      },

      completeAssessment: async (assessmentData) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return null;

          const { data, error } = await supabase
            .from('psychology_assessments')
            .insert({
              ...assessmentData,
              user_id: user.id,
              taken_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (error) {
            console.error('Error completing assessment:', error);
            return null;
          }

          set((state) => ({
            assessments: [data as Assessment, ...state.assessments],
          }));

          return data as Assessment;
        } catch (err) {
          console.error('Error in completeAssessment:', err);
          return null;
        }
      },

      startTechnique: async (techniqueId) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return null;

          const { data, error } = await supabase
            .from('psychology_technique_sessions')
            .insert({
              user_id: user.id,
              technique_id: techniqueId,
              started_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (error) {
            console.error('Error starting technique:', error);
            return null;
          }

          const session = data as TechniqueSession;
          set({ activeSession: session });
          return session;
        } catch (err) {
          console.error('Error in startTechnique:', err);
          return null;
        }
      },

      completeTechnique: async (sessionId, data) => {
        try {
          const { error } = await supabase
            .from('psychology_technique_sessions')
            .update({
              ...data,
              completed_at: new Date().toISOString(),
            })
            .eq('id', sessionId);

          if (!error) {
            set((state) => ({
              techniqueSessions: state.techniqueSessions.map(s =>
                s.id === sessionId ? { ...s, ...data, completed_at: new Date().toISOString() } : s
              ),
              activeSession: null,
            }));
          }
        } catch (err) {
          console.error('Error completing technique:', err);
        }
      },

      createJournalEntry: async (entryData) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return null;

          const { data, error } = await supabase
            .from('psychology_journal_entries')
            .insert({
              ...entryData,
              user_id: user.id,
              word_count: entryData.content?.split(/\s+/).length || 0,
            })
            .select()
            .single();

          if (error) {
            console.error('Error creating journal entry:', error);
            return null;
          }

          set((state) => ({
            journalEntries: [data as JournalEntry, ...state.journalEntries],
          }));

          return data as JournalEntry;
        } catch (err) {
          console.error('Error in createJournalEntry:', err);
          return null;
        }
      },

      createGoal: async (goalData) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return null;

          const { data, error } = await supabase
            .from('psychology_goals')
            .insert({
              ...goalData,
              user_id: user.id,
            })
            .select()
            .single();

          if (error) {
            console.error('Error creating goal:', error);
            return null;
          }

          set((state) => ({
            goals: [data as PsychologyGoal, ...state.goals],
          }));

          return data as PsychologyGoal;
        } catch (err) {
          console.error('Error in createGoal:', err);
          return null;
        }
      },

      updateGoal: async (id, updates) => {
        try {
          const { error } = await supabase
            .from('psychology_goals')
            .update(updates)
            .eq('id', id);

          if (!error) {
            set((state) => ({
              goals: state.goals.map(g =>
                g.id === id ? { ...g, ...updates } : g
              ),
            }));
          }
        } catch (err) {
          console.error('Error updating goal:', err);
        }
      },

      // Getters
      getTodayMood: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().moodEntries.find(e => e.date === today);
      },

      getMoodTrend: (days) => {
        const entries = get().moodEntries.slice(0, days);
        const grouped = entries.reduce((acc, entry) => {
          if (!acc[entry.date]) {
            acc[entry.date] = { moods: [], energy: [], stress: [] };
          }
          acc[entry.date].moods.push(entry.overall_mood);
          acc[entry.date].energy.push(entry.energy_level);
          acc[entry.date].stress.push(entry.stress_level);
          return acc;
        }, {} as Record<string, { moods: number[]; energy: number[]; stress: number[] }>);

        return Object.entries(grouped).map(([date, data]) => ({
          date,
          avgMood: Math.round(data.moods.reduce((a, b) => a + b, 0) / data.moods.length),
          avgEnergy: Math.round(data.energy.reduce((a, b) => a + b, 0) / data.energy.length),
          avgStress: Math.round(data.stress.reduce((a, b) => a + b, 0) / data.stress.length),
          entryCount: data.moods.length,
        })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      },

      getAverageMood: (days) => {
        const entries = get().moodEntries.slice(0, days);
        if (entries.length === 0) return 0;
        return Math.round(entries.reduce((acc, e) => acc + e.overall_mood, 0) / entries.length);
      },

      getMoodStreak: () => {
        const entries = get().moodEntries.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < entries.length; i++) {
          const entryDate = new Date(entries[i].date);
          const expectedDate = new Date(today);
          expectedDate.setDate(expectedDate.getDate() - i);
          
          if (entryDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
            streak++;
          } else {
            break;
          }
        }
        
        return streak;
      },

      getCrisisAlerts: () => {
        return get().crisisFlags.filter(f => !f.is_resolved);
      },

      getRecommendedTechniques: () => {
        const todayMood = get().getTodayMood();
        if (!todayMood) {
          return get().techniques.filter(t => t.difficulty === 'beginner').slice(0, 3);
        }

        // Recommend based on mood state
        const targetSymptoms: string[] = [];
        if (todayMood.anxiety_level >= 6) targetSymptoms.push('anxiety');
        if (todayMood.stress_level >= 6) targetSymptoms.push('stress');
        if (todayMood.overall_mood <= 4) targetSymptoms.push('low_mood');
        if (todayMood.energy_level <= 4) targetSymptoms.push('fatigue');

        if (targetSymptoms.length === 0) {
          return get().techniques.filter(t => t.category === 'mindfulness').slice(0, 3);
        }

        return get().techniques.filter(t => 
          t.target_symptoms?.some(s => targetSymptoms.includes(s))
        ).slice(0, 3);
      },

      getLastAssessment: (type) => {
        return get().assessments.find(a => a.assessment_type === type);
      },

      getMoodColor: (mood) => {
        if (mood >= 8) return '#22c55e'; // green
        if (mood >= 6) return '#84cc16'; // lime
        if (mood >= 5) return '#eab308'; // yellow
        if (mood >= 3) return '#f97316'; // orange
        return '#ef4444'; // red
      },

      getMoodEmoji: (mood) => {
        if (mood >= 9) return '😄';
        if (mood >= 7) return '🙂';
        if (mood >= 5) return '😐';
        if (mood >= 3) return '😕';
        return '😢';
      },

      getSeverityColor: (severity) => {
        switch (severity) {
          case 'minimal': return '#22c55e';
          case 'mild': return '#84cc16';
          case 'moderate': return '#eab308';
          case 'moderately_severe': return '#f97316';
          case 'severe': return '#ef4444';
          default: return '#6b7280';
        }
      },
    }),
    {
      name: 'psychology-store',
      partialize: (state) => ({
        selectedDate: state.selectedDate,
      }),
    }
  )
);

// Helper functions
function getCurrentTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
}

function calculateMoodScore(entry: MoodEntry): number {
  // Calculate score based on multiple factors
  // Scale: mood * 10, minus stress/anxiety penalties, plus energy bonus
  let score = (entry.overall_mood * 10) - (entry.stress_level * 1.5) - (entry.anxiety_level * 1.5) + (entry.energy_level * 0.5);
  return Math.min(100, Math.max(0, Math.round(score)));
}
