//C: Утиліти для роботи з дробами
//C: Парсинг рядків дробів у числові компоненти
//C: Перевірка від'ємних дробів та десяткових частин
//C: Обробка різних форматів дробових записів

//C: Fraction handling utilities
//C: Parses fraction strings into numeric components
//C: Checks negative fractions and decimal parts
//C: Handles different fraction notation formats



//@ Modules
import { logger } from './logger'
import { hasRepeatingPattern } from './number-utils'

//C: Інтерфейс для розпарсеної дробової структури
//C: Interface for parsed fraction structure
export interface ParsedFraction {
  numerator: number
  denominator: number
}

//C: Парсинг рядка дробу у чисельник та знаменник
//C: Parse fraction string into numerator and denominator
export const parseFraction = (fraction: string): ParsedFraction => {
  logger.info('FRACTION', 'Парсинг дробу:', fraction)
  
  //C: Обробка змішаних дробів (наприклад, "1<sup>2</sup>/<sub>3</sub>")
  //C: Handle mixed fractions (e.g., "1<sup>2</sup>/<sub>3</sub>")
  const mixedMatch = fraction.match(/(-?\d+)\s*<sup>(\d+)<\/sup>\/<sub>(\d+)<\/sub>/)
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1])
    const numerator = parseInt(mixedMatch[2])
    const denominator = parseInt(mixedMatch[3])
    
    return {
      numerator: whole * denominator + (whole < 0 ? -numerator : numerator),
      denominator: denominator
    }
  }
  
  //C: Обробка простих дробів (наприклад, "<sup>2</sup>/<sub>3</sub>")
  //C: Handle simple fractions (e.g., "<sup>2</sup>/<sub>3</sub>")
  const simpleMatch = fraction.match(/<sup>(-?\d+)<\/sup>\/<sub>(\d+)<\/sub>/)
  if (simpleMatch) {
    return {
      numerator: parseInt(simpleMatch[1]),
      denominator: parseInt(simpleMatch[2])
    }
  }
  
  //C: Обробка цілих чисел
  //C: Handle whole numbers
  const num = Number(fraction)
  if (!isNaN(num)) {
    return { numerator: num, denominator: 1 }
  }
  
  throw new Error(`Invalid fraction format: ${fraction}`)
}

//C: Перевірка чи є дріб від'ємним
//C: Check if fraction is negative
export const checkIfNegativeFraction = (answer: string): boolean => {
  //C: Перевірка чисел з одиницями виміру
  //C: Check numbers with measurement units
  if (answer.includes(' см') || answer.includes(' мм') || answer.includes(' грн')) {
    const numericPart = answer.split(' ')[0]
    return numericPart.startsWith('-')
  }
  
  //C: Перевірка від'ємних чисел та спеціальних форматів
  //C: Check negative numbers and special formats
  if (answer.startsWith('-')) return true
  if (answer.includes('>-<') || answer.includes('>-</')) return true
  
  //C: Спроба парсингу дробу для перевірки чисельника
  //C: Try parsing fraction to check numerator
  try {
    const parsed = parseFraction(answer)
    return parsed.numerator < 0
  } catch {
    return false
  }
}

//C: Перевірка чи десяткова частина занадто довга або має повторюваний паттерн
//C: Check if decimal part is too long or has repeating pattern
export const isDecimalTooLong = (answer: string): boolean => {
  if (isNaN(Number(answer))) {
    return false
  }
  
  //C: Вилучення десяткової частини числа
  //C: Extract decimal part of number
  const decimalMatch = answer.match(/\.(\d+)/)
  if (!decimalMatch) {
    return false
  }
  
  const decimalPart = decimalMatch[1]
  return decimalPart.length > 4 || hasRepeatingPattern(decimalPart)
}