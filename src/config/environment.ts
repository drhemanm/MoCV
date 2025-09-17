// src/config/environment.ts
interface AppConfig {
  openai: {
    apiKey: string | null;
    baseUrl: string;
    model: string;
    maxTokens: number;
  };
  firebase: {
    apiKey: string | null;
    authDomain: string | null;
    projectId: string | null;
    storageBucket: string | null;
    messagingSenderId: string | null;
    appId: string | null;
  };
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    debugMode: boolean;
    apiBaseUrl: string;
  };
  features: {
    aiEnabled: boolean;
    analyticsEnabled: boolean;
    offlineMode: boolean;
    debugLogs: boolean;
  };
  security: {
    rateLimiting: {
      enabled: boolean;
      maxRequests: number;
      windowMs: number;
    };
    encryption: {
      enabled: boolean;
      algorithm: string;
    };
  };
}

class ConfigurationService {
  private config: AppConfig;
  private initialized = false;

  constructor() {
    this.config = this.loadConfiguration();
    this.validateConfiguration();
    this.initialized = true;
  }

  private loadConfiguration(): AppConfig {
    const env = import.meta.env;
    
    return {
      openai: {
        apiKey: env.VITE_OPENAI_API_KEY || null,
        baseUrl: env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1',
        model: env.VITE_OPENAI_MODEL || 'gpt-4',
        maxTokens: parseInt(env.VITE_OPENAI_MAX_TOKENS || '2000'),
      },
      firebase: {
        apiKey: env.VITE_FIREBASE_API_KEY || null,
        authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || null,
        projectId: env.VITE_FIREBASE_PROJECT_ID || null,
        storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || null,
        messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || null,
        appId: env.VITE_FIREBASE_APP_ID || null,
      },
      app: {
        name: env.VITE_APP_NAME || 'MoCV.mu',
        version: env.VITE_APP_VERSION || '1.0.0',
        environment: (env.VITE_APP_ENV as any) || 'development',
        debugMode: env.VITE_DEBUG_MODE === 'true' || env.NODE_ENV === 'development',
        apiBaseUrl: env.VITE_API_BASE_URL || 'https://api.mocv.mu',
      },
      features: {
        aiEnabled: env.VITE_FEATURE_AI === 'true' && !!env.VITE_OPENAI_API_KEY,
        analyticsEnabled: env.VITE_FEATURE_ANALYTICS === 'true',
        offlineMode: env.VITE_FEATURE_OFFLINE === 'true',
        debugLogs: env.VITE_DEBUG_LOGS === 'true',
      },
      security: {
        rateLimiting: {
          enabled: env.VITE_RATE_LIMITING === 'true',
          maxRequests: parseInt(env.VITE_RATE_LIMIT_REQUESTS || '100'),
          windowMs: parseInt(env.VITE_RATE_LIMIT_WINDOW || '900000'), // 15 minutes
        },
        encryption: {
          enabled: env.VITE_ENCRYPTION === 'true',
          algorithm: env.VITE_ENCRYPTION_ALGORITHM || 'AES-GCM',
        },
      },
    };
  }

  private validateConfiguration(): void {
    const errors: string[] = [];

    // Validate required fields based on environment
    if (this.config.app.environment === 'production') {
      if (!this.config.openai.apiKey && this.config.features.aiEnabled) {
        errors.push('OpenAI API key is required for AI features in production');
      }
      
      if (this.config.app.debugMode) {
        console.warn('Debug mode is enabled in production - this should be disabled');
      }
    }

    // Validate API key format if provided
    if (this.config.openai.apiKey && !this.isValidOpenAIKey(this.config.openai.apiKey)) {
      errors.push('Invalid OpenAI API key format');
    }

    // Validate Firebase configuration if any Firebase features are used
    if (this.hasFirebaseConfig() && !this.isValidFirebaseConfig()) {
      errors.push('Incomplete Firebase configuration');
    }

    if (errors.length > 0) {
      console.error('Configuration validation errors:', errors);
      if (this.config.app.environment === 'production') {
        throw new Error(`Configuration errors: ${errors.join(', ')}`);
      }
    }
  }

  private isValidOpenAIKey(key: string): boolean {
    return key.startsWith('sk-') && key.length > 20;
  }

  private hasFirebaseConfig(): boolean {
    return Object.values(this.config.firebase).some(value => value !== null);
  }

  private isValidFirebaseConfig(): boolean {
    const required = ['apiKey', 'authDomain', 'projectId'];
    return required.every(field => this.config.firebase[field as keyof typeof this.config.firebase] !== null);
  }

  // Public getters
  get openai() {
    return { ...this.config.openai };
  }

  get firebase() {
    return { ...this.config.firebase };
  }

  get app() {
    return { ...this.config.app };
  }

  get features() {
    return { ...this.config.features };
  }

  get security() {
    return { ...this.config.security };
  }

  get isAIEnabled(): boolean {
    return this.config.features.aiEnabled && !!this.config.openai.apiKey;
  }

  get isFirebaseEnabled(): boolean {
    return this.hasFirebaseConfig() && this.isValidFirebaseConfig();
  }

  get isDevelopment(): boolean {
    return this.config.app.environment === 'development';
  }

  get isProduction(): boolean {
    return this.config.app.environment === 'production';
  }

  // Utility methods
  getApiEndpoint(path: string): string {
    return `${this.config.app.apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }

  logConfiguration(): void {
    if (this.config.features.debugLogs) {
      console.group('🔧 MoCV Configuration');
      console.log('Environment:', this.config.app.environment);
      console.log('Version:', this.config.app.version);
      console.log('AI Enabled:', this.config.features.aiEnabled);
      console.log('Firebase Enabled:', this.isFirebaseEnabled);
      console.log('Debug Mode:', this.config.app.debugMode);
      console.groupEnd();
    }
  }
}

// Create singleton instance
export const config = new ConfigurationService();

// Export types for use in other files
export type { AppConfig };

// src/services/secureApiService.ts
class SecureAPIService {
  private rateLimitTracker = new Map<string, { count: number; resetTime: number }>();

  constructor(private appConfig: AppConfig) {}

  async makeSecureRequest(
    endpoint: string,
    options: RequestInit = {},
    rateLimitKey = 'default'
  ): Promise<Response> {
    // Check rate limiting
    if (this.appConfig.security.rateLimiting.enabled) {
      if (!this.checkRateLimit(rateLimitKey)) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
    }

    // Add security headers
    const secureHeaders = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Cache-Control': 'no-cache',
      ...options.headers,
    };

    // Add API key securely if available
    if (this.appConfig.openai.apiKey && endpoint.includes('openai')) {
      secureHeaders['Authorization'] = `Bearer ${this.appConfig.openai.apiKey}`;
    }

    const response = await fetch(endpoint, {
      ...options,
      headers: secureHeaders,
      credentials: 'same-origin', // Security: only send credentials to same origin
    });

    // Update rate limit counter
    if (this.appConfig.security.rateLimiting.enabled) {
      this.updateRateLimit(rateLimitKey);
    }

    // Handle common error responses
    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    return response;
  }

  private checkRateLimit(key: string): boolean {
    const now = Date.now();
    const tracker = this.rateLimitTracker.get(key);

    if (!tracker || now > tracker.resetTime) {
      // Reset or initialize tracker
      this.rateLimitTracker.set(key, {
        count: 0,
        resetTime: now + this.appConfig.security.rateLimiting.windowMs,
      });
      return true;
    }

    return tracker.count < this.appConfig.security.rateLimiting.maxRequests;
  }

  private updateRateLimit(key: string): void {
    const tracker = this.rateLimitTracker.get(key);
    if (tracker) {
      tracker.count += 1;
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `Request failed with status ${response.status}`;
    
    try {
      const errorData = await response.json();
      if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      }
    } catch {
      // If we can't parse the error response, use the default message
    }

    // Security: Don't expose sensitive error details in production
    if (this.appConfig.app.environment === 'production') {
      switch (response.status) {
        case 401:
          errorMessage = 'Authentication failed';
          break;
        case 403:
          errorMessage = 'Access denied';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Service temporarily unavailable';
          break;
        default:
          errorMessage = 'An error occurred. Please try again.';
      }
    }

    throw new Error(errorMessage);
  }

  // Clean up rate limit tracking periodically
  cleanupRateLimitTracking(): void {
    const now = Date.now();
    for (const [key, tracker] of this.rateLimitTracker.entries()) {
      if (now > tracker.resetTime) {
        this.rateLimitTracker.delete(key);
      }
    }
  }
}

// Export services
export const secureApiService = new SecureAPIService(config);
