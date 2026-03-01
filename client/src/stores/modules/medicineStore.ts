import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

// ============================================
// TYPES
// ============================================

export type DrugCategory = 'prescription' | 'otc' | 'supplement' | 'herbal' | 'vitamin';
export type DrugForm = 'tablet' | 'capsule' | 'liquid' | 'injection' | 'cream' | 'patch' | 'inhaler' | 'drops' | 'spray' | 'powder';
export type FrequencyType = 'daily' | 'weekly' | 'as_needed' | 'custom';
export type FoodTiming = 'before' | 'with' | 'after' | 'empty_stomach' | 'no_matter';
export type IntakeStatus = 'taken' | 'skipped' | 'missed' | 'late' | 'early' | 'scheduled';
export type AppointmentType = 'routine' | 'follow_up' | 'urgent' | 'procedure' | 'consultation' | 'telemedicine';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled';
export type ConditionType = 'acute' | 'chronic' | 'recurrent' | 'resolved' | 'in_remission';
export type ConditionSeverity = 'mild' | 'moderate' | 'severe';
export type ConditionStatus = 'active' | 'managed' | 'improving' | 'worsening' | 'resolved' | 'in_remission';
export type ResultFlag = 'low' | 'normal' | 'high' | 'critical_low' | 'critical_high';
export type OverallResultStatus = 'normal' | 'borderline' | 'abnormal' | 'critical';
export type BodySystem = 'general' | 'cardiovascular' | 'respiratory' | 'digestive' | 'neurological' | 'musculoskeletal' | 'skin' | 'mental' | 'reproductive' | 'sensory';

export interface Drug {
  id: string;
  name: string;
  name_generic?: string;
  category: DrugCategory;
  drug_class?: string;
  form: DrugForm;
  dosage_units: string[];
  common_dosages: { amount: number; unit: string }[];
  side_effects: string[];
  contraindications: string[];
  drug_interactions: string[];
  storage_instructions?: string;
  is_prescription_required: boolean;
}

export interface Frequency {
  type: FrequencyType;
  times_per_day?: number;
  specific_times?: string[];
  days_of_week?: number[];
  interval_hours?: number;
}

export interface UserMedication {
  id: string;
  user_id: string;
  drug_id?: string;
  custom_name?: string;
  dosage_amount: number;
  dosage_unit: string;
  frequency: Frequency;
  prescribed_by?: string;
  prescribed_date?: string;
  start_date: string;
  end_date?: string;
  reason?: string;
  instructions?: string;
  with_food: FoodTiming;
  reminder_enabled: boolean;
  reminder_sound?: string;
  refill_reminder_days: number;
  current_stock?: number;
  pharmacy_info?: Record<string, any>;
  is_active: boolean;
  notes?: string;
  drug?: Drug;
}

export interface IntakeLog {
  id: string;
  user_id: string;
  medication_id: string;
  scheduled_time: string;
  taken_at?: string;
  status: IntakeStatus;
  dosage_taken?: number;
  notes?: string;
  location?: { lat: number; lng: number };
  taken_with_food?: boolean;
  side_effects_noted: string[];
  mood_after?: number;
  medication?: UserMedication;
}

export interface SymptomEntry {
  id: string;
  user_id: string;
  symptom_id?: string;
  custom_symptom_name?: string;
  severity: number;
  body_location?: string;
  quality: string[];
  triggers: string[];
  relievers: string[];
  started_at: string;
  ended_at?: string;
  duration_notes?: string;
  associated_symptoms: string[];
  related_factors?: {
    sleep_quality?: number;
    stress_level?: number;
    food?: string;
    activity?: string;
  };
  notes?: string;
}

export interface LabResult {
  id: string;
  user_id: string;
  test_type_id?: string;
  test_name: string;
  ordered_by?: string;
  lab_name?: string;
  date_collected: string;
  date_results?: string;
  results_data: Record<string, any>;
  overall_flag: OverallResultStatus;
  notes?: string;
  file_url?: string;
  is_reviewed: boolean;
  reviewed_by_user_at?: string;
  parameters?: LabParameter[];
}

export interface LabParameter {
  id: string;
  lab_result_id: string;
  parameter_name: string;
  value?: number;
  unit?: string;
  reference_range_low?: number;
  reference_range_high?: number;
  flag: ResultFlag;
  previous_value?: number;
  change_percent?: number;
  trend?: 'improving' | 'worsening' | 'stable' | 'new';
}

export interface Doctor {
  id: string;
  user_id: string;
  name: string;
  specialty?: string;
  clinic_name?: string;
  address?: string;
  phone?: string;
  email?: string;
  is_primary_care: boolean;
  notes?: string;
  is_active: boolean;
}

export interface Appointment {
  id: string;
  user_id: string;
  doctor_id?: string;
  appointment_type: AppointmentType;
  scheduled_date: string;
  scheduled_time?: string;
  duration_minutes: number;
  reason?: string;
  preparation_notes?: string;
  questions_to_ask: string[];
  status: AppointmentStatus;
  outcome_notes?: string;
  diagnosis?: string;
  prescriptions_given: string[];
  follow_up_needed: boolean;
  follow_up_date?: string;
  reminder_enabled: boolean;
  reminder_time?: string;
  doctor?: Doctor;
}

export interface Condition {
  id: string;
  user_id: string;
  icd10_code?: string;
  condition_name: string;
  condition_type: ConditionType;
  diagnosed_by?: string;
  diagnosed_date?: string;
  severity: ConditionSeverity;
  symptoms: string[];
  current_status: ConditionStatus;
  treatment_plan?: string;
  medications: string[];
  related_lab_tests: string[];
  notes?: string;
  is_active: boolean;
}

export interface DrugInteraction {
  id: string;
  user_id: string;
  medication_1_id: string;
  medication_2_id: string;
  interaction_severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  interaction_type?: 'additive_effect' | 'antagonistic' | 'increased_toxicity' | 'decreased_absorption';
  description?: string;
  recommendation?: string;
  is_acknowledged: boolean;
  detected_at: string;
  medication1?: UserMedication;
  medication2?: UserMedication;
}

export interface MedicineInsight {
  id: string;
  user_id: string;
  date: string;
  insight_type: 'pattern' | 'warning' | 'recommendation' | 'drug_interaction' | 'adherence_alert' | 'appointment_reminder' | 'refill_reminder';
  title: string;
  description?: string;
  related_data?: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'critical';
  is_read: boolean;
}

export interface TimeSlot {
  label: string;
  time: string;
  icon: string;
  medications: {
    log: IntakeLog;
    medication: UserMedication;
  }[];
}

export interface TodayMedicine {
  adherenceRate: number;
  takenCount: number;
  scheduledCount: number;
  missedCount: number;
  timeSlots: TimeSlot[];
}

// ============================================
// STORE STATE
// ============================================

interface MedicineState {
  // Data
  medications: UserMedication[];
  todayIntakes: IntakeLog[];
  allIntakes: IntakeLog[];
  symptoms: SymptomEntry[];
  labResults: LabResult[];
  appointments: Appointment[];
  doctors: Doctor[];
  conditions: Condition[];
  interactions: DrugInteraction[];
  insights: MedicineInsight[];
  todayMedicine: TodayMedicine;
  drugCatalog: Drug[];
  
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  initialize: () => Promise<void>;
  fetchMedications: () => Promise<void>;
  fetchTodayIntakes: () => Promise<void>;
  fetchIntakeHistory: (days?: number) => Promise<void>;
  fetchSymptoms: () => Promise<void>;
  fetchLabResults: () => Promise<void>;
  fetchAppointments: () => Promise<void>;
  fetchDoctors: () => Promise<void>;
  fetchConditions: () => Promise<void>;
  fetchInsights: () => Promise<void>;
  fetchDrugCatalog: () => Promise<void>;
  
  // Mutations
  addMedication: (medication: Partial<UserMedication>) => Promise<UserMedication | null>;
  updateMedication: (id: string, updates: Partial<UserMedication>) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  logIntake: (intakeId: string, data: Partial<IntakeLog>) => Promise<void>;
  skipIntake: (intakeId: string, reason?: string) => Promise<void>;
  addSymptom: (symptom: Partial<SymptomEntry>) => Promise<void>;
  updateSymptom: (id: string, updates: Partial<SymptomEntry>) => Promise<void>;
  addLabResult: (result: Partial<LabResult>) => Promise<void>;
  scheduleAppointment: (appointment: Partial<Appointment>) => Promise<void>;
  updateAppointment: (id: string, updates: Partial<Appointment>) => Promise<void>;
  addDoctor: (doctor: Partial<Doctor>) => Promise<void>;
  updateDoctor: (id: string, updates: Partial<Doctor>) => Promise<void>;
  addCondition: (condition: Partial<Condition>) => Promise<void>;
  updateCondition: (id: string, updates: Partial<Condition>) => Promise<void>;
  acknowledgeInteraction: (interactionId: string) => Promise<void>;
  markInsightRead: (insightId: string) => Promise<void>;
  
  // Schedule management
  generateDailySchedule: () => Promise<void>;
  
  // Calculations
  getAdherenceRate: (days?: number) => number;
  checkDrugInteractions: (medicationId?: string) => Promise<DrugInteraction[]>;
  getUpcomingAppointments: (days?: number) => Appointment[];
  getMedicationsByTimeSlot: () => TimeSlot[];
  getRefillNeeded: () => UserMedication[];
  getMissedMedications: () => IntakeLog[];
  
  // Utilities
  getMedicationById: (id: string) => UserMedication | undefined;
  getIntakeById: (id: string) => IntakeLog | undefined;
  formatDosage: (amount?: number, unit?: string) => string;
}

const defaultTodayMedicine: TodayMedicine = {
  adherenceRate: 0,
  takenCount: 0,
  scheduledCount: 0,
  missedCount: 0,
  timeSlots: [],
};

// Time slot definitions
const TIME_SLOTS = [
  { label: 'morning', time: '07:00', icon: 'sun', hour: 7 },
  { label: 'afternoon', time: '13:00', icon: 'sun', hour: 13 },
  { label: 'evening', time: '19:00', icon: 'sunset', hour: 19 },
  { label: 'night', time: '22:00', icon: 'moon', hour: 22 },
];

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useMedicineStore = create<MedicineState>()(
  persist(
    (set, get) => ({
      medications: [],
      todayIntakes: [],
      allIntakes: [],
      symptoms: [],
      labResults: [],
      appointments: [],
      doctors: [],
      conditions: [],
      interactions: [],
      insights: [],
      todayMedicine: defaultTodayMedicine,
      drugCatalog: [],
      isLoading: false,
      isInitialized: false,

      // ============================================
      // INITIALIZATION
      // ============================================
      
      initialize: async () => {
        const { 
          fetchMedications, 
          fetchTodayIntakes, 
          fetchSymptoms, 
          fetchLabResults, 
          fetchAppointments,
          fetchDoctors,
          fetchConditions,
          fetchInsights,
          generateDailySchedule,
        } = get();
        
        set({ isLoading: true });
        
        try {
          await Promise.all([
            fetchMedications(),
            fetchTodayIntakes(),
            fetchSymptoms(),
            fetchLabResults(),
            fetchAppointments(),
            fetchDoctors(),
            fetchConditions(),
            fetchInsights(),
          ]);
          
          await generateDailySchedule();
          set({ isInitialized: true });
        } catch (error) {
          console.error('Error initializing medicine store:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      // ============================================
      // FETCH ACTIONS
      // ============================================
      
      fetchMedications: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('medicine_user_medications')
            .select(`
              *,
              drug:drug_id(*)
            `)
            .eq('user_id', user.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

          if (error) throw error;
          set({ medications: data || [] });
        } catch (error) {
          console.error('Error fetching medications:', error);
        }
      },

      fetchTodayIntakes: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const today = new Date().toISOString().split('T')[0];

          const { data, error } = await supabase
            .from('medicine_intake_log')
            .select(`
              *,
              medication:medication_id(*, drug:drug_id(*))
            `)
            .eq('user_id', user.id)
            .gte('scheduled_time', `${today}T00:00:00`)
            .lte('scheduled_time', `${today}T23:59:59`)
            .order('scheduled_time', { ascending: true });

          if (error) throw error;
          
          const intakes = data || [];
          const takenCount = intakes.filter(i => i.status === 'taken').length;
          const missedCount = intakes.filter(i => i.status === 'missed').length;
          const adherenceRate = intakes.length > 0 ? Math.round((takenCount / intakes.length) * 100) : 0;
          
          set({ 
            todayIntakes: intakes,
            todayMedicine: {
              ...get().todayMedicine,
              adherenceRate,
              takenCount,
              scheduledCount: intakes.length,
              missedCount,
            }
          });
        } catch (error) {
          console.error('Error fetching today intakes:', error);
        }
      },

      fetchIntakeHistory: async (days = 7) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const fromDate = new Date();
          fromDate.setDate(fromDate.getDate() - days);

          const { data, error } = await supabase
            .from('medicine_intake_log')
            .select(`
              *,
              medication:medication_id(*, drug:drug_id(*))
            `)
            .eq('user_id', user.id)
            .gte('scheduled_time', fromDate.toISOString())
            .order('scheduled_time', { ascending: false });

          if (error) throw error;
          set({ allIntakes: data || [] });
        } catch (error) {
          console.error('Error fetching intake history:', error);
        }
      },

      fetchSymptoms: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('medicine_symptom_entries')
            .select('*')
            .eq('user_id', user.id)
            .order('started_at', { ascending: false })
            .limit(50);

          if (error) throw error;
          set({ symptoms: data || [] });
        } catch (error) {
          console.error('Error fetching symptoms:', error);
        }
      },

      fetchLabResults: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('medicine_lab_results')
            .select(`
              *,
              parameters:medicine_lab_parameters(*)
            `)
            .eq('user_id', user.id)
            .order('date_collected', { ascending: false })
            .limit(20);

          if (error) throw error;
          set({ labResults: data || [] });
        } catch (error) {
          console.error('Error fetching lab results:', error);
        }
      },

      fetchAppointments: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('medicine_appointments')
            .select(`
              *,
              doctor:doctor_id(*)
            `)
            .eq('user_id', user.id)
            .order('scheduled_date', { ascending: false })
            .limit(20);

          if (error) throw error;
          set({ appointments: data || [] });
        } catch (error) {
          console.error('Error fetching appointments:', error);
        }
      },

      fetchDoctors: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('medicine_doctors')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .order('name');

          if (error) throw error;
          set({ doctors: data || [] });
        } catch (error) {
          console.error('Error fetching doctors:', error);
        }
      },

      fetchConditions: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('medicine_conditions')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .order('diagnosed_date', { ascending: false });

          if (error) throw error;
          set({ conditions: data || [] });
        } catch (error) {
          console.error('Error fetching conditions:', error);
        }
      },

      fetchInsights: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('medicine_ai_insights')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_read', false)
            .order('created_at', { ascending: false })
            .limit(10);

          if (error) throw error;
          set({ insights: data || [] });
        } catch (error) {
          console.error('Error fetching insights:', error);
        }
      },

      fetchDrugCatalog: async () => {
        try {
          const { data, error } = await supabase
            .from('medicine_drugs')
            .select('*')
            .order('name');

          if (error) throw error;
          set({ drugCatalog: data || [] });
        } catch (error) {
          console.error('Error fetching drug catalog:', error);
        }
      },

      // ============================================
      // MUTATIONS
      // ============================================
      
      addMedication: async (medication) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return null;

          const { data, error } = await supabase
            .from('medicine_user_medications')
            .insert({
              ...medication,
              user_id: user.id,
            })
            .select()
            .single();

          if (error) {
            console.error('Error adding medication:', error);
            return null;
          }

          set((state) => ({
            medications: [data, ...state.medications],
          }));

          // Generate schedule for new medication
          await get().generateDailySchedule();
          
          // Check for interactions
          await get().checkDrugInteractions(data.id);

          return data;
        } catch (error) {
          console.error('Error in addMedication:', error);
          return null;
        }
      },

      updateMedication: async (id, updates) => {
        try {
          const { error } = await supabase
            .from('medicine_user_medications')
            .update(updates)
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            medications: state.medications.map((m) =>
              m.id === id ? { ...m, ...updates } : m
            ),
          }));
        } catch (error) {
          console.error('Error updating medication:', error);
        }
      },

      deleteMedication: async (id) => {
        try {
          const { error } = await supabase
            .from('medicine_user_medications')
            .update({ is_active: false })
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            medications: state.medications.filter((m) => m.id !== id),
          }));
        } catch (error) {
          console.error('Error deleting medication:', error);
        }
      },

      logIntake: async (intakeId, data) => {
        try {
          const { error } = await supabase
            .from('medicine_intake_log')
            .update({
              ...data,
              status: 'taken',
              taken_at: new Date().toISOString(),
            })
            .eq('id', intakeId);

          if (error) throw error;

          await get().fetchTodayIntakes();
          await get().generateDailySchedule();
        } catch (error) {
          console.error('Error logging intake:', error);
        }
      },

      skipIntake: async (intakeId, reason) => {
        try {
          const { error } = await supabase
            .from('medicine_intake_log')
            .update({
              status: 'skipped',
              notes: reason,
            })
            .eq('id', intakeId);

          if (error) throw error;

          await get().fetchTodayIntakes();
          await get().generateDailySchedule();
        } catch (error) {
          console.error('Error skipping intake:', error);
        }
      },

      addSymptom: async (symptom) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('medicine_symptom_entries')
            .insert({
              ...symptom,
              user_id: user.id,
            })
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            symptoms: [data, ...state.symptoms],
          }));
        } catch (error) {
          console.error('Error adding symptom:', error);
        }
      },

      updateSymptom: async (id, updates) => {
        try {
          const { error } = await supabase
            .from('medicine_symptom_entries')
            .update(updates)
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            symptoms: state.symptoms.map((s) =>
              s.id === id ? { ...s, ...updates } : s
            ),
          }));
        } catch (error) {
          console.error('Error updating symptom:', error);
        }
      },

      addLabResult: async (result) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('medicine_lab_results')
            .insert({
              ...result,
              user_id: user.id,
            })
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            labResults: [data, ...state.labResults],
          }));
        } catch (error) {
          console.error('Error adding lab result:', error);
        }
      },

      scheduleAppointment: async (appointment) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('medicine_appointments')
            .insert({
              ...appointment,
              user_id: user.id,
            })
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            appointments: [data, ...state.appointments],
          }));
        } catch (error) {
          console.error('Error scheduling appointment:', error);
        }
      },

      updateAppointment: async (id, updates) => {
        try {
          const { error } = await supabase
            .from('medicine_appointments')
            .update(updates)
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            appointments: state.appointments.map((a) =>
              a.id === id ? { ...a, ...updates } : a
            ),
          }));
        } catch (error) {
          console.error('Error updating appointment:', error);
        }
      },

      addDoctor: async (doctor) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('medicine_doctors')
            .insert({
              ...doctor,
              user_id: user.id,
            })
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            doctors: [data, ...state.doctors],
          }));
        } catch (error) {
          console.error('Error adding doctor:', error);
        }
      },

      updateDoctor: async (id, updates) => {
        try {
          const { error } = await supabase
            .from('medicine_doctors')
            .update(updates)
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            doctors: state.doctors.map((d) =>
              d.id === id ? { ...d, ...updates } : d
            ),
          }));
        } catch (error) {
          console.error('Error updating doctor:', error);
        }
      },

      addCondition: async (condition) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('medicine_conditions')
            .insert({
              ...condition,
              user_id: user.id,
            })
            .select()
            .single();

          if (error) throw error;

          set((state) => ({
            conditions: [data, ...state.conditions],
          }));
        } catch (error) {
          console.error('Error adding condition:', error);
        }
      },

      updateCondition: async (id, updates) => {
        try {
          const { error } = await supabase
            .from('medicine_conditions')
            .update(updates)
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            conditions: state.conditions.map((c) =>
              c.id === id ? { ...c, ...updates } : c
            ),
          }));
        } catch (error) {
          console.error('Error updating condition:', error);
        }
      },

      acknowledgeInteraction: async (interactionId) => {
        try {
          const { error } = await supabase
            .from('medicine_drug_interactions')
            .update({ 
              is_acknowledged: true,
              acknowledged_at: new Date().toISOString(),
            })
            .eq('id', interactionId);

          if (error) throw error;

          set((state) => ({
            interactions: state.interactions.map((i) =>
              i.id === interactionId ? { ...i, is_acknowledged: true } : i
            ),
          }));
        } catch (error) {
          console.error('Error acknowledging interaction:', error);
        }
      },

      markInsightRead: async (insightId) => {
        try {
          const { error } = await supabase
            .from('medicine_ai_insights')
            .update({ 
              is_read: true,
              read_at: new Date().toISOString(),
            })
            .eq('id', insightId);

          if (error) throw error;

          set((state) => ({
            insights: state.insights.filter((i) => i.id !== insightId),
          }));
        } catch (error) {
          console.error('Error marking insight read:', error);
        }
      },

      // ============================================
      // SCHEDULE MANAGEMENT
      // ============================================
      
      generateDailySchedule: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const today = new Date().toISOString().split('T')[0];
          const medications = get().medications;
          
          // Get existing intakes for today
          const { data: existingIntakes } = await supabase
            .from('medicine_intake_log')
            .select('*')
            .eq('user_id', user.id)
            .gte('scheduled_time', `${today}T00:00:00`)
            .lte('scheduled_time', `${today}T23:59:59`);

          const existingMap = new Map(existingIntakes?.map(i => [i.medication_id, i]) || []);
          
          // Create schedule entries for medications without intakes
          for (const med of medications) {
            if (!med.frequency?.specific_times) continue;
            
            for (const time of med.frequency.specific_times) {
              const scheduledTime = `${today}T${time}:00`;
              
              // Check if already exists
              if (!existingMap.has(med.id)) {
                await supabase
                  .from('medicine_intake_log')
                  .insert({
                    user_id: user.id,
                    medication_id: med.id,
                    scheduled_time: scheduledTime,
                    status: 'scheduled',
                  });
              }
            }
          }
          
          // Refresh today's intakes
          await get().fetchTodayIntakes();
        } catch (error) {
          console.error('Error generating daily schedule:', error);
        }
      },

      // ============================================
      // CALCULATIONS
      // ============================================
      
      getAdherenceRate: (days = 7) => {
        const { allIntakes } = get();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const recentIntakes = allIntakes.filter(
          i => new Date(i.scheduled_time) >= cutoffDate
        );
        
        if (recentIntakes.length === 0) return 0;
        
        const takenCount = recentIntakes.filter(i => i.status === 'taken').length;
        return Math.round((takenCount / recentIntakes.length) * 100);
      },

      checkDrugInteractions: async (medicationId) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return [];

          let query = supabase
            .from('medicine_drug_interactions')
            .select(`
              *,
              medication1:medication_1_id(*),
              medication2:medication_2_id(*)
            `)
            .eq('user_id', user.id)
            .eq('is_acknowledged', false);

          if (medicationId) {
            query = query.or(`medication_1_id.eq.${medicationId},medication_2_id.eq.${medicationId}`);
          }

          const { data, error } = await query;

          if (error) throw error;
          
          set({ interactions: data || [] });
          return data || [];
        } catch (error) {
          console.error('Error checking drug interactions:', error);
          return [];
        }
      },

      getUpcomingAppointments: (days = 30) => {
        const { appointments } = get();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() + days);
        
        return appointments
          .filter(a => {
            const apptDate = new Date(a.scheduled_date);
            return a.status === 'scheduled' && apptDate <= cutoffDate && apptDate >= new Date();
          })
          .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime());
      },

      getMedicationsByTimeSlot: () => {
        const { todayIntakes, medications } = get();
        
        const slots: TimeSlot[] = TIME_SLOTS.map(slot => ({
          label: slot.label,
          time: slot.time,
          icon: slot.icon,
          medications: [],
        }));

        for (const intake of todayIntakes) {
          const medication = medications.find(m => m.id === intake.medication_id);
          if (!medication) continue;

          const scheduledHour = new Date(intake.scheduled_time).getHours();
          
          // Find appropriate slot
          let slotIndex = 0;
          if (scheduledHour >= 11 && scheduledHour < 16) slotIndex = 1;
          else if (scheduledHour >= 16 && scheduledHour < 20) slotIndex = 2;
          else if (scheduledHour >= 20 || scheduledHour < 4) slotIndex = 3;
          
          slots[slotIndex].medications.push({ log: intake, medication });
        }

        return slots.filter(s => s.medications.length > 0);
      },

      getRefillNeeded: () => {
        const { medications } = get();
        return medications.filter(m => {
          if (!m.current_stock || !m.refill_reminder_days) return false;
          // Estimate days remaining based on frequency
          const timesPerDay = m.frequency?.times_per_day || 1;
          const daysRemaining = m.current_stock / timesPerDay;
          return daysRemaining <= m.refill_reminder_days;
        });
      },

      getMissedMedications: () => {
        const { todayIntakes } = get();
        const now = new Date();
        
        return todayIntakes.filter(i => {
          if (i.status !== 'scheduled') return false;
          const scheduledTime = new Date(i.scheduled_time);
          return scheduledTime < now;
        });
      },

      // ============================================
      // UTILITIES
      // ============================================
      
      getMedicationById: (id) => {
        return get().medications.find(m => m.id === id);
      },

      getIntakeById: (id) => {
        return get().todayIntakes.find(i => i.id === id);
      },

      formatDosage: (amount, unit) => {
        if (!amount || !unit) return '';
        return `${amount} ${unit}`;
      },
    }),
    {
      name: 'medicine-store',
      partialize: (state) => ({
        isInitialized: state.isInitialized,
      }),
    }
  )
);
