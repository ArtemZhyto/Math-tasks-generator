//@ Modules
import { IConstraints } from '../../types'
import MathFunctions from '../../evaluation/math-functions'

//C: Округлення до тисячних, якщо більше 3 знаків після коми
//C: Round to thousandths if more than 3 decimal places
export const roundToThousandthsIfNeeded = (num: number): number => {
  const str = num.toString()
  const decimalMatch = str.match(/\.(\d+)/)
  if (!decimalMatch || decimalMatch[1].length <= 3) return num
  return Math.round(num * 1000) / 1000
}

//C: Застосування стратегій для створення неправильної відповіді
//C: Apply strategies to create wrong answer
export const applyWrongValueStrategy = (correctValue: number, constraints: IConstraints): number => {
  const strategy = Math.floor(Math.random() * 4)
  let result: number

  switch (strategy) {
    case 0:
      const min = constraints.minResult || 1
      const max = constraints.maxResult || 20
      result = MathFunctions.randomInt(min, max)
      break
    case 1:
      let offset = correctValue + MathFunctions.randomInt(-10, 10)
      result = offset === correctValue ? correctValue + 1 : offset
      break
    case 2:
      let multiplied = correctValue * (Math.random() > 0.5 ? 2 : 0.5)
      result = constraints.integerResult ? Math.round(multiplied) : multiplied
      break
    default:
      result = correctValue + (Math.random() > 0.5 ? 1 : -1)
  }

  return roundToThousandthsIfNeeded(result)
}

//C: Генерація неправильного числового значення з обмеженнями
//C: Generate wrong numeric value with constraints
export const generateWrongNumericValue = (
  correctValue: number,
  constraints: IConstraints,
  maxAttempts: number
): number => {
  let wrongValue: number
  let attempts = 0

  do {
    wrongValue = applyWrongValueStrategy(correctValue, constraints)
    attempts++
    if (attempts > maxAttempts) {
      wrongValue = correctValue + attempts
      break
    }
  } while (
    wrongValue === correctValue ||
    (!constraints.canBeNegative && wrongValue < 0) ||
    (constraints.maxResult && wrongValue > constraints.maxResult) ||
    (constraints.minResult && wrongValue < constraints.minResult)
  )

  return wrongValue
}