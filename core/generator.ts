//C: Основний генератор математичних завдань
//C: Main mathematical task generator

//@ Modules
import {
  IGeneratorConfig,
  IGeneratedTask
} from '../types'
import { generateVariables } from '../generation/variable-generator'
import { generateCondition } from '../generation/condition-generator'
import { generateAnswers } from '../generation/answer-generator'
import { evaluateTemplate } from '../evaluation/template-processor'
import { formatDecimal } from '../utils/number-utils'
import { logger } from '../utils/logger'

//C: Імпорт логіки з підпапки генератора
//C: Import logic from the generator subfolder
import { validateConfig } from './generator/config'
import { extractNumericValue } from './generator/parser'
import { isValidResult } from './generator/validator'

//C: Головна функція генерації завдання
//C: Main function for generating task
export const generateTask = (config: IGeneratorConfig): IGeneratedTask => {
  logger.info('GENERATOR', 'Запуск генератора з конфігом:', config)

  validateConfig(config)

  //C: Випадкове рішення чи генерувати варіанти відповідей
  //C: Random decision whether to generate answer options
  const shouldGenerateOptions = config.constraints.canGenerateWrongAnswer && Math.random() > 0.5

  //C: Генерація змінних та правильної відповіді
  //C: Generate variables and correct answer
  const { variables, correctAnswer } = generateValidVariablesAndAnswer(config)

  //C: Генерація тексту умови завдання
  //C: Generate task condition text
  const condition = generateCondition(config.condition, variables)

  const correctAnswerNumber = Number(correctAnswer)
  const isNumericResult = !isNaN(correctAnswerNumber)
  const isFractionResult = correctAnswer.includes('<sup>') || correctAnswer.includes('/')

  //C: Генерація варіантів відповідей якщо потрібно
  //C: Generate answer options if needed
  const answers = shouldGenerateOptions
    ? generateAnswers(correctAnswer, config.constraints, isNumericResult && !isFractionResult)
    : []

  return {
    testID: config.testID,
    condition,
    answers,
    correctAnswer
  }
}

//C: Генерація валідних змінних та відповіді з перевіркою обмежень
//C: Generate valid variables and answer with constraint validation
const generateValidVariablesAndAnswer = (config: IGeneratorConfig): { variables: Record<string, number>; correctAnswer: string } => {
  let variables: Record<string, number>
  let correctAnswer: string
  let attempts = 0

  //C: Цикл генерації з перевіркою валідності результату
  //C: Generation loop with result validity checking
  do {
    logger.info(`GENERATOR`, `Спроба ${attempts + 1} генерації змінних`)

    variables = generateVariables(config.variables, config.constraints, config.template)

    const rawAnswer = evaluateTemplate(config.template, variables)
    const rawNumericResult = extractNumericValue(rawAnswer)
    correctAnswer = formatDecimal(rawAnswer, true)

    if (isValidResult(correctAnswer, variables, config.constraints, rawNumericResult)) {
      logger.info('GENERATOR', 'Усі перевірки пройдені')
      return { variables, correctAnswer }
    }

  } while (++attempts < 100)

  //C: Перевірка максимальної кількості спроб
  //C: Check maximum attempts limit
  if (attempts >= 100) {
    throw new Error('Не вдається згенерувати завдання з вказаними обмеженнями')
  }

  return { variables, correctAnswer }
}