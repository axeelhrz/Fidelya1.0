/**
 * Logger utility for consistent logging across the application
 * Supports different log levels and environments
 */

// Log levels in order of severity
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4 // Used to disable logging
}

// JSON-serializable value type for logging
type JsonValue = 
  | string 
  | number 
  | boolean 
  | null 
  | undefined
  | JsonValue[] 
  | { [key: string]: JsonValue };

// Configuration interface for the logger
interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  prefix?: string;
  remoteUrl?: string;
  additionalContext?: Record<string, JsonValue>;
}

// Default configuration
const defaultConfig: LoggerConfig = {
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableRemote: process.env.NODE_ENV === 'production',
  prefix: 'Assuriva',
  remoteUrl: process.env.NEXT_PUBLIC_LOGGING_ENDPOINT,
  additionalContext: {
    environment: process.env.NODE_ENV || 'development',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0'
  }
};

// Current configuration
let config: LoggerConfig = { ...defaultConfig };

// Format a log message with timestamp and prefix
const formatMessage = (level: string, message: string): string => {
  const timestamp = new Date().toISOString();
  const prefix = config.prefix ? `[${config.prefix}]` : '';
  return `${timestamp} ${prefix} [${level.toUpperCase()}]: ${message}`;
};

// Send log to remote logging service
const sendRemoteLog = async (level: LogLevel, message: string, data?: JsonValue): Promise<void> => {
  if (!config.enableRemote || !config.remoteUrl) return;

  try {
    const logData = {
      level: LogLevel[level],
      message,
      timestamp: new Date().toISOString(),
      data,
      ...config.additionalContext
    };

    // Only attempt to send if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Using fetch API to send logs to remote endpoint
      // We use the no-cors mode to avoid CORS issues
      // We don't await the response to avoid blocking
      fetch(config.remoteUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logData),
        mode: 'no-cors',
        keepalive: true // Ensures the request is sent even if the page is unloading
      }).catch(() => {
        // Silently fail if remote logging fails
        // We don't want to cause issues if logging fails
      });
    }
  } catch {
    // Silently fail if remote logging fails
  }
};

// Log to console with appropriate styling
const consoleLog = (level: LogLevel, message: string, data?: JsonValue): void => {
  if (!config.enableConsole || level < config.minLevel) return;

  const formattedMessage = formatMessage(LogLevel[level], message);

  switch (level) {
    case LogLevel.DEBUG:
      console.debug(formattedMessage, data || '');
      break;
    case LogLevel.INFO:
      console.info('%c' + formattedMessage, 'color: #0284c7', data || '');
      break;
    case LogLevel.WARN:
      console.warn('%c' + formattedMessage, 'color: #f59e0b', data || '');
      break;
    case LogLevel.ERROR:
      console.error('%c' + formattedMessage, 'color: #dc2626', data || '');
      break;
  }
};

// Main logging function
const log = (level: LogLevel, message: string, data?: unknown): void => {
  if (level < config.minLevel) return;

  // Log to console
  consoleLog(level, message, data as JsonValue);

  // Send to remote logging service
  sendRemoteLog(level, message, data as JsonValue).catch(() => {
    // Silently fail if remote logging fails
  });
};

// Public API
export const logger = {
  /**
   * Configure the logger
   * @param newConfig - Partial configuration to merge with current config
   */
  configure: (newConfig: Partial<LoggerConfig>): void => {
    config = { ...config, ...newConfig };
  },

  /**
   * Get current logger configuration
   */
  getConfig: (): LoggerConfig => ({ ...config }),

  /**
   * Set the minimum log level
   * @param level - The minimum log level to display
   */
  setLevel: (level: LogLevel): void => {
    config.minLevel = level;
  },

  /**
   * Enable or disable console logging
   * @param enable - Whether to enable console logging
   */
  enableConsole: (enable: boolean): void => {
    config.enableConsole = enable;
    config.enableRemote = enable;
  },

  /**
   * Set additional context data to include with all logs
   * @param context - Additional context data
   */
  setContext: (context: Record<string, JsonValue>): void => {
    config.additionalContext = { ...config.additionalContext, ...context };
  },

  /**
   * Log a debug message
   * @param message - The message to log
   * @param data - Optional data to include
   */
  debug: (message: string, data?: JsonValue): void => {
    log(LogLevel.DEBUG, message, data);
  },

  /**
   * Log an info message
   * @param message - The message to log
   * @param data - Optional data to include
   */
  info: (message: string, data?: JsonValue): void => {
    log(LogLevel.INFO, message, data);
  },

  /**
   * Log a warning message
   * @param message - The message to log
   * @param data - Optional data to include
   */
  warn: (message: string, data?: unknown): void => {
    log(LogLevel.WARN, message, data);
  },

  /**
   * Log an error message
   * @param message - The message to log
   * @param error - The error object or additional data
   */
  error: (message: string, error?: Error | JsonValue): void => {
    // Extract useful information from Error objects
    let errorData = error;
    
    if (error instanceof Error) {
      errorData = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      };
    }
    
    log(LogLevel.ERROR, message, errorData);
  },

  /**
   * Log a group of related messages
   * @param groupName - The name of the group
   * @param level - The log level for the group
   * @param callback - Function that contains logs to group
   */
  group: (groupName: string, level: LogLevel, callback: () => void): void => {
    if (level < config.minLevel || !config.enableConsole) {
      callback();
      return;
    }

    console.group(formatMessage(LogLevel[level], groupName));
    callback();
    console.groupEnd();
  },

  /**
   * Log performance timing
   * @param label - Label for the timing
   * @param callback - Function to time
   * @returns The result of the callback function
   */
  time: async <T>(label: string, callback: () => Promise<T> | T): Promise<T> => {
    if (config.minLevel > LogLevel.DEBUG || !config.enableConsole) {
      return await callback();
    }

    console.time(label);
    try {
      const result = await callback();
      console.timeEnd(label);
      return result;
    } catch (error) {
      console.timeEnd(label);
      throw error;
    }
  },

  /**
   * Create a child logger with a specific prefix
   * @param prefix - Prefix for the child logger
   * @returns A new logger instance with the specified prefix
   */
  child: (prefix: string) => {
    const childConfig: LoggerConfig = {
      ...config,
      prefix: config.prefix ? `${config.prefix}:${prefix}` : prefix
    };

    const childLogger = { ...logger };
    childLogger.configure(childConfig);
    return childLogger;
  }
};

// Initialize user context when available
if (typeof window !== 'undefined') {
  // Set user information in the logger context when available
  const setUserContext = () => {
    try {
      const user = localStorage.getItem('currentUser');
      if (user) {
        const userData = JSON.parse(user);
        logger.setContext({
          userId: userData.uid,
          userEmail: userData.email
        });
      }
    } catch {
      // Silently fail if we can't get user data
    }
  };

  // Try to set user context now
  setUserContext();

  // Update user context when localStorage changes
  window.addEventListener('storage', (event) => {
    if (event.key === 'currentUser') {
      setUserContext();
    }
  });
}

// Export the logger instance
export default logger;