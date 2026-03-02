import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  fallback?: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles,
  fallback,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth();

  // Показываем лоадер во время проверки
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Редирект если не авторизован
  if (!isAuthenticated) {
    window.location.href = redirectTo;
    return null;
  }

  // Проверка роли если указана
  if (allowedRoles && !hasRole(allowedRoles)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Редирект на страницу 403 или на главную
    window.location.href = user?.role === 'specialist' ? '/specialist/dashboard' : '/dashboard';
    return null;
  }

  return <>{children}</>;
}

// HOC для защиты страниц
export function withProtected<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    allowedRoles?: string[];
    redirectTo?: string;
  }
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute 
        allowedRoles={options?.allowedRoles}
        redirectTo={options?.redirectTo}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
