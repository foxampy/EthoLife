/**
 * Health Store - Zustand Store для управления состоянием здоровья
 * Единый store для всех 7 модулей здоровья
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { healthAPI } from '@/services/healthAPI';
import type {
  HealthMetric,
  MetricSummary,
  HealthGoal,
  HealthPlan,
  AnalyticsData,
  ModuleScore,
} from '@/types/health-modules';

// ============================================================================
# STATE INTERFACES
# ============================================================================

interface ModuleState {
  // Метрики
  metrics: Record<string, HealthMetric[]>; // key: moduleId
  metricSummaries: Record<string, MetricSummary[]>; // key: moduleId
  
  // Цели
  goals: HealthGoal[];
  activeGoals: HealthGoal[];
  completedGoals: HealthGoal[];
  
  // Планы
  plans: HealthPlan[];
  activePlans: HealthPlan[];
  
  // Аналитика
  analytics: Record<string, AnalyticsData>; // key: moduleId
  
  // Scores
  moduleScores: Record<string, ModuleScore>; // key: moduleId
  overallScore: number;
  
  // Загрузка
  loading: Record<string, boolean>;
  error: string | null;
  
  // Actions
  actions: HealthActions;
}

interface HealthActions {
  // Metrics
  loadMetrics: (moduleId: string, options?: any) => Promise<void>;
  addMetric: (moduleId: string, data: any) => Promise<HealthMetric>;
  updateMetric: (moduleId: string, metricId: string, data: any) => Promise<void>;
  deleteMetric: (moduleId: string, metricId: string) => Promise<void>;
  
  // Goals
  loadGoals: (moduleId?: string, status?: string) => Promise<void>;
  createGoal: (data: any) => Promise<HealthGoal>;
  updateGoal: (goalId: string, data: any) => Promise<void>;
  completeGoal: (goalId: string) => Promise<void>;
  
  // Plans
  loadPlans: (moduleId?: string, status?: string) => Promise<void>;
  createPlan: (data: any) => Promise<HealthPlan>;
  completePlanTask: (planId: string, taskId: string) => Promise<void>;
  
  // Analytics
  loadAnalytics: (moduleId: string, period?: string) => Promise<void>;
  loadDashboard: () => Promise<void>;
  
  // Common
  setLoading: (key: string, value: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// ============================================================================
# INITIAL STATE
# ============================================================================

const initialState: Omit<ModuleState, 'actions'> = {
  metrics: {},
  metricSummaries: {},
  goals: [],
  activeGoals: [],
  completedGoals: [],
  plans: [],
  activePlans: [],
  analytics: {},
  moduleScores: {},
  overallScore: 0,
  loading: {},
  error: null,
};

// ============================================================================
# STORE
# ============================================================================

export const useHealthStore = create<ModuleState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      actions: {
        // ============================================================================
        // METRICS ACTIONS
        // ============================================================================
        
        loadMetrics: async (moduleId: string, options = {}) => {
          set({ loading: { ...get().loading, [moduleId]: true }, error: null });
          
          try {
            const metrics = await healthAPI.getMetrics(moduleId, options);
            const summaries = await healthAPI.getMetricSummary(moduleId);
            
            set({
              metrics: { ...get().metrics, [moduleId]: metrics },
              metricSummaries: { ...get().metricSummaries, [moduleId]: summaries },
              loading: { ...get().loading, [moduleId]: false },
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to load metrics',
              loading: { ...get().loading, [moduleId]: false },
            });
          }
        },
        
        addMetric: async (moduleId: string, data: any) => {
          const metric = await healthAPI.addMetric(moduleId, data);
          
          const currentMetrics = get().metrics[moduleId] || [];
          set({
            metrics: {
              ...get().metrics,
              [moduleId]: [...currentMetrics, metric],
            },
          });
          
          return metric;
        },
        
        updateMetric: async (moduleId: string, metricId: string, data: any) => {
          await healthAPI.updateMetric(moduleId, metricId, data);
          
          const metrics = get().metrics[moduleId] || [];
          const updatedMetrics = metrics.map(m =>
            m.id === metricId ? { ...m, ...data } : m
          );
          
          set({
            metrics: {
              ...get().metrics,
              [moduleId]: updatedMetrics,
            },
          });
        },
        
        deleteMetric: async (moduleId: string, metricId: string) => {
          await healthAPI.deleteMetric(moduleId, metricId);
          
          const metrics = get().metrics[moduleId] || [];
          const filteredMetrics = metrics.filter(m => m.id !== metricId);
          
          set({
            metrics: {
              ...get().metrics,
              [moduleId]: filteredMetrics,
            },
          });
        },
        
        // ============================================================================
        // GOALS ACTIONS
        // ============================================================================
        
        loadGoals: async (moduleId, status = 'all') => {
          set({ loading: { ...get().loading, goals: true }, error: null });
          
          try {
            const goals = await healthAPI.getGoals(moduleId, status as any);
            
            set({
              goals,
              activeGoals: goals.filter(g => g.status === 'active'),
              completedGoals: goals.filter(g => g.status === 'completed'),
              loading: { ...get().loading, goals: false },
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to load goals',
              loading: { ...get().loading, goals: false },
            });
          }
        },
        
        createGoal: async (data: any) => {
          const goal = await healthAPI.createGoal(data);
          
          set({
            goals: [...get().goals, goal],
            activeGoals: [...get().activeGoals, goal],
          });
          
          return goal;
        },
        
        updateGoal: async (goalId: string, data: any) => {
          await healthAPI.updateGoal(goalId, data);
          
          const goals = get().goals.map(g =>
            g.id === goalId ? { ...g, ...data } : g
          );
          
          set({
            goals,
            activeGoals: goals.filter(g => g.status === 'active'),
            completedGoals: goals.filter(g => g.status === 'completed'),
          });
        },
        
        completeGoal: async (goalId: string) => {
          await healthAPI.completeGoal(goalId);
          
          const goals = get().goals.map(g =>
            g.id === goalId ? { ...g, status: 'completed' as const } : g
          );
          
          set({
            goals,
            activeGoals: goals.filter(g => g.status === 'active'),
            completedGoals: goals.filter(g => g.status === 'completed'),
          });
        },
        
        // ============================================================================
        // PLANS ACTIONS
        // ============================================================================
        
        loadPlans: async (moduleId, status = 'all') => {
          set({ loading: { ...get().loading, plans: true }, error: null });
          
          try {
            const plans = await healthAPI.getPlans(moduleId, status as any);
            
            set({
              plans,
              activePlans: plans.filter(p => p.status === 'active'),
              loading: { ...get().loading, plans: false },
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to load plans',
              loading: { ...get().loading, plans: false },
            });
          }
        },
        
        createPlan: async (data: any) => {
          const plan = await healthAPI.createPlan(data);
          
          set({
            plans: [...get().plans, plan],
            activePlans: [...get().activePlans, plan],
          });
          
          return plan;
        },
        
        completePlanTask: async (planId: string, taskId: string) => {
          const updatedPlan = await healthAPI.completePlanTask(planId, taskId);
          
          const plans = get().plans.map(p =>
            p.id === planId ? updatedPlan : p
          );
          
          set({
            plans,
            activePlans: plans.filter(p => p.status === 'active'),
          });
        },
        
        // ============================================================================
        // ANALYTICS ACTIONS
        // ============================================================================
        
        loadAnalytics: async (moduleId: string, period = 'week') => {
          set({ loading: { ...get().loading, [`analytics_${moduleId}`]: true }, error: null });
          
          try {
            const analytics = await healthAPI.getAnalytics(moduleId, period as any);
            
            set({
              analytics: { ...get().analytics, [moduleId]: analytics },
              loading: { ...get().loading, [`analytics_${moduleId}`]: false },
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to load analytics',
              loading: { ...get().loading, [`analytics_${moduleId}`]: false },
            });
          }
        },
        
        loadDashboard: async () => {
          set({ loading: { ...get().loading, dashboard: true }, error: null });
          
          try {
            const dashboard = await healthAPI.getHealthDashboard();
            
            set({
              overallScore: dashboard.overall_score,
              moduleScores: dashboard.modules.reduce((acc: any, module: any) => ({
                ...acc,
                [module.id]: module.score,
              }), {}),
              loading: { ...get().loading, dashboard: false },
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to load dashboard',
              loading: { ...get().loading, dashboard: false },
            });
          }
        },
        
        // ============================================================================
        // COMMON ACTIONS
        // ============================================================================
        
        setLoading: (key: string, value: boolean) => {
          set({
            loading: { ...get().loading, [key]: value },
          });
        },
        
        setError: (error: string | null) => {
          set({ error });
        },
        
        clearError: () => {
          set({ error: null });
        },
      },
    }),
    {
      name: 'health-storage',
      partialize: (state) => ({
        goals: state.goals,
        plans: state.plans,
        overallScore: state.overall_score,
      }),
    }
  )
);

// ============================================================================
# HOOKS
# ============================================================================

export const useModuleMetrics = (moduleId: string) => {
  const metrics = useHealthStore((state) => state.metrics[moduleId] || []);
  const summaries = useHealthStore((state) => state.metricSummaries[moduleId] || []);
  const loadMetrics = useHealthStore((state) => state.actions.loadMetrics);
  
  return { metrics, summaries, loadMetrics };
};

export const useModuleGoals = (moduleId?: string) => {
  const goals = useHealthStore((state) => {
    if (!moduleId) return state.goals;
    return state.goals.filter(g => g.module_id === moduleId);
  });
  const activeGoals = useHealthStore((state) => {
    if (!moduleId) return state.activeGoals;
    return state.activeGoals.filter(g => g.module_id === moduleId);
  });
  const loadGoals = useHealthStore((state) => state.actions.loadGoals);
  const createGoal = useHealthStore((state) => state.actions.createGoal);
  
  return { goals, activeGoals, loadGoals, createGoal };
};

export const useModulePlans = (moduleId?: string) => {
  const plans = useHealthStore((state) => {
    if (!moduleId) return state.plans;
    return state.plans.filter(p => p.module_id === moduleId);
  });
  const activePlans = useHealthStore((state) => {
    if (!moduleId) return state.activePlans;
    return state.activePlans.filter(p => p.module_id === moduleId);
  });
  const loadPlans = useHealthStore((state) => state.actions.loadPlans);
  const createPlan = useHealthStore((state) => state.actions.createPlan);
  
  return { plans, activePlans, loadPlans, createPlan };
};

export const useModuleAnalytics = (moduleId: string) => {
  const analytics = useHealthStore((state) => state.analytics[moduleId]);
  const loadAnalytics = useHealthStore((state) => state.actions.loadAnalytics);
  
  return { analytics, loadAnalytics };
};

export const useHealthScore = () => {
  const overallScore = useHealthStore((state) => state.overallScore);
  const moduleScores = useHealthStore((state) => state.moduleScores);
  const loadDashboard = useHealthStore((state) => state.actions.loadDashboard);
  
  return { overallScore, moduleScores, loadDashboard };
};

export default useHealthStore;
