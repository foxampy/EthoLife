import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCcw, Home, Bug } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Log to error reporting service
    this.logError(error, errorInfo);
    
    this.setState({ error, errorInfo });
  }

  private async logError(error: Error, errorInfo: ErrorInfo) {
    try {
      await fetch('/api/error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      });
    } catch (e) {
      console.error('Failed to log error:', e);
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Card className="shadow-xl border-red-200">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-10 h-10 text-red-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Упс! Что-то пошло не так
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Произошла непредвиденная ошибка. Не волнуйтесь, мы уже работаем над этим.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Error Details (in development) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-xs font-mono text-red-800 break-all">
                      {this.state.error.message}
                    </p>
                    {this.state.error.stack && (
                      <details className="mt-2">
                        <summary className="text-xs text-red-600 cursor-pointer">
                          Показать стек
                        </summary>
                        <pre className="mt-2 text-xs text-red-700 overflow-auto max-h-40">
                          {this.state.error.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Обновить
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/'}
                  >
                    <Home className="w-4 h-4 mr-2" />
                    На главную
                  </Button>
                </div>

                {/* Report Bug */}
                <Button
                  variant="ghost"
                  className="w-full text-gray-600"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Error: ${this.state.error?.message}\n${this.state.error?.stack}`
                    );
                  }}
                >
                  <Bug className="w-4 h-4 mr-2" />
                  Скопировать ошибку для отчёта
                </Button>

                {/* Contact Support */}
                <p className="text-xs text-center text-gray-500">
                  Если ошибка повторяется, обратитесь в поддержку:{' '}
                  <a href="mailto:support@ethoslife.com" className="text-emerald-600 hover:underline">
                    support@ethoslife.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
