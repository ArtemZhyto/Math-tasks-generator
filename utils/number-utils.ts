//C: Утиліти для роботи з числами
//C: Number handling utilities

//@ Modules
import { logger } from './logger'
import { randomInt } from './number-utils/random'
import { isCompletelyStringResult, extractNumericAndUnits } from './number-utils/parser'
import { formatNumberWithSpaces, hasRepeatingPattern } from './number-utils/formatter'

export { randomInt, formatNumberWithSpaces, hasRepeatingPattern }

//C: Форматування десяткових чисел з заміною крапки на кому
//C: Formatting decimal numbers with dot to comma replacement
export const formatDecimal = (numberStr: string, finalFormat: boolean = false, addSpace: boolean = true): string => {
  logger.info('FORMAT', 'Форматування числа:', numberStr, 'finalFormat:', finalFormat, 'addSpace:', addSpace)

  if (isCompletelyStringResult(numberStr)) {
    logger.info('FORMAT', 'Повністю строковий результат, повертаємо як є:', numberStr)
    return numberStr
  }

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

  const formattedNumeric = formatNumericPart(num, finalFormat)

  if (units) {
    return addSpace ? `${formattedNumeric} ${units}`.trim() : `${formattedNumeric}${units}`
  }

  return formattedNumeric
}

//C: Допоміжне форматування числової частини
//C: Helper formatting for numeric part
const formatNumericPart = (num: number, finalFormat: boolean): string => {
  if (Number.isInteger(num)) {
    return formatNumberWithSpaces(num)
  }

  if (!finalFormat) {
    return num.toString()
  }

  //C: Завжди спочатку округлюємо до 3 знаків
  //C: Always round to 3 decimal places first
  //C: 0.3125 -> 0.313 | 0.5 -> 0.5 | 0.12 -> 0.12
  const rounded = Math.round(num * 1000) / 1000

  //C: Форматуємо вже результат округлення
  //C: Format the rounded result
  return formatNumberWithSpaces(rounded).replace('.', ',')
}