//C: Перевіряльник обмежень для результатів генерації
//C: Перевіряє чи відповідає результат заданим обмеженням
//C: Контролює діапазони, цілочисельність, від'ємні значення
//C: Перевіряє чисельник/знаменник у дробових операціях

//C: Constraint checker for generation results
//C: Checks if result meets specified constraints
//C: Controls ranges, integer values, negative numbers
//C: Checks numerator/denominator in fraction operations



//@ Modules
import { IConstraints } from '../types'
import { logger } from '../utils/logger'

//C: Перевірка чи відповідає результат заданим обмеженням
//C: Check if result meets specified constraints
export const checkConstraints = (result: number, constraints: IConstraints): boolean => {
  logger.info('CONSTRAINTS', 'Перевірка обмежень для:', result)

  //C: Перевірка максимального допустимого результату
  //C: Check maximum allowed result
  if (constraints.maxResult !== undefined && result > constraints.maxResult) {
    return false
  }

  //C: Перевірка мінімального допустимого результату
  //C: Check minimum allowed result
  if (constraints.minResult !== undefined && result < constraints.minResult) {
    return false
  }

  //C: Перевірка вимоги цілочисельного результату
  //C: Check integer result requirement
  if (constraints.integerResult && !Number.isInteger(result)) {
    return false
  }

  //C: Перевірка дозволу від'ємних значень
  //C: Check allowance of negative values
  if (!constraints.canBeNegative && result < 0) {
    return false
  }

  logger.info('CONSTRAINTS', 'Усі обмеження пройдені')
  return true
}

//C: Перевірка чи чисельник дорівнює знаменнику у дробових операціях
//C: Check if numerator equals denominator in fraction operations
export const hasEqualNumeratorDenominator = (variables: Record<string, number>): boolean => {
  //C: Список операцій з дробами для перевірки
  //C: List of fraction operations to check
  const fractionOperations = ['fraction', 'fractionAdd', 'fractionSubtract', 'fractionMultiply', 'fractionDivide']

  //C: Перевірка чи є у змінних операції з дробами
  //C: Check if variables contain fraction operations
  const hasFractionOperations = Object.keys(variables).some(key =>
    fractionOperations.some(op => key.toLowerCase().includes(op))
  )

  //C: Якщо операцій з дробами немає - перевірка не потрібна
  //C: If no fraction operations exist - no need to check
  if (!hasFractionOperations) {
    return false
  }

  //C: Можливі пари змінних для чисельника та знаменника
  //C: Possible variable pairs for numerator and denominator
  const possiblePairs = [
    ['A', 'B'], ['A', 'D'], ['C', 'B'], ['C', 'D'],
    ['numerator', 'denominator'], ['num', 'denom']
  ]

  //C: Перевірка кожної пари на рівність значень
  //C: Check each pair for value equality
  for (const [numVar, denomVar] of possiblePairs) {
    if (variables[numVar] !== undefined && variables[denomVar] !== undefined) {
      if (variables[numVar] === variables[denomVar]) {
        return true
      }
    }
  }

  return false
}