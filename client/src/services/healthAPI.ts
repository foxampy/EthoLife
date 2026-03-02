/**
 * Health Modules API Service
 * Единый сервис для работы со всеми модулями здоровья
 */

import { API_CONFIG, ENDPOINTS } from '@/config';
import type {
  HealthMetric,
  MetricDefinition,
  MetricSummary,
  HealthGoal,
  HealthPlan,
  AnalyticsData,
  LibraryItem,
  Assessment,
  Integration,
  HealthReport,
} from '@/types/health-modules';

// ============================================================================
// БАЗОВЫЙ API КЛИЕНТ
// ============================================================================

class HealthAPI {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': this.token ? `Bearer ${this.token}` : '',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ============================================================================
  // МЕТРИКИ
  // ============================================================================

  /**
   * Получить метрики пользователя
   */
  async getMetrics(
    moduleId: string,
    options?: {
      limit?: number;
      startDate?: string;
      endDate?: string;
      metricType?: string;
    }
  ): Promise<HealthMetric[]> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.startDate) params.append('start_date', options.startDate);
    if (options?.endDate) params.append('end_date', options.endDate);
    if (options?.metricType) params.append('metric_type', options.metricType);

    const queryString = params.toString();
    const endpoint = `/api/health/${moduleId}/metrics${queryString ? `?${queryString}` : ''}`;
    
    return this.request<HealthMetric[]>(endpoint);
  }

  /**
   * Добавить метрику
   */
  async addMetric(
    moduleId: string,
    data: {
      metric_type: string;
      value: number | string | boolean;
      unit?: string;
      recorded_at?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<HealthMetric> {
    return this.request<HealthMetric>(`/api/health/${moduleId}/metrics`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Обновить метрику
   */
  async updateMetric(
    moduleId: string,
    metricId: string,
    data: Partial<HealthMetric>
  ): Promise<HealthMetric> {
    return this.request<HealthMetric>(
      `/api/health/${moduleId}/metrics/${metricId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * Удалить метрику
   */
  async deleteMetric(moduleId: string, metricId: string): Promise<void> {
    await this.request<void>(
      `/api/health/${moduleId}/metrics/${metricId}`,
      {
        method: 'DELETE',
      }
    );
  }

  /**
   * Получить сводку метрик
   */
  async getMetricSummary(
    moduleId: string,
    period: 'day' | 'week' | 'month' | 'year' = 'week'
  ): Promise<MetricSummary[]> {
    return this.request<MetricSummary[]>(
      `/api/health/${moduleId}/metrics/summary?period=${period}`
    );
  }

  // ============================================================================
  // ЦЕЛИ
  // ============================================================================

  /**
   * Получить цели пользователя
   */
  async getGoals(
    moduleId?: string,
    status?: 'active' | 'completed' | 'all'
  ): Promise<HealthGoal[]> {
    const params = new URLSearchParams();
    if (moduleId) params.append('module_id', moduleId);
    if (status) params.append('status', status);

    const queryString = params.toString();
    const endpoint = `/api/health/goals${queryString ? `?${queryString}` : ''}`;
    
    return this.request<HealthGoal[]>(endpoint);
  }

  /**
   * Создать цель
   */
  async createGoal(data: {
    module_id: string;
    title: string;
    description?: string;
    category: string;
    target_value?: number;
    unit?: string;
    end_date?: string;
    priority?: string;
  }): Promise<HealthGoal> {
    return this.request<HealthGoal>('/api/health/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Обновить цель
   */
  async updateGoal(goalId: string, data: Partial<HealthGoal>): Promise<HealthGoal> {
    return this.request<HealthGoal>(`/api/health/goals/${goalId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Обновить прогресс цели
   */
  async updateGoalProgress(
    goalId: string,
    currentValue: number
  ): Promise<HealthGoal> {
    return this.request<HealthGoal>(`/api/health/goals/${goalId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ current_value: currentValue }),
    });
  }

  /**
   * Завершить цель
   */
  async completeGoal(goalId: string): Promise<HealthGoal> {
    return this.request<HealthGoal>(`/api/health/goals/${goalId}/complete`, {
      method: 'POST',
    });
  }

  // ============================================================================
  // ПЛАНЫ
  // ============================================================================

  /**
   * Получить планы пользователя
   */
  async getPlans(
    moduleId?: string,
    status?: 'active' | 'completed' | 'all'
  ): Promise<HealthPlan[]> {
    const params = new URLSearchParams();
    if (moduleId) params.append('module_id', moduleId);
    if (status) params.append('status', status);

    const queryString = params.toString();
    const endpoint = `/api/health/plans${queryString ? `?${queryString}` : ''}`;
    
    return this.request<HealthPlan[]>(endpoint);
  }

  /**
   * Создать план
   */
  async createPlan(data: {
    module_id: string;
    title: string;
    description?: string;
    type: string;
    duration_days: number;
    start_date: string;
    tasks?: any[];
  }): Promise<HealthPlan> {
    return this.request<HealthPlan>('/api/health/plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Обновить план
   */
  async updatePlan(planId: string, data: Partial<HealthPlan>): Promise<HealthPlan> {
    return this.request<HealthPlan>(`/api/health/plans/${planId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Выполнить задачу плана
   */
  async completePlanTask(planId: string, taskId: string): Promise<HealthPlan> {
    return this.request<HealthPlan>(
      `/api/health/plans/${planId}/tasks/${taskId}/complete`,
      {
        method: 'POST',
      }
    );
  }

  // ============================================================================
  // АНАЛИТИКА
  // ============================================================================

  /**
   * Получить аналитику модуля
   */
  async getAnalytics(
    moduleId: string,
    period: 'day' | 'week' | 'month' | 'year' = 'week'
  ): Promise<AnalyticsData> {
    return this.request<AnalyticsData>(
      `/api/health/${moduleId}/analytics?period=${period}`
    );
  }

  /**
   * Получить корреляции
   */
  async getCorrelations(
    moduleId: string,
    metricType: string
  ): Promise<any> {
    return this.request<any>(
      `/api/health/${moduleId}/analytics/correlations?metric=${metricType}`
    );
  }

  /**
   * Получить инсайты
   */
  async getInsights(moduleId?: string): Promise<any> {
    const params = moduleId ? `?module_id=${moduleId}` : '';
    return this.request<any>(`/api/health/insights${params}`);
  }

  // ============================================================================
  // БИБЛИОТЕКА
  // ============================================================================

  /**
   * Поиск в библиотеке
   */
  async searchLibrary(
    query: string,
    options?: {
      moduleId?: string;
      type?: string;
      category?: string;
      limit?: number;
    }
  ): Promise<LibraryItem[]> {
    const params = new URLSearchParams({ q: query });
    if (options?.moduleId) params.append('module_id', options.moduleId);
    if (options?.type) params.append('type', options.type);
    if (options?.category) params.append('category', options.category);
    if (options?.limit) params.append('limit', options.limit.toString());

    return this.request<LibraryItem[]>(
      `/api/health/library/search?${params.toString()}`
    );
  }

  /**
   * Получить элемент библиотеки
   */
  async getLibraryItem(itemId: string): Promise<LibraryItem> {
    return this.request<LibraryItem>(`/api/health/library/${itemId}`);
  }

  /**
   * Получить рекомендации библиотеки
   */
  async getLibraryRecommendations(
    moduleId: string,
    limit: number = 10
  ): Promise<LibraryItem[]> {
    return this.request<LibraryItem[]>(
      `/api/health/library/recommendations?module_id=${moduleId}&limit=${limit}`
    );
  }

  // ============================================================================
  // ОЦЕНКИ И ТЕСТЫ
  // ============================================================================

  /**
   * Получить доступные оценки
   */
  async getAssessments(moduleId?: string): Promise<Assessment[]> {
    const params = moduleId ? `?module_id=${moduleId}` : '';
    return this.request<Assessment[]>(`/api/health/assessments${params}`);
  }

  /**
   * Пройти оценку
   */
  async completeAssessment(
    assessmentId: string,
    answers: Record<string, any>
  ): Promise<{
    score: number;
    interpretation: any;
    recommendations: any[];
  }> {
    return this.request<any>(`/api/health/assessments/${assessmentId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  }

  // ============================================================================
  // ИНТЕГРАЦИИ
  // ============================================================================

  /**
   * Получить доступные интеграции
   */
  async getIntegrations(): Promise<Integration[]> {
    return this.request<Integration[]>('/api/health/integrations');
  }

  /**
   * Подключить интеграцию
   */
  async connectIntegration(integrationId: string): Promise<any> {
    return this.request<any>(`/api/health/integrations/${integrationId}/connect`, {
      method: 'POST',
    });
  }

  /**
   * Отключить интеграцию
   */
  async disconnectIntegration(integrationId: string): Promise<void> {
    await this.request<void>(
      `/api/health/integrations/${integrationId}/disconnect`,
      {
        method: 'POST',
      }
    );
  }

  /**
   * Синхронизировать данные
   */
  async syncIntegration(integrationId: string): Promise<any> {
    return this.request<any>(
      `/api/health/integrations/${integrationId}/sync`,
      {
        method: 'POST',
      }
    );
  }

  // ============================================================================
  // ОТЧЕТЫ
  // ============================================================================

  /**
   * Создать отчет
   */
  async generateReport(data: {
    type: string;
    module_ids?: string[];
    period_start: string;
    period_end: string;
    format: 'pdf' | 'html' | 'json';
  }): Promise<HealthReport> {
    return this.request<HealthReport>('/api/health/reports', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Получить отчеты пользователя
   */
  async getReports(limit: number = 10): Promise<HealthReport[]> {
    return this.request<HealthReport[]>(`/api/health/reports?limit=${limit}`);
  }

  /**
   * Скачать отчет
   */
  async downloadReport(reportId: string): Promise<Blob> {
    const url = `${this.baseUrl}/api/health/reports/${reportId}/download`;
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to download report');
    }
    
    return response.blob();
  }

  // ============================================================================
  // УВЕДОМЛЕНИЯ
  // ============================================================================

  /**
   * Получить уведомления
   */
  async getNotifications(limit: number = 20): Promise<any[]> {
    return this.request<any[]>(`/api/health/notifications?limit=${limit}`);
  }

  /**
   * Отметить уведомление как прочитанное
   */
  async markNotificationAsRead(notificationId: string): Promise<void> {
    await this.request<void>(
      `/api/health/notifications/${notificationId}/read`,
      {
        method: 'POST',
      }
    );
  }

  /**
   * Отметить все уведомления как прочитанные
   */
  async markAllNotificationsAsRead(): Promise<void> {
    await this.request<void>('/api/health/notifications/read-all', {
      method: 'POST',
    });
  }

  // ============================================================================
  // НАСТРОЙКИ МОДУЛЕЙ
  // ============================================================================

  /**
   * Получить настройки модуля
   */
  async getModuleSettings(moduleId: string): Promise<any> {
    return this.request<any>(`/api/health/${moduleId}/settings`);
  }

  /**
   * Обновить настройки модуля
   */
  async updateModuleSettings(
    moduleId: string,
    settings: Record<string, any>
  ): Promise<any> {
    return this.request<any>(`/api/health/${moduleId}/settings`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // ============================================================================
  // DASHBOARD
  // ============================================================================

  /**
   * Получить общий dashboard здоровья
   */
  async getHealthDashboard(): Promise<{
    overall_score: number;
    modules: any[];
    insights: any[];
    recommendations: any[];
  }> {
    return this.request<any>('/api/health/dashboard');
  }

  /**
   * Получить quick stats
   */
  async getQuickStats(): Promise<{
    total_metrics: number;
    active_goals: number;
    active_plans: number;
    streak_days: number;
    unity_balance: number;
  }> {
    return this.request<any>('/api/health/stats');
  }
}

// Экспорт singleton instance
export const healthAPI = new HealthAPI();
export default healthAPI;
