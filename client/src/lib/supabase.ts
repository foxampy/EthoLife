import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      health_profiles: {
        Row: {
          id: string;
          user_id: string;
          birth_date: string | null;
          gender: string | null;
          blood_type: string | null;
          height_cm: number | null;
          current_weight_kg: number | null;
          activity_level: string | null;
          chronotype: string | null;
          medical_conditions: string[] | null;
          allergies: string[] | null;
          medications: string[] | null;
          primary_goal: string | null;
          goal_weight_kg: number | null;
          goal_timeline_date: string | null;
          dietary_restrictions: string[] | null;
          food_allergies: string[] | null;
          preferred_workout_time: string | null;
          current_overall_streak: number;
          longest_overall_streak: number;
          last_check_in_date: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      daily_health_snapshots: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          overall_score: number;
          module_scores: {
            nutrition: number;
            movement: number;
            sleep: number;
            psychology: number;
            medicine: number;
            relationships: number;
            habits: number;
          };
          key_metrics: Record<string, any>;
          streaks: Record<string, number>;
          ai_insights: any[];
          modules_completed: string[];
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
