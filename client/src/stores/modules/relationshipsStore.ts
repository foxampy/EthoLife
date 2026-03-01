import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { useHealthStore } from '../healthStore';

// Enums
export type RelationshipType = 'family' | 'partner' | 'friend' | 'colleague' | 'mentor' | 'acquaintance' | 'other';
export type InteractionType = 'call' | 'video_call' | 'text_message' | 'voice_message' | 'in_person' | 'social_media' | 'email' | 'letter' | 'other';
export type PlannedType = 'call' | 'meet' | 'celebrate' | 'gift' | 'support' | 'other';
export type ContactFrequency = 'daily' | 'few_times_week' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'as_needed';
export type LoveLanguage = 'words_of_affirmation' | 'acts_of_service' | 'receiving_gifts' | 'quality_time' | 'physical_touch';
export type InsightType = 'pattern' | 'warning' | 'recommendation' | 'celebration' | 'connection_reminder' | 'balance_alert';

// Interfaces
export interface Contact {
  id: string;
  user_id: string;
  name: string;
  relationship_type: RelationshipType;
  relationship_subtype?: string;
  importance_level: number;
  intimacy_level: number;
  stress_level: number;
  satisfaction_level: number;
  contact_frequency_goal: ContactFrequency;
  preferred_contact_methods: string[];
  birthday?: string;
  anniversary?: string;
  key_memories: string[];
  shared_interests: string[];
  photo_url?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Computed fields
  days_since_contact?: number;
  last_interaction?: Interaction;
}

export interface ContactDetail {
  id: string;
  contact_id: string;
  detail_type: 'phone' | 'email' | 'address' | 'social_media' | 'messenger' | 'other';
  label?: string;
  value: string;
  is_primary: boolean;
  is_active: boolean;
}

export interface Interaction {
  id: string;
  user_id: string;
  contact_id: string;
  contact?: Contact;
  interaction_type: InteractionType;
  initiated_by: 'me' | 'them' | 'mutual';
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  quality_rating: number;
  energy_change: number;
  mood_before?: number;
  mood_after?: number;
  topics_discussed: string[];
  was_supportive: boolean;
  had_conflict: boolean;
  conflict_resolution?: 'resolved' | 'ongoing' | 'avoided' | 'not_discussed';
  location?: string;
  occasion?: string;
  follow_up_needed: boolean;
  follow_up_notes?: string;
  notes?: string;
  created_at: string;
}

export interface PlannedInteraction {
  id: string;
  user_id: string;
  contact_id: string;
  contact?: Contact;
  planned_type: PlannedType;
  scheduled_date: string;
  scheduled_time?: string;
  occasion?: string;
  preparation_needed?: string;
  reminder_enabled: boolean;
  reminder_time?: string;
  is_completed: boolean;
  completed_interaction_id?: string;
  notes?: string;
}

export interface RelationshipAssessment {
  id: string;
  user_id: string;
  contact_id: string;
  assessment_date: string;
  overall_satisfaction: number;
  communication_quality: number;
  trust_level: number;
  support_received: number;
  support_given: number;
  conflict_frequency: 'never' | 'rarely' | 'sometimes' | 'often' | 'constantly';
  conflict_resolution_quality: number;
  shared_values_alignment: number;
  future_outlook: 'improving' | 'stable' | 'declining' | 'uncertain';
  strength_areas: string[];
  growth_areas: string[];
  notes?: string;
}

export interface LoveLanguageEntry {
  id: string;
  user_id: string;
  contact_id: string;
  my_love_language?: LoveLanguage;
  their_love_language_guess?: LoveLanguage;
  their_confirmed_love_language?: LoveLanguage;
  my_satisfaction_giving: number;
  my_satisfaction_receiving: number;
  notes?: string;
}

export interface RelationshipGoal {
  id: string;
  user_id: string;
  contact_id?: string;
  goal_type: 'improve_communication' | 'spend_more_time' | 'resolve_conflict' | 'build_trust' | 'deepen_intimacy' | 'set_boundaries' | 'reconnect' | 'maintain' | 'let_go';
  description: string;
  specific_actions: string[];
  target_date?: string;
  progress_percent: number;
  is_achieved: boolean;
}

export interface AIInsight {
  id: string;
  user_id: string;
  insight_date: string;
  insight_type: InsightType;
  title: string;
  description: string;
  related_contact_id?: string;
  related_contact?: Contact;
  priority: 'low' | 'medium' | 'high';
  suggested_action?: string;
  is_read: boolean;
}

export interface SocialCircleAnalysis {
  id: string;
  user_id: string;
  analysis_date: string;
  total_active_contacts: number;
  avg_interaction_frequency_days: number;
  relationship_distribution: Record<string, number>;
  satisfaction_by_category: Record<string, number>;
  energy_balance: number;
  support_network_strength: number;
  isolation_risk_score: number;
  diversity_score: number;
  reciprocity_score: number;
  ai_insights: string[];
}

// Social balance data
export interface SocialBalance {
  totalGive: number;
  totalReceive: number;
  balance: number;
  byCategory: Record<RelationshipType, { give: number; receive: number; balance: number }>;
  byContact: { contactId: string; name: string; balance: number }[];
}

interface RelationshipsState {
  // Data
  contacts: Contact[];
  interactions: Interaction[];
  plannedInteractions: PlannedInteraction[];
  assessments: RelationshipAssessment[];
  loveLanguages: LoveLanguageEntry[];
  goals: RelationshipGoal[];
  aiInsights: AIInsight[];
  socialAnalysis: SocialCircleAnalysis[];
  
  // UI State
  isLoading: boolean;
  selectedContactId: string | null;
  selectedDate: string;
  
  // Actions
  initialize: () => Promise<void>;
  fetchContacts: () => Promise<void>;
  fetchInteractions: (days?: number) => Promise<void>;
  fetchPlannedInteractions: () => Promise<void>;
  fetchAssessments: () => Promise<void>;
  fetchAIInsights: () => Promise<void>;
  
  addContact: (contactData: Partial<Contact>) => Promise<Contact | null>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  
  logInteraction: (interactionData: Partial<Interaction>) => Promise<Interaction | null>;
  updateInteraction: (id: string, updates: Partial<Interaction>) => Promise<void>;
  deleteInteraction: (id: string) => Promise<void>;
  
  planInteraction: (planData: Partial<PlannedInteraction>) => Promise<PlannedInteraction | null>;
  completePlannedInteraction: (planId: string, interactionId: string) => Promise<void>;
  cancelPlannedInteraction: (planId: string) => Promise<void>;
  
  createAssessment: (assessmentData: Partial<RelationshipAssessment>) => Promise<RelationshipAssessment | null>;
  createGoal: (goalData: Partial<RelationshipGoal>) => Promise<RelationshipGoal | null>;
  updateGoal: (id: string, updates: Partial<RelationshipGoal>) => Promise<void>;
  
  markInsightRead: (id: string) => Promise<void>;
  
  // Getters
  getContactById: (id: string) => Contact | undefined;
  getInteractionsByContact: (contactId: string) => Interaction[];
  getRecentInteractions: (limit?: number) => Interaction[];
  getTodayReminders: () => PlannedInteraction[];
  getUpcomingBirthdays: (days?: number) => Contact[];
  getContactsNeedingAttention: () => Contact[];
  getSocialBalance: (days?: number) => SocialBalance;
  getConnectionHealth: (contactId: string) => { status: 'healthy' | 'needs_attention' | 'at_risk'; score: number };
  getUnreadInsights: () => AIInsight[];
  getRelationshipStreak: () => number;
  getAverageQuality: (days?: number) => number;
}

// Helper: Get days since last contact
const getDaysSinceContact = (contact: Contact, interactions: Interaction[]): number => {
  const contactInteractions = interactions.filter(i => i.contact_id === contact.id);
  if (contactInteractions.length === 0) return Infinity;
  
  const lastInteraction = contactInteractions.sort((a, b) => 
    new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
  )[0];
  
  const days = Math.floor((new Date().getTime() - new Date(lastInteraction.start_time).getTime()) / (1000 * 60 * 60 * 24));
  return days;
};

// Helper: Get frequency in days
const getFrequencyDays = (frequency: ContactFrequency): number => {
  const mapping: Record<ContactFrequency, number> = {
    daily: 1,
    few_times_week: 3,
    weekly: 7,
    biweekly: 14,
    monthly: 30,
    quarterly: 90,
    as_needed: 30,
  };
  return mapping[frequency] || 30;
};

export const useRelationshipsStore = create<RelationshipsState>()(
  persist(
    (set, get) => ({
      contacts: [],
      interactions: [],
      plannedInteractions: [],
      assessments: [],
      loveLanguages: [],
      goals: [],
      aiInsights: [],
      socialAnalysis: [],
      isLoading: false,
      selectedContactId: null,
      selectedDate: new Date().toISOString().split('T')[0],

      initialize: async () => {
        await Promise.all([
          get().fetchContacts(),
          get().fetchInteractions(30),
          get().fetchPlannedInteractions(),
          get().fetchAssessments(),
          get().fetchAIInsights(),
        ]);
      },

      fetchContacts: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('relationships_contacts')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true)
            .order('importance_level', { ascending: false });

          if (!error && data) {
            // Enrich with computed fields
            const contactsWithMeta = data.map(contact => ({
              ...contact,
              days_since_contact: getDaysSinceContact(contact, get().interactions),
            }));
            set({ contacts: contactsWithMeta });
          }
        } catch (err) {
          console.error('Error fetching contacts:', err);
        }
      },

      fetchInteractions: async (days = 30) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const startDate = new Date();
          startDate.setDate(startDate.getDate() - days);

          const { data, error } = await supabase
            .from('relationships_interactions')
            .select('*, contact:relationships_contacts(*)')
            .eq('user_id', user.id)
            .gte('start_time', startDate.toISOString())
            .order('start_time', { ascending: false });

          if (!error && data) {
            set({ interactions: data as Interaction[] });
          }
        } catch (err) {
          console.error('Error fetching interactions:', err);
        }
      },

      fetchPlannedInteractions: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('relationships_planned_interactions')
            .select('*, contact:relationships_contacts(*)')
            .eq('user_id', user.id)
            .eq('is_completed', false)
            .gte('scheduled_date', new Date().toISOString().split('T')[0])
            .order('scheduled_date', { ascending: true });

          if (!error && data) {
            set({ plannedInteractions: data as PlannedInteraction[] });
          }
        } catch (err) {
          console.error('Error fetching planned interactions:', err);
        }
      },

      fetchAssessments: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('relationships_assessments')
            .select('*')
            .eq('user_id', user.id)
            .order('assessment_date', { ascending: false });

          if (!error && data) {
            set({ assessments: data as RelationshipAssessment[] });
          }
        } catch (err) {
          console.error('Error fetching assessments:', err);
        }
      },

      fetchAIInsights: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('relationships_ai_insights')
            .select('*, related_contact:relationships_contacts(*)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20);

          if (!error && data) {
            set({ aiInsights: data as AIInsight[] });
          }
        } catch (err) {
          console.error('Error fetching AI insights:', err);
        }
      },

      addContact: async (contactData) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return null;

          const { data, error } = await supabase
            .from('relationships_contacts')
            .insert({
              ...contactData,
              user_id: user.id,
            })
            .select()
            .single();

          if (error) {
            console.error('Error adding contact:', error);
            return null;
          }

          const contact = data as Contact;
          set((state) => ({ contacts: [contact, ...state.contacts] }));
          return contact;
        } catch (err) {
          console.error('Error in addContact:', err);
          return null;
        }
      },

      updateContact: async (id, updates) => {
        try {
          const { error } = await supabase
            .from('relationships_contacts')
            .update(updates)
            .eq('id', id);

          if (!error) {
            set((state) => ({
              contacts: state.contacts.map(c =>
                c.id === id ? { ...c, ...updates } : c
              ),
            }));
          }
        } catch (err) {
          console.error('Error updating contact:', err);
        }
      },

      deleteContact: async (id) => {
        try {
          const { error } = await supabase
            .from('relationships_contacts')
            .update({ is_active: false })
            .eq('id', id);

          if (!error) {
            set((state) => ({
              contacts: state.contacts.filter(c => c.id !== id),
            }));
          }
        } catch (err) {
          console.error('Error deleting contact:', err);
        }
      },

      logInteraction: async (interactionData) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return null;

          const { data, error } = await supabase
            .from('relationships_interactions')
            .insert({
              ...interactionData,
              user_id: user.id,
              start_time: interactionData.start_time || new Date().toISOString(),
            })
            .select('*, contact:relationships_contacts(*)')
            .single();

          if (error) {
            console.error('Error logging interaction:', error);
            return null;
          }

          const interaction = data as Interaction;
          set((state) => ({ interactions: [interaction, ...state.interactions] }));

          // Update health store
          const qualityScore = interaction.quality_rating * 10;
          useHealthStore.getState().updateModuleScore('relationships', qualityScore);
          useHealthStore.getState().markModuleCompleted('relationships');

          return interaction;
        } catch (err) {
          console.error('Error in logInteraction:', err);
          return null;
        }
      },

      updateInteraction: async (id, updates) => {
        try {
          const { error } = await supabase
            .from('relationships_interactions')
            .update(updates)
            .eq('id', id);

          if (!error) {
            set((state) => ({
              interactions: state.interactions.map(i =>
                i.id === id ? { ...i, ...updates } : i
              ),
            }));
          }
        } catch (err) {
          console.error('Error updating interaction:', err);
        }
      },

      deleteInteraction: async (id) => {
        try {
          const { error } = await supabase
            .from('relationships_interactions')
            .delete()
            .eq('id', id);

          if (!error) {
            set((state) => ({
              interactions: state.interactions.filter(i => i.id !== id),
            }));
          }
        } catch (err) {
          console.error('Error deleting interaction:', err);
        }
      },

      planInteraction: async (planData) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return null;

          const { data, error } = await supabase
            .from('relationships_planned_interactions')
            .insert({
              ...planData,
              user_id: user.id,
            })
            .select('*, contact:relationships_contacts(*)')
            .single();

          if (error) {
            console.error('Error planning interaction:', error);
            return null;
          }

          const plan = data as PlannedInteraction;
          set((state) => ({ plannedInteractions: [plan, ...state.plannedInteractions] }));
          return plan;
        } catch (err) {
          console.error('Error in planInteraction:', err);
          return null;
        }
      },

      completePlannedInteraction: async (planId, interactionId) => {
        try {
          const { error } = await supabase
            .from('relationships_planned_interactions')
            .update({
              is_completed: true,
              completed_interaction_id: interactionId,
            })
            .eq('id', planId);

          if (!error) {
            set((state) => ({
              plannedInteractions: state.plannedInteractions.filter(p => p.id !== planId),
            }));
          }
        } catch (err) {
          console.error('Error completing planned interaction:', err);
        }
      },

      cancelPlannedInteraction: async (planId) => {
        try {
          const { error } = await supabase
            .from('relationships_planned_interactions')
            .delete()
            .eq('id', planId);

          if (!error) {
            set((state) => ({
              plannedInteractions: state.plannedInteractions.filter(p => p.id !== planId),
            }));
          }
        } catch (err) {
          console.error('Error canceling planned interaction:', err);
        }
      },

      createAssessment: async (assessmentData) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return null;

          const { data, error } = await supabase
            .from('relationships_assessments')
            .insert({
              ...assessmentData,
              user_id: user.id,
              assessment_date: new Date().toISOString().split('T')[0],
            })
            .select()
            .single();

          if (error) {
            console.error('Error creating assessment:', error);
            return null;
          }

          const assessment = data as RelationshipAssessment;
          set((state) => ({ assessments: [assessment, ...state.assessments] }));
          return assessment;
        } catch (err) {
          console.error('Error in createAssessment:', err);
          return null;
        }
      },

      createGoal: async (goalData) => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return null;

          const { data, error } = await supabase
            .from('relationships_goals')
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

          const goal = data as RelationshipGoal;
          set((state) => ({ goals: [goal, ...state.goals] }));
          return goal;
        } catch (err) {
          console.error('Error in createGoal:', err);
          return null;
        }
      },

      updateGoal: async (id, updates) => {
        try {
          const { error } = await supabase
            .from('relationships_goals')
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

      markInsightRead: async (id) => {
        try {
          const { error } = await supabase
            .from('relationships_ai_insights')
            .update({ is_read: true })
            .eq('id', id);

          if (!error) {
            set((state) => ({
              aiInsights: state.aiInsights.map(i =>
                i.id === id ? { ...i, is_read: true } : i
              ),
            }));
          }
        } catch (err) {
          console.error('Error marking insight as read:', err);
        }
      },

      // Getters
      getContactById: (id) => {
        return get().contacts.find(c => c.id === id);
      },

      getInteractionsByContact: (contactId) => {
        return get().interactions
          .filter(i => i.contact_id === contactId)
          .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
      },

      getRecentInteractions: (limit = 10) => {
        return get().interactions.slice(0, limit);
      },

      getTodayReminders: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().plannedInteractions.filter(p => p.scheduled_date === today);
      },

      getUpcomingBirthdays: (days = 30) => {
        const today = new Date();
        const future = new Date();
        future.setDate(today.getDate() + days);
        
        return get().contacts.filter(contact => {
          if (!contact.birthday) return false;
          const birthday = new Date(contact.birthday);
          const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
          if (thisYearBirthday < today) {
            thisYearBirthday.setFullYear(today.getFullYear() + 1);
          }
          return thisYearBirthday <= future;
        }).sort((a, b) => {
          const dateA = new Date(a.birthday!);
          const dateB = new Date(b.birthday!);
          const thisYearA = new Date(today.getFullYear(), dateA.getMonth(), dateA.getDate());
          const thisYearB = new Date(today.getFullYear(), dateB.getMonth(), dateB.getDate());
          if (thisYearA < today) thisYearA.setFullYear(today.getFullYear() + 1);
          if (thisYearB < today) thisYearB.setFullYear(today.getFullYear() + 1);
          return thisYearA.getTime() - thisYearB.getTime();
        });
      },

      getContactsNeedingAttention: () => {
        return get().contacts.filter(contact => {
          const daysSince = getDaysSinceContact(contact, get().interactions);
          const frequencyDays = getFrequencyDays(contact.contact_frequency_goal);
          return daysSince > frequencyDays * 1.5;
        }).sort((a, b) => (b.days_since_contact || 0) - (a.days_since_contact || 0));
      },

      getSocialBalance: (days = 30) => {
        const interactions = get().interactions.filter(i => {
          const interactionDate = new Date(i.start_time);
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - days);
          return interactionDate >= cutoff;
        });

        const totalGive = interactions
          .filter(i => i.energy_change < 0)
          .reduce((sum, i) => sum + Math.abs(i.energy_change), 0);
        
        const totalReceive = interactions
          .filter(i => i.energy_change > 0)
          .reduce((sum, i) => sum + i.energy_change, 0);

        // By category
        const byCategory: Record<string, { give: number; receive: number; balance: number }> = {};
        
        interactions.forEach(interaction => {
          const contact = get().contacts.find(c => c.id === interaction.contact_id);
          if (!contact) return;
          
          const type = contact.relationship_type;
          if (!byCategory[type]) {
            byCategory[type] = { give: 0, receive: 0, balance: 0 };
          }
          
          if (interaction.energy_change < 0) {
            byCategory[type].give += Math.abs(interaction.energy_change);
          } else {
            byCategory[type].receive += interaction.energy_change;
          }
        });

        // Calculate balance for each category
        Object.keys(byCategory).forEach(type => {
          byCategory[type].balance = byCategory[type].receive - byCategory[type].give;
        });

        // By contact
        const byContactMap = new Map<string, { name: string; balance: number }>();
        
        interactions.forEach(interaction => {
          const contact = get().contacts.find(c => c.id === interaction.contact_id);
          if (!contact) return;
          
          const existing = byContactMap.get(contact.id);
          if (existing) {
            existing.balance += interaction.energy_change;
          } else {
            byContactMap.set(contact.id, { name: contact.name, balance: interaction.energy_change });
          }
        });

        return {
          totalGive,
          totalReceive,
          balance: totalReceive - totalGive,
          byCategory: byCategory as Record<RelationshipType, { give: number; receive: number; balance: number }>,
          byContact: Array.from(byContactMap.entries()).map(([id, data]) => ({
            contactId: id,
            ...data,
          })).sort((a, b) => b.balance - a.balance),
        };
      },

      getConnectionHealth: (contactId) => {
        const contact = get().contacts.find(c => c.id === contactId);
        if (!contact) return { status: 'at_risk', score: 0 };

        const interactions = get().getInteractionsByContact(contactId);
        const recentInteractions = interactions.slice(0, 5);
        
        if (recentInteractions.length === 0) {
          return { status: 'at_risk', score: 0 };
        }

        // Calculate average quality
        const avgQuality = recentInteractions.reduce((sum, i) => sum + i.quality_rating, 0) / recentInteractions.length;
        
        // Check frequency
        const daysSince = getDaysSinceContact(contact, interactions);
        const frequencyDays = getFrequencyDays(contact.contact_frequency_goal);
        const frequencyScore = Math.max(0, 10 - (daysSince / frequencyDays) * 5);
        
        // Calculate overall score
        const score = Math.round((avgQuality + frequencyScore + contact.satisfaction_level) / 3);
        
        let status: 'healthy' | 'needs_attention' | 'at_risk' = 'healthy';
        if (score < 4 || daysSince > frequencyDays * 2) {
          status = 'at_risk';
        } else if (score < 7 || daysSince > frequencyDays * 1.5) {
          status = 'needs_attention';
        }

        return { status, score };
      },

      getUnreadInsights: () => {
        return get().aiInsights.filter(i => !i.is_read);
      },

      getRelationshipStreak: () => {
        const interactions = get().interactions.sort((a, b) => 
          new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
        );
        
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < interactions.length; i++) {
          const interactionDate = new Date(interactions[i].start_time);
          const expectedDate = new Date(today);
          expectedDate.setDate(expectedDate.getDate() - i);
          
          if (interactionDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
            streak++;
          } else {
            break;
          }
        }
        
        return streak;
      },

      getAverageQuality: (days = 7) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        
        const recent = get().interactions.filter(i => 
          new Date(i.start_time) >= cutoff
        );
        
        if (recent.length === 0) return 0;
        return Math.round(recent.reduce((sum, i) => sum + i.quality_rating, 0) / recent.length);
      },
    }),
    {
      name: 'relationships-store',
      partialize: (state) => ({
        selectedContactId: state.selectedContactId,
        selectedDate: state.selectedDate,
      }),
    }
  )
);
