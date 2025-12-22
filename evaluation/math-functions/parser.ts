//@ Modules
import { logger } from '../../utils/logger'

//C: Допоміжна функція для конвертації десяткового числа у дріб
//C: Helper function to convert decimal number to fraction
export const convertDecimalToFraction = (decimal: number): { numerator: number; denominator: number } => {
  const tolerance = 1.0E-6
  let h1 = 1, h2 = 0
  let k1 = 0, k2 = 1
  let b = decimal
  do {
    const a = Math.floor(b)
    let aux = h1
    h1 = a * h1 + h2
    h2 = aux
    aux = k1
    k1 = a * k1 + k2
    k2 = aux
    b = 1 / (b - a)
  } while (Math.abs(decimal - h1 / k1) > decimal * tolerance)

  return { numerator: h1, denominator: k1 }
}

//C: Функція парсингу рядка дробу у числові компоненти
//C: Function to parse fraction string into numeric components
export const parseFraction = (fraction: string): { numerator: number; denominator: number } => {
  logger.info('FRACTION', 'Парсинг дробу:', fraction)

  const num = Number(fraction)
  if (!isNaN(num)) {
    return { numerator: num, denominator: 1 }
  }

  const mixedMatch = fraction.match(/(-?\d+)\s*<sup>(\d+)<\/sup>\/<sub>(\d+)<\/sub>/)
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1])
    const numerator = parseInt(mixedMatch[2])
    const denominator = parseInt(mixedMatch[3])
    const result = {
      numerator: whole * denominator + (whole < 0 ? -numerator : numerator),
      denominator: denominator
    }
    logger.info('FRACTION', 'Знайдено змішаний дріб:', result)
    return result
  }

  const simpleMatch = fraction.match(/<sup>(-?\d+)<\/sup>\/<sub>(\d+)<\/sub>/)
  if (simpleMatch) {
    const result = {
      numerator: parseInt(simpleMatch[1]),
      denominator: parseInt(simpleMatch[2])
    }
    logger.info('FRACTION', 'Знайдено простий дріб:', result)
    return result
  }

  const textFractionMatch = fraction.match(/(-?\d+)\s*\/\s*(\d+)/)
  if (textFractionMatch) {
    const result = {
      numerator: parseInt(textFractionMatch[1]),
      denominator: parseInt(textFractionMatch[2])
    }
    logger.info('FRACTION', 'Знайдено текстовий дріб:', result)
    return result
  }

  const decimalMatch = fraction.match(/(-?\d+[.,]\d+)/)
  if (decimalMatch) {
    const decimalValue = Number(decimalMatch[1].replace(',', '.'))
    if (!isNaN(decimalValue)) {
      logger.info('FRACTION', 'Знайдено десяткове число:', decimalValue)
      return convertDecimalToFraction(decimalValue)
    }
  }

  logger.error('FRACTION', 'Неможливо розпізнати формат дробу:', fraction)
  throw new Error(`Invalid fraction format: ${fraction}`)
}