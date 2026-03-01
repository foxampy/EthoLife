import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { useHealthStore } from '../healthStore';

export interface Food {
  id: string;
  name: string;
  name_ru?: string;
  brand?: string;
  barcode?: string;
  category: string;
  serving_size: number;
  serving_unit: string;
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  is_verified: boolean;
}

export interface DiaryEntry {
  id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout' | 'other';
  food_id?: string;
  custom_name?: string;
  amount: number;
  unit: string;
  calculated_nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  photo_url?: string;
  logged_at: string;
}

export interface NutritionGoals {
  id: string;
  target_calories: number;
  macro_goals: {
    protein_percent: number;
    carbs_percent: number;
    fat_percent: number;
  };
  target_water_ml: number;
}

export interface WaterLog {
  id: string;
  date: string;
  amount_ml: number;
  logged_at: string;
}

interface NutritionState {
  // Data
  foods: Food[];
  todayEntries: DiaryEntry[];
  goals: NutritionGoals | null;
  waterLogs: WaterLog[];
  
  // UI State
  isLoading: boolean;
  selectedDate: string;
  
  // Actions
  initialize: () => Promise<void>;
  fetchFoods: (search?: string) => Promise<void>;
  fetchTodayEntries: () => Promise<void>;
  fetchGoals: () => Promise<void>;
  fetchWaterLogs: () => Promise<void>;
  
  addEntry: (entry: Partial<DiaryEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  
  addWater: (amount: number) => Promise<void>;
  deleteWater: (id: string) => Promise<void>;
  
  updateGoals: (goals: Partial<NutritionGoals>) => Promise<void>;
  
  // Getters
  getTotals: () => { calories: number; protein: number; carbs: number; fat: number };
  getRemaining: () => { calories: number; protein: number; carbs: number; fat: number };
  getWaterTotal: () => number;
  getMealEntries: (mealType: string) => DiaryEntry[];
  getMacroPercentages: () => { protein: number; carbs: number; fat: number };
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      foods: [],
      todayEntries: [],
      goals: null,
      waterLogs: [],
      isLoading: false,
      selectedDate: new Date().toISOString().split('T')[0],

      initialize: async () => {
        await Promise.all([
          get().fetchGoals(),
          get().fetchTodayEntries(),
          get().fetchWaterLogs(),
        ]);
      },

      fetchFoods: async (search) => {
        try {
          let query = supabase
            .from('nutrition_foods')
            .select('*')
            .eq('is_verified', true)
            .limit(50);
          
          if (search) {
            query = query.or(`name.ilike.%${search}%,name_ru.ilike.%${search}%`);
          }
          
          const { data, error } = await query;
          
          if (!error && data) {
            set({ foods: data as Food[] });
          }
        } catch (err) {
          console.error('Error fetching foods:', err);
        }
      },

      fetchTodayEntries: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const today = new Date().toISOString().split('T')[0];

          const { data, error } = await supabase
            .from('nutrition_diary_entries')
            .select('*, food:food_id(name, name_ru, category)')
            .eq('user_id', user.id)
            .eq('date', today)
            .order('logged_at', { ascending: false });

          if (!error && data) {
            set({ todayEntries: data as DiaryEntry[] });
          }
        } catch (err) {
          console.error('Error fetching entries:', err);
        }
      },

      fetchGoals: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('nutrition_goals')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .single();

          if (!error && data) {
            set({ goals: data as NutritionGoals });
          } else if (error?.code === 'PGRST116') {
            // Create default goals
            const { data: newGoals, error: createError } = await supabase
              .from('nutrition_goals')
              .insert({
                user_id: user.id,
                target_calories: 2000,
                macro_goals: { protein_percent: 30, carbs_percent: 40, fat_percent: 30 },
                target_water_ml: 2000,
              })
              .select()
              .single();
            
            if (!createError && newGoals) {
              set({ goals: newGoals as NutritionGoals });
            }
          }
        } catch (err) {
          console.error('Error fetching goals:', err);
        }
      },

      fetchWaterLogs: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const today = new Date().toISOString().split('T')[0];

          const { data, error } = await supabase
            .from('nutrition_water_log')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', today)
            .order('logged_at', { ascending: false });

          if (!error && data) {
            set({ waterLogs: data as WaterLog[] });
          }
        } catch (err) {
          console.error('Error fetching water logs:', err);
        }
      },

      addEntry: async (entry) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const today = new Date().toISOString().split('T')[0];

          const { data, error } = await supabase
            .from('nutrition_diary_entries')
            .insert({
              ...entry,
              user_id: user.id,
              date: today,
            })
            .select()
            .single();

          if (!error && data) {
            set((state) => ({
              todayEntries: [data as DiaryEntry, ...state.todayEntries],
            }));

            // Update health store score
            const totals = get().getTotals();
            const goals = get().goals;
            if (goals) {
              const calorieScore = Math.min(100, Math.round((totals.calories / goals.target_calories) * 100));
              useHealthStore.getState().updateModuleScore('nutrition', calorieScore);
              useHealthStore.getState().updateKeyMetric('calories_consumed', totals.calories);
            }
          }
        } catch (err) {
          console.error('Error adding entry:', err);
        }
      },

      deleteEntry: async (id) => {
        try {
          const { error } = await supabase
            .from('nutrition_diary_entries')
            .delete()
            .eq('id', id);

          if (!error) {
            set((state) => ({
              todayEntries: state.todayEntries.filter((e) => e.id !== id),
            }));
          }
        } catch (err) {
          console.error('Error deleting entry:', err);
        }
      },

      addWater: async (amount) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const today = new Date().toISOString().split('T')[0];

          const { data, error } = await supabase
            .from('nutrition_water_log')
            .insert({
              user_id: user.id,
              date: today,
              amount_ml: amount,
            })
            .select()
            .single();

          if (!error && data) {
            set((state) => ({
              waterLogs: [data as WaterLog, ...state.waterLogs],
            }));
            
            // Update health store
            const total = get().getWaterTotal() + amount;
            useHealthStore.getState().updateKeyMetric('water_ml', total);
          }
        } catch (err) {
          console.error('Error adding water:', err);
        }
      },

      deleteWater: async (id) => {
        try {
          const { error } = await supabase
            .from('nutrition_water_log')
            .delete()
            .eq('id', id);

          if (!error) {
            set((state) => ({
              waterLogs: state.waterLogs.filter((w) => w.id !== id),
            }));
          }
        } catch (err) {
          console.error('Error deleting water:', err);
        }
      },

      updateGoals: async (goals) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { error } = await supabase
            .from('nutrition_goals')
            .update(goals)
            .eq('user_id', user.id)
            .eq('is_active', true);

          if (!error) {
            set((state) => ({
              goals: state.goals ? { ...state.goals, ...goals } : null,
            }));
          }
        } catch (err) {
          console.error('Error updating goals:', err);
        }
      },

      getTotals: () => {
        return get().todayEntries.reduce(
          (acc, entry) => ({
            calories: acc.calories + (entry.calculated_nutrients?.calories || 0),
            protein: acc.protein + (entry.calculated_nutrients?.protein || 0),
            carbs: acc.carbs + (entry.calculated_nutrients?.carbs || 0),
            fat: acc.fat + (entry.calculated_nutrients?.fat || 0),
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );
      },

      getRemaining: () => {
        const totals = get().getTotals();
        const goals = get().goals;
        
        if (!goals) return { calories: 0, protein: 0, carbs: 0, fat: 0 };

        const targetProtein = (goals.target_calories * goals.macro_goals.protein_percent) / 100 / 4;
        const targetCarbs = (goals.target_calories * goals.macro_goals.carbs_percent) / 100 / 4;
        const targetFat = (goals.target_calories * goals.macro_goals.fat_percent) / 100 / 9;

        return {
          calories: Math.max(0, goals.target_calories - totals.calories),
          protein: Math.max(0, targetProtein - totals.protein),
          carbs: Math.max(0, targetCarbs - totals.carbs),
          fat: Math.max(0, targetFat - totals.fat),
        };
      },

      getWaterTotal: () => {
        return get().waterLogs.reduce((acc, log) => acc + log.amount_ml, 0);
      },

      getMealEntries: (mealType) => {
        return get().todayEntries.filter((e) => e.meal_type === mealType);
      },

      getMacroPercentages: () => {
        const totals = get().getTotals();
        const totalCalories = totals.calories;
        
        if (totalCalories === 0) return { protein: 0, carbs: 0, fat: 0 };

        // Calculate calories from each macro
        const proteinCals = totals.protein * 4;
        const carbsCals = totals.carbs * 4;
        const fatCals = totals.fat * 9;

        return {
          protein: Math.round((proteinCals / totalCalories) * 100),
          carbs: Math.round((carbsCals / totalCalories) * 100),
          fat: Math.round((fatCals / totalCalories) * 100),
        };
      },
    }),
    {
      name: 'nutrition-store',
      partialize: (state) => ({
        goals: state.goals,
        selectedDate: state.selectedDate,
      }),
    }
  )
);
