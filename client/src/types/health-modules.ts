/**
 * Health Modules - Unified Architecture
 * Базовые типы и интерфейсы для всех модулей здоровья
 */

// ============================================================================
// БАЗОВЫЕ ТИПЫ
// ============================================================================

export type HealthModuleId =
  | 'nutrition'
  | 'movement'
  | 'sleep'
  | 'psychology'
  | 'medicine'
  | 'relationships'
  | 'habits';

export type MetricType = string;

export type Frequency =
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'once'
  | 'custom';

export type GoalCategory =
  | 'health'
  | 'fitness'
  | 'nutrition'
  | 'mental'
  | 'social'
  | 'spiritual';

export type PlanType =
  | 'assessment'
  | 'intervention'
  | 'maintenance'
  | 'prevention';

// ============================================================================
// ИНТЕРФЕЙСЫ МОДУЛЕЙ
// ============================================================================

export interface HealthModule {
  id: HealthModuleId;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  enabled: boolean;
  features: ModuleFeature[];
}

export interface ModuleFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  config?: Record<string, any>;
}

// ============================================================================
// МЕТРИКИ И ДАННЫЕ
// ============================================================================

export interface HealthMetric {
  id: string;
  user_id: string;
  module_id: HealthModuleId;
  metric_type: MetricType;
  value: number | string | boolean;
  unit?: string;
  recorded_at: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
  source?: 'manual' | 'device' | 'ai' | 'import';
}

export interface MetricDefinition {
  id: string;
  module_id: HealthModuleId;
  name: string;
  description: string;
  unit: string;
  data_type: 'number' | 'string' | 'boolean' | 'enum';
  min_value?: number;
  max_value?: number;
  enum_values?: string[];
  category: string;
  icon?: string;
  color?: string;
  is_core: boolean;
  is_optional: boolean;
}

export interface MetricSummary {
  metric_type: string;
  current_value: number | string;
  previous_value?: number | string;
  change: number;
  change_percentage: number;
  trend: 'up' | 'down' | 'stable' | 'unknown';
  average_7d?: number;
  average_30d?: number;
  goal_value?: number;
  goal_progress?: number; // 0-100
  last_updated: string;
}

// ============================================================================
// ЦЕЛИ И ПЛАНЫ
// ============================================================================

export interface HealthGoal {
  id: string;
  user_id: string;
  module_id: HealthModuleId;
  title: string;
  description?: string;
  category: GoalCategory;
  target_value?: number;
  current_value?: number;
  unit?: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number; // 0-100
  milestones?: GoalMilestone[];
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  target_value: number;
  completed: boolean;
  completed_at?: string;
  reward_unity?: number;
}

export interface HealthPlan {
  id: string;
  user_id: string;
  module_id: HealthModuleId;
  title: string;
  description?: string;
  type: PlanType;
  duration_days: number;
  start_date: string;
  end_date: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  tasks: PlanTask[];
  recommendations: PlanRecommendation[];
  progress: number; // 0-100
  created_by: 'user' | 'ai' | 'specialist';
  created_at: string;
  updated_at: string;
}

export interface PlanTask {
  id: string;
  title: string;
  description?: string;
  type: 'assessment' | 'action' | 'measurement' | 'education';
  frequency: Frequency;
  schedule?: string; // cron expression
  completed_count: number;
  target_count?: number;
  unit?: string;
  metadata?: Record<string, any>;
}

export interface PlanRecommendation {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  evidence_level?: 'a' | 'b' | 'c' | 'd';
  source?: string;
  action_url?: string;
}

// ============================================================================
# ANALYTICS И ОТЧЕТЫ
# ============================================================================

export interface AnalyticsData {
  module_id: HealthModuleId;
  period: 'day' | 'week' | 'month' | 'year' | 'all';
  metrics: MetricSummary[];
  trends: TrendData[];
  correlations: CorrelationData[];
  insights: Insight[];
  score: ModuleScore;
  generated_at: string;
}

export interface TrendData {
  metric_type: string;
  data_points: DataPoint[];
  trend_line?: DataPoint[];
  seasonality?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface DataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface CorrelationData {
  metric_1: string;
  metric_2: string;
  correlation_coefficient: number; // -1 to 1
  relationship: 'positive' | 'negative' | 'none';
  strength: 'weak' | 'moderate' | 'strong';
  p_value?: number;
  sample_size: number;
}

export interface Insight {
  id: string;
  type: 'pattern' | 'anomaly' | 'achievement' | 'warning' | 'recommendation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metric_types: string[];
  action_required?: boolean;
  suggested_actions?: string[];
  created_at: string;
}

export interface ModuleScore {
  overall: number; // 0-100
  components: ScoreComponent[];
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  percentile?: number; // compared to other users
  history: ScoreHistory[];
}

export interface ScoreComponent {
  name: string;
  score: number; // 0-100
  weight: number; // 0-1
  metrics: string[];
}

export interface ScoreHistory {
  date: string;
  score: number;
  grade: string;
}

// ============================================================================
# БИБЛИОТЕКА И КОНТЕНТ
# ============================================================================

export interface LibraryItem {
  id: string;
  module_id: HealthModuleId;
  type: 'article' | 'video' | 'audio' | 'program' | 'recipe' | 'exercise' | 'assessment';
  title: string;
  description: string;
  content?: string; // markdown
  media_url?: string;
  duration_minutes?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  category: string;
  subcategory?: string;
  author?: string;
  source?: string;
  language: 'ru' | 'en';
  is_premium: boolean;
  views?: number;
  rating?: number; // 1-5
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface Assessment {
  id: string;
  module_id: HealthModuleId;
  name: string;
  description: string;
  type: 'questionnaire' | 'test' | 'quiz' | 'calculator';
  questions: AssessmentQuestion[];
  scoring: ScoringSystem;
  interpretations: Interpretation[];
  estimated_time_minutes: number;
  is_validated: boolean;
  source?: string;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'single_choice' | 'multiple_choice' | 'scale' | 'text' | 'number';
  options?: string[];
  min_value?: number;
  max_value?: number;
  required: boolean;
  order: number;
}

export interface ScoringSystem {
  type: 'sum' | 'average' | 'weighted' | 'algorithm';
  weights?: Record<string, number>;
  ranges: ScoreRange[];
}

export interface ScoreRange {
  min: number;
  max: number;
  label: string;
  description: string;
  recommendation: string;
}

export interface Interpretation {
  score_range: string;
  title: string;
  description: string;
  recommendations: string[];
  resources?: string[];
}

// ============================================================================
# ИНТЕГРАЦИИ
# ============================================================================

export interface Integration {
  id: string;
  name: string;
  provider: string;
  type: 'wearable' | 'app' | 'service' | 'device';
  status: 'available' | 'connected' | 'disconnected' | 'error';
  logo_url?: string;
  description: string;
  supported_metrics: string[];
  sync_frequency: 'realtime' | 'hourly' | 'daily' | 'manual';
  last_sync?: string;
  config?: Record<string, any>;
  oauth_url?: string;
  disconnect_url?: string;
}

export interface SyncLog {
  id: string;
  integration_id: string;
  user_id: string;
  status: 'success' | 'partial' | 'failed';
  metrics_synced: number;
  errors?: string[];
  started_at: string;
  completed_at: string;
}

// ============================================================================
# УВЕДОМЛЕНИЯ И НАПОМИНАНИЯ
# ============================================================================

export interface Notification {
  id: string;
  user_id: string;
  module_id?: HealthModuleId;
  type: 'reminder' | 'alert' | 'achievement' | 'recommendation' | 'social';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_read: boolean;
  action_url?: string;
  action_label?: string;
  metadata?: Record<string, any>;
  created_at: string;
  read_at?: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  module_id?: HealthModuleId;
  title: string;
  description?: string;
  frequency: Frequency;
  schedule: string; // cron expression
  enabled: boolean;
  notification_type: 'push' | 'email' | 'telegram' | 'sms';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// ============================================================================
# ОТЧЕТЫ И ЭКСПОРТ
# ============================================================================

export interface HealthReport {
  id: string;
  user_id: string;
  type: 'comprehensive' | 'module_specific' | 'progress' | 'sharing';
  module_ids?: HealthModuleId[];
  period_start: string;
  period_end: string;
  format: 'pdf' | 'html' | 'json' | 'csv';
  status: 'generating' | 'ready' | 'failed';
  file_url?: string;
  data: ReportData;
  generated_at: string;
  expires_at?: string;
}

export interface ReportData {
  summary: ReportSummary;
  modules: ReportModule[];
  trends: TrendData[];
  insights: Insight[];
  recommendations: PlanRecommendation[];
  attachments?: string[];
}

export interface ReportSummary {
  overall_score: number;
  total_metrics: number;
  goals_completed: number;
  plans_active: number;
  biggest_improvement: string;
  area_of_concern: string;
  key_achievements: string[];
}

export interface ReportModule {
  module_id: HealthModuleId;
  score: number;
  grade: string;
  key_metrics: MetricSummary[];
  progress: number;
  insights: Insight[];
}

// ============================================================================
# UNITY TOKEN И ГЕЙМИФИКАЦИЯ
# ============================================================================

export interface TokenTransaction {
  id: string;
  user_id: string;
  type: 'earn' | 'spend' | 'burn' | 'transfer';
  amount: number;
  balance_after: number;
  description: string;
  reference_type?: string;
  reference_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  criteria: AchievementCriteria;
  reward_unity: number;
  reward_xp: number;
  is_secret: boolean;
  unlocked_by?: number; // количество пользователей
}

export interface AchievementCriteria {
  type: 'metric_reached' | 'streak' | 'completion' | 'social' | 'special';
  metric_type?: string;
  target_value?: number;
  streak_days?: number;
  goal_id?: string;
  module_id?: HealthModuleId;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  progress?: number; // 0-100 для частичных достижений
  is_claimed: boolean;
  claimed_at?: string;
}

export interface UserLevel {
  user_id: string;
  level: number;
  xp: number;
  xp_to_next_level: number;
  title: string;
  badges: string[];
  multiplier: number;
  unlocked_at: string;
}

// ============================================================================
# СПЕЦИАЛИСТЫ И ДОСТУП
# ============================================================================

export interface SpecialistAccess {
  id: string;
  user_id: string;
  specialist_id: string;
  module_ids: HealthModuleId[];
  access_level: 'view' | 'comment' | 'edit' | 'full';
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
  revoked_at?: string;
  permissions: string[];
}

export interface SpecialistNote {
  id: string;
  specialist_id: string;
  user_id: string;
  module_id?: HealthModuleId;
  title: string;
  content: string;
  type: 'observation' | 'recommendation' | 'diagnosis' | 'plan';
  visibility: 'private' | 'shared' | 'public';
  tags?: string[];
  created_at: string;
  updated_at: string;
}

// ============================================================================
# AI И РЕКОМЕНДАЦИИ
# ============================================================================

export interface AIRecommendation {
  id: string;
  user_id: string;
  module_id: HealthModuleId;
  type: 'action' | 'insight' | 'plan' | 'resource' | 'specialist';
  title: string;
  description: string;
  confidence: number; // 0-1
  evidence: string[];
  action_url?: string;
  priority: 'low' | 'medium' | 'high';
  expires_at?: string;
  is_accepted: boolean;
  accepted_at?: string;
  created_at: string;
}

export interface AIAnalysis {
  id: string;
  user_id: string;
  module_id: HealthModuleId;
  analysis_type: string;
  input_data: Record<string, any>;
  output_data: Record<string, any>;
  model_version: string;
  confidence: number;
  created_at: string;
}

// ============================================================================
# ЭКСПОРТ ВСЕХ ТИПОВ
# ============================================================================

export default {
  HealthModule,
  ModuleFeature,
  HealthMetric,
  MetricDefinition,
  MetricSummary,
  HealthGoal,
  GoalMilestone,
  HealthPlan,
  PlanTask,
  PlanRecommendation,
  AnalyticsData,
  TrendData,
  CorrelationData,
  Insight,
  ModuleScore,
  LibraryItem,
  Assessment,
  Integration,
  Notification,
  Reminder,
  HealthReport,
  TokenTransaction,
  Achievement,
  SpecialistAccess,
  AIRecommendation,
};
