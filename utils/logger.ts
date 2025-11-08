//C: Флаг відладки для контролю логування
//C: Debug flag for logging control
const DEBUG = true

//C: Об'єкт логера для структурованого виводу інформації
//C: Logger object for structured information output
export const logger = {
  //C: Логування інформаційних повідомлень
  //C: Log informational messages
  info: (context: string, message: string, ...args: any[]) => {
    if (DEBUG) {
      console.log(`📝 [${context}] ${message}`, ...args)
    }
  },
  
  //C: Логування попереджень
  //C: Log warnings
  warn: (context: string, message: string, ...args: any[]) => {
    if (DEBUG) {
      console.warn(`⚠️ [${context}] ${message}`, ...args)
    }
  },
  
  //C: Логування помилок
  //C: Log errors
  error: (context: string, message: string, ...args: any[]) => {
    if (DEBUG) {
      console.error(`❌ [${context}] ${message}`, ...args)
    }
  }
}