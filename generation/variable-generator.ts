//C: Генератор значень змінних для завдань
//C: Створює випадкові значення змінних згідно конфігурації
//C: Перевіряє обмеження на цілочисельність результатів
//C: Гарантує унікальність значень змінних

//C: Variable values generator for tasks
//C: Creates random variable values according to configuration
//C: Checks integer result constraints
//C: Guarantees uniqueness of variable values



//@ Modules
import { IVariableConfig, IConstraints } from '../types'
import MathFunctions from '../evaluation/math-functions'
import { evaluateNumericPart } from '../evaluation/template-processor'
import { hasEqualNumeratorDenominator } from '../core/constraint-checker'
import { logger } from '../utils/logger'

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
  
  do {
    logger.info(`VARIABLES`, `Спроба ${attempts + 1}`)
    
    //C: Генерація значень для кожної змінної з конфігурації
    //C: Generate values for each variable from configuration
    Object.entries(variablesConfig).forEach(([varName, config]) => {
      variables[varName] = generateVariableValue(config)
    })
    
    attempts++

    //C: Перевірка максимальної кількості спроб генерації
    //C: Check maximum generation attempts limit
    if (attempts >= MAX_ATTEMPTS) {
      throw new Error('Не вдається згенерувати змінні за 100 спроб')
    }

    //C: Перевірка цілочисельності результату якщо потрібно
    //C: Check integer result if required
    if (constraints.integerResult && !checkIntegerResult(template, variables)) {
      continue
    }

    //C: Перевірка що чисельник не дорівнює знаменнику у дробах
    //C: Check that numerator doesn't equal denominator in fractions
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
  
  try {
    //C: Обчислення числової частини виразу для перевірки
    //C: Calculate numeric part of expression for verification
    const numericResult = evaluateNumericPart(template, variables)
    
    if (!Number.isInteger(numericResult)) {
      logger.info('VARIABLES', 'Пропуск: числова частина не ціле число')
      return false
    }
    
    logger.info('VARIABLES', 'Числова частина - ціле число')
    return true
  } catch (error) {
    logger.info('VARIABLES', 'Помилка перевірки числовой частини:', error)
    return false
  }
}