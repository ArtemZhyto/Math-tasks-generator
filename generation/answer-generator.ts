//C: Генератор варіантів відповідей для тестових завдань
//C: Answer options generator for test tasks

//@ Modules
import { IConstraints } from '../types'
import MathFunctions from '../evaluation/math-functions'
import { parseFraction } from '../utils/fraction-utils'
import { logger } from '../utils/logger'
import { MEASUREMENT_UNITS } from '../constants'
import { formatDecimal } from '../utils/number-utils'

import { generateWrongNumericValue, roundToThousandthsIfNeeded } from './answer-generator/numeric-strategy'
import { generateFractionVariation } from './answer-generator/fraction-strategy'
import { generateStringWrongAnswer } from './answer-generator/string-strategy'
import { generateWrongAlgebraicAnswer } from './answer-generator/algebraic-strategy'
import { formatNumericValue } from '../utils/number-utils/formatter'

export const generateAnswers = (
  correctAnswer: string,
  constraints: IConstraints,
  isNumeric: boolean
): string[] => {
  const shouldGenerateOptions = constraints.canGenerateWrongAnswer && Math.random() > 0.5

  if (!shouldGenerateOptions) {
    logger.info('ANSWERS', 'Генерацію варіантів пропущено')
    return []
  }

  const answers = new Set<string>()
  answers.add(correctAnswer)

  const isFractionAnswer = correctAnswer.includes('<sup>') || correctAnswer.includes('/')
  const hasUnits = MEASUREMENT_UNITS.some(unit => correctAnswer.includes(unit))

  let maxWrongAttempts = 100
  let wrongAttempts = 0

  while (answers.size < 4 && wrongAttempts < maxWrongAttempts) {
    let wrongAnswer = generateWrongAnswer(correctAnswer, constraints, isNumeric, isFractionAnswer, hasUnits)

    if (!answers.has(wrongAnswer)) {
      answers.add(wrongAnswer)
      logger.info('ANSWERS', `Додано варіант #${answers.size}: ${wrongAnswer}`)
    }

    wrongAttempts++
  }

  const finalArray = Array.from(answers).sort(() => Math.random() - 0.5)
  logger.info('ANSWERS', `Фінальний набір: [${finalArray.join(' | ')}]`)

  return finalArray
}

const generateWrongAnswer = (
  correctAnswer: string,
  constraints: IConstraints,
  isNumeric: boolean,
  isFractionAnswer: boolean,
  hasUnits: boolean
): string => {
  if (isFractionAnswer || correctAnswer.includes('<sup>')) {
    logger.info('WRONG_GEN', 'Стратегія: Дроби')
    const result = generateFractionWrongAnswer(correctAnswer, constraints)
    return formatDecimal(result, true)
  }

  const hasLetters = /[a-zA-Z]/.test(correctAnswer)

  if (hasLetters) {
    logger.info('WRONG_GEN', 'Стратегія: Алгебра')
    return generateWrongAlgebraicAnswer(correctAnswer)
  }

  if (hasUnits) {
    logger.info('WRONG_GEN', 'Стратегія: Одиниці вимірювання')
    return generateWrongAnswerWithUnits(correctAnswer, constraints)
  }

  if (isNumeric) {
    logger.info('WRONG_GEN', 'Стратегія: Числа')
    const numericForMath = Number(correctAnswer.replace(/\s/g, '').replace(',', '.'))

    if (!isNaN(numericForMath)) {
      const wrongVal = generateWrongNumericValue(numericForMath, constraints, 50)
      return formatNumericValue(wrongVal, constraints.integerResult)
    }
  }

  logger.info('WRONG_GEN', 'Стратегія: Рядок (за замовчуванням)')
  return generateStringWrongAnswer(correctAnswer, constraints)
}

const generateWrongAnswerWithUnits = (correctAnswer: string, constraints: IConstraints): string => {
  const numericPartWithSpaces = correctAnswer.split(' ')[0]
  const units = correctAnswer.slice(numericPartWithSpaces.length).trim()
  const numericValue = Number(numericPartWithSpaces.replace(/\s/g, '').replace(',', '.'))

  if (isNaN(numericValue)) return generateStringWrongAnswer(correctAnswer, constraints)

  const wrongNumeric = generateWrongNumericValue(numericValue, constraints, 20)
  const formattedWrongAnswer = formatDecimal(roundToThousandthsIfNeeded(wrongNumeric).toString(), true)
  return `${formattedWrongAnswer} ${units}`
}

const generateFractionWrongAnswer = (correctAnswer: string, constraints: IConstraints): string => {
  try {
    const parsed = parseFraction(correctAnswer)
    return generateFractionVariation(parsed, constraints, correctAnswer)
  } catch {
    return MathFunctions.simplifyFraction(MathFunctions.randomInt(1, 5), MathFunctions.randomInt(2, 8))
  }
}