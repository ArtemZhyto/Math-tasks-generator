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
import {
	MEASUREMENT_UNITS,
	STRING_RESULTS
} from '../constants'

//C: Генерація випадкового цілого числа в заданому діапазоні
//C: Generate random integer in specified range
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

//C: Розділення тисяч (только для целой части)
//C: Thousand separators (only for integer part)
const formatNumberWithSpaces = (num: number): string => {
  const numStr = num.toString()

  //C: Разделяем целую и десятичную части
  //C: Separate integer and decimal parts
  const [integerPart, decimalPart] = numStr.split('.')

  //C: Форматируем только целую часть с пробелами
  //C: Format only integer part with spaces
  const absoluteValue = Math.abs(Number(integerPart)).toString()
  const cleanValue = absoluteValue.replace(/^0+/, '') || '0'

  const formattedInteger = cleanValue
    .split('')
    .reverse()
    .join('')
    .match(/.{1,3}/g)
    ?.join(' ')
    .split('')
    .reverse()
    .join('') || cleanValue

  const sign = num < 0 ? '-' : ''

  //C: Возвращаем с десятичной частью (без пробелов)
  //C: Return with decimal part (without spaces)
  return decimalPart
    ? `${sign}${formattedInteger},${decimalPart}`
    : `${sign}${formattedInteger}`
}

//C: Форматування десяткових чисел з заміною крапки на кому
//C: Formatting decimal numbers with dot to comma replacement
export const formatDecimal = (numberStr: string, finalFormat: boolean = false, addSpace: boolean = true): string => {
  logger.info('FORMAT', 'Форматування числа:', numberStr, 'finalFormat:', finalFormat, 'addSpace:', addSpace)

  //C: Перевірка чи є це повністю строковий результат (без чисел)
  //C: Check if it's completely string result (without numbers)
  if (isCompletelyStringResult(numberStr)) {
    logger.info('FORMAT', 'Повністю строковий результат, повертаємо як є:', numberStr)
    return numberStr
  }

  //C: Виділяємо числову частину та одиниці виміру
  //C: Extract numeric part and units of measurement
  const { numericPart, units } = extractNumericAndUnits(numberStr)

  const num = Number(numericPart.replace(',', '.'))
  if (isNaN(num)) {
    return numberStr
  }

  //C: Не форматуємо дроби
  //C: Don't format fractions
  if (numberStr.includes('<sup>') || numberStr.includes('/')) {
    return numberStr
  }

  //C: Форматуємо числову частину
  //C: Format the numeric part
  const formattedNumeric = formatNumericPart(num, finalFormat)

  //C: Повертаємо відформатоване число з одиницями виміру (з пробілом або без)
  //C: Return formatted number with units of measurement (with or without space)
  if (units) {
    return addSpace ? `${formattedNumeric} ${units}`.trim() : `${formattedNumeric}${units}`
  }

  return formattedNumeric
}

//C: Перевірка чи є рядок повністю строковим результатом (без чисел)
//C: Check if string is completely string result (without numbers)
const isCompletelyStringResult = (str: string): boolean => {
  //C: Видаляємо всі одиниці виміру
  //C: Remove all measurement units
  let cleanStr = str
  MEASUREMENT_UNITS.forEach(unit => {
    cleanStr = cleanStr.replace(unit, '')
  })

  //C: Перевіряємо чи залишились цифри
  //C: Check if digits remain
  const hasDigits = /\d/.test(cleanStr)

  //C: Якщо цифр немає і це один з строкових результатів
  //C: If no digits and it's one of string results
  return !hasDigits && STRING_RESULTS.some(result => str.includes(result))
}

//C: Виділення числової частини та одиниць виміру
//C: Extract numeric part and units of measurement
const extractNumericAndUnits = (str: string): { numericPart: string; units: string } => {
  const numericMatch = str.match(/(-?\d+[.,]?\d*)/)

  if (!numericMatch) {
    return { numericPart: str, units: '' }
  }

  const numericPart = numericMatch[0]
  const units = str.replace(numericPart, '').trim()

  return { numericPart, units }
}

//C: Форматування числової частини
//C: Format numeric part
const formatNumericPart = (num: number, finalFormat: boolean): string => {
  if (Number.isInteger(num)) {
    return formatNumberWithSpaces(num)
  } else {
    if (!finalFormat) {
      return num.toString()
    } else {
      const rounded = Math.round(num * 100) / 100
      return formatNumberWithSpaces(rounded).replace('.', ',')
    }
  }
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