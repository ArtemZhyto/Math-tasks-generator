//C: Утиліти для роботи з числами
//C: Генерація випадкових чисел у діапазоні
//C: Форматування десяткових чисел з комами
//C: Перевірка повторюваних паттернів у числах

//C: Number handling utilities
//C: Generates random numbers in range
//C: Formats decimal numbers with commas
//C: Checks repeating patterns in numbers



//@ Modules
import { logger } from './logger'

//C: Генерація випадкового цілого числа в заданому діапазоні
//C: Generate random integer in specified range
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

//C: Форматування десяткових чисел з заміною крапки на кому
//C: Format decimal numbers with dot to comma replacement
export const formatDecimal = (numberStr: string): string => {
  logger.info('FORMAT', 'Форматування числа:', numberStr)
  
  //C: Не форматуємо числа з одиницями виміру
  //C: Don't format numbers with measurement units
  if (numberStr.includes(' см') || numberStr.includes(' мм') || numberStr.includes(' грн')) {
    return numberStr
  }
  
  //C: Не форматуємо дроби
  //C: Don't format fractions
  if (numberStr.includes('<sup>') || numberStr.includes('/')) {
    return numberStr
  }
  
  const num = Number(numberStr.replace(',', '.'))
  if (isNaN(num)) {
    return numberStr
  }
  
  //C: Повертаємо цілі числа без змін
  //C: Return integers without changes
  if (Number.isInteger(num)) {
    return num.toString()
  }
  
  //C: Округлення до 4 знаків після коми та заміна крапки на кому
  //C: Round to 4 decimal places and replace dot with comma
  const rounded = Math.round(num * 10000) / 10000
  return rounded.toString().replace('.', ',')
}

//C: Перевірка наявності повторюваного паттерну в десятковій частині
//C: Check for repeating pattern in decimal part
export const hasRepeatingPattern = (decimalPart: string): boolean => {
  if (decimalPart.length < 3) return false
  
  //C: Перевірка на однакові цифри (наприклад, 0.333)
  //C: Check for identical digits (e.g., 0.333)
  if (new Set(decimalPart).size === 1) {
    return true
  }
  
  //C: Перевірка циклічних повторень (наприклад, 0.142857142857)
  //C: Check for cyclic repetitions (e.g., 0.142857142857)
  for (let patternLength = 1; patternLength <= Math.floor(decimalPart.length / 2); patternLength++) {
    const pattern = decimalPart.substring(0, patternLength)
    let isRepeating = true
    
    for (let i = patternLength; i < decimalPart.length; i += patternLength) {
      const segment = decimalPart.substring(i, i + patternLength)
      if (segment !== pattern.substring(0, segment.length)) {
        isRepeating = false
        break
      }
    }
    
    if (isRepeating) {
      return true
    }
  }
  
  return false
}