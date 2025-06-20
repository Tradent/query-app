// Simple logger that doesn't rely on pino
const logger = {
  info: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[INFO] ${message}`, ...args)
    }
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args)
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args)
  },
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(`[DEBUG] ${message}`, ...args)
    }
  },
}

export default logger
