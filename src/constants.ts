type LogLevels = ('log' | 'error' | 'warn' | 'debug' | 'verbose')[];

export const LOG_LEVELS: LogLevels = [
  'log',
  'error',
  'warn',
  'debug',
  'verbose',
].slice(0, Number(process.env.LOG_LEVEL) + 1) as LogLevels;
