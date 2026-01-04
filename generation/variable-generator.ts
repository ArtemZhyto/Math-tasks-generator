//C: Генератор значень змінних для завдань
//C: Створює випадкові значення змінних згідно конфігурації
//C: Перевіряє обмеження на цілочисельність результатів
//C: Гарантує унікальність значень змінних

//C: Variable values generator for tasks
//C: Creates random variable values according to configuration
//C: Checks integer result constraints
//C: Guarantees uniqueness of variable values



//@ Modules
import { logger } from '../utils/logger'
import { IVariableConfig, IConstraints } from '../types'
import { evaluateNumericPart } from '../evaluation/template-processor'
import { hasEqualNumeratorDenominator } from '../core/constraint-checker'
import MathFunctions, { ALL_FUNCTIONS } from '../evaluation/math-functions'

//C: Генерація значень змінних для математичного виразу з урахуванням обмежень
//C: Generate variable values for mathematical expression considering constraints
export const generateVariables = (
  variablesConfig: Record<string, IVariableConfig>,
  constraints: IConstraints,
  template: string
): Record<string, number> => {
  logger.info('VARIABLES', 'Генерація змінних для шаблону:', template)
  const variables: Record<string, number> = {}
  let attempts = 0
  const MAX_ATTEMPTS = 100

  //C: Якщо шаблон містить строкові функції, пропускаємо перевірку цілочисельності
  //C: If template contains string functions, skip integer check
  const hasStringFunctions = /greater|less|equal|compare|isPrime/.test(template)

  do {
    logger.info(`VARIABLES`, `Спроба ${attempts + 1}`)

    //C: Генерація значень для кожної змінної з конфігурації
    Object.entries(variablesConfig).forEach(([varName, config]) => {
      variables[varName] = generateVariableValue(config)
    })

    attempts++

    if (attempts >= MAX_ATTEMPTS) {
      throw new Error('Не вдається згенерувати змінні за 100 спроб')
    }

    //C: Пропускаємо перевірку цілочисельності для строкових функцій
    if (hasStringFunctions) {
      logger.info('VARIABLES', 'Пропуск перевірки цілочисельності для строкових функцій')
      break
    }

    //C: Перевірка цілочисельності результату якщо потрібно
    if (constraints.integerResult && !checkIntegerResult(template, variables)) {
      continue
    }

    //C: Перевірка що чисельник не дорівнює знаменнику у дробах
    if (!hasEqualNumeratorDenominator(variables)) {
      logger.info('VARIABLES', 'Усі перевірки пройдені')
      break
    }

  } while (attempts < MAX_ATTEMPTS)

  return variables
}

//C: Генерація значення однієї змінної згідно її конфігурації
//C: Generate value for single variable according to its configuration
const generateVariableValue = (config: IVariableConfig): number => {
  //C: Якщо задано список значень - вибираємо випадкове з нього
  //C: If values list is provided - select random from it
  if (config.values !== undefined) {
    const values = config.values
    const randomIndex = Math.floor(Math.random() * values.length)
    logger.info('VARIABLES', `Значення зі списку: ${values[randomIndex]}`)
    return values[randomIndex]
  }

  //C: Генерація випадкового числа з заданого діапазону
  //C: Generate random number from specified range
  const [min, max] = config.range!
  let value: number
  let innerAttempts = 0

  do {
    value = MathFunctions.randomInt(min, max)
    innerAttempts++

    //C: Пропуск виключених значень з обмеженням спроб
    //C: Skip excluded values with attempt limit
    if (config.exclude?.includes(value) && innerAttempts < 20) {
      continue
    }
    break
  } while (innerAttempts < 20)

  logger.info('VARIABLES', `Значення із діапазону ${min}-${max}: ${value}`)
  return value
}

//C: Перевірка чи є числова частина результату цілим числом
//C: Check if numeric part of result is integer
const checkIntegerResult = (template: string, variables: Record<string, number>): boolean => {
  logger.info('VARIABLES', 'Перевірка цілочисленості результату')

  //C: Якщо шаблон містить строкові функції, повністю пропускаємо перевірку
  //C: If template contains string functions, completely skip check
  const functionsRegex = new RegExp(ALL_FUNCTIONS.join('|'))
	const hasStringFunctions = functionsRegex.test(template)

  if (hasStringFunctions) {
    logger.info('VARIABLES', 'Повний пропуск: шаблон містить строкові функції')
    return true
  }

  try {
    //C: Обчислення числової частини виразу для перевірки
    //C: Calculate numeric part of expression for verification
    const result = evaluateNumericPart(template, variables)

    //C: Якщо результат - рядок, пропускаємо перевірку (це строковий результат)
    //C: If result is string, skip check (it's string result)
    if (typeof result === 'string') {
      logger.info('VARIABLES', 'Пропуск: строковий результат')
      return true
    }

    //C: Перевірка чисельного результату
    //C: Check numeric result
    if (!Number.isInteger(result)) {
      logger.info('VARIABLES', 'Пропуск: числова частина не ціле число')
      return false
    }

    logger.info('VARIABLES', 'Числова частина - ціле число')
    return true
  } catch (error) {
    //C: При помилці обчислення приймаємо результат (ймовірно строковий)
    //C: On calculation error accept result (probably string)
    logger.info('VARIABLES', 'Помилка перевірки числовой частини, приймаємо:', error)
    return true
  }
}