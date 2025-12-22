//@ Modules
import { IConstraints } from '../../types'
import { logger } from '../../utils/logger'
import {
  checkConstraints,
  hasEqualNumeratorDenominator
} from '../constraint-checker'
import {
  isDecimalTooLong,
  checkIfNegativeFraction
} from '../../utils/fraction-utils'
import { extractNumericValue, isNonNumericResult } from './parser'

//C: Комплексна перевірка валідності результату генерації
//C: Comprehensive validation of generation result
export const isValidResult = (
  correctAnswer: string,
  variables: Record<string, number>,
  constraints: IConstraints,
  rawNumericResult?: number
): boolean => {
  //C: Перевірка що чисельник не дорівнює знаменнику
  //C: Check that numerator doesn't equal denominator
  if (hasEqualNumeratorDenominator(variables)) {
    logger.info('GENERATOR', 'Пропуск: чисельник дорівню знаменнику')
    return false
  }

  //C: Перевірка дозволу від'ємних значень
  //C: Check allowance of negative values
  if (!constraints.canBeNegative && checkIfNegativeFraction(correctAnswer)) {
    logger.info('GENERATOR', `Пропуск: від'ємний результат не дозволен`)
    return false
  }

  //C: Перевірка чи результат є строковим (не числовим)
  //C: Check if result is non-numeric (string)
  if (isNonNumericResult(correctAnswer)) {
    logger.info('GENERATOR', 'Строковий результат, приймаємо')
    return true
  }

  //C: Вилучення числової частини з рядка
  //C: Extract numeric part from string
  const correctAnswerNumber = extractNumericValue(correctAnswer)
  const isNumericResult = !isNaN(correctAnswerNumber)

  if (isNumericResult) {
    //C: Перевірка довжини десяткової частини
    //C: Check decimal part length
    if (isDecimalTooLong(correctAnswerNumber.toString())) {
      logger.info('GENERATOR', 'Пропуск: надто довга десятична частина')
      return false
    }

    //C: Перевірка обмежень на діапазон та інші параметри
    //C: Check range constraints and other parameters
    if (rawNumericResult !== undefined && !checkConstraints(rawNumericResult, constraints)) {
      logger.info('GENERATOR', 'Пропуск: не проходить обмеження')
      return false
    }

    //C: Перевірка вимоги цілочисельного результату
    //C: Check integer result requirement
    if (constraints.integerResult) {
      const resultToCheck = rawNumericResult !== undefined ? rawNumericResult : extractNumericValue(correctAnswer)
      if (!Number.isInteger(resultToCheck)) {
        logger.info('GENERATOR', 'Пропуск: не ціле число', resultToCheck)
        return false
      }
    }
  }

  return true
}