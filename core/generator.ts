//C: Основний генератор математичних завдань
//C: Координує весь процес генерації завдань
//C: Об'єднує генерацію змінних, умов та відповідей
//C: Забезпечує валідність згенерованих завдань

//C: Main mathematical task generator
//C: Coordinates entire task generation process
//C: Combines variables, conditions and answers generation
//C: Ensures validity of generated tasks



//@ Modules
import {
	IGeneratorConfig,
	IGeneratedTask,
	IConstraints
} from '../types'
import { generateVariables } from '../generation/variable-generator'
import { generateCondition } from '../generation/condition-generator'
import { generateAnswers } from '../generation/answer-generator'
import { evaluateTemplate } from '../evaluation/template-processor'
import {
	checkConstraints,
	hasEqualNumeratorDenominator
} from './constraint-checker'
import {
	isDecimalTooLong,
	checkIfNegativeFraction
} from '../utils/fraction-utils'
import { formatDecimal } from '../utils/number-utils'
import { logger } from '../utils/logger'
import { STRING_RESULTS } from '../constants'

//C: Головна функція генерації завдання з математичними вправами
//C: Main function for generating mathematical exercise tasks
export const generateTask = (config: IGeneratorConfig): IGeneratedTask => {
  logger.info('GENERATOR', 'Запуск генератора з конфігом:', config)

  validateConfig(config)

  //C: Випадкове рішення чи генерувати варіанти відповідей
  //C: Random decision whether to generate answer options
  const shouldGenerateOptions = config.constraints.canGenerateWrongAnswer && Math.random() > 0.5
  logger.info('GENERATOR', 'Генерація варіантів відповідей:', shouldGenerateOptions)

  //C: Генерація змінних та правильної відповіді
  //C: Generate variables and correct answer
  const { variables, correctAnswer } = generateValidVariablesAndAnswer(config)

  //C: Генерація тексту умови завдання
  //C: Generate task condition text
  const condition = generateCondition(config.condition, variables)

  //C: Аналіз типу результату для подальшої обробки
  //C: Analyze result type for further processing
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

//C: Валідація конфігурації генератора
//C: Validate generator configuration
const validateConfig = (config: IGeneratorConfig): void => {
  if (!config.variables || Object.keys(config.variables).length === 0) {
    throw new Error('Variables configuration is empty')
  }
}

//C: Генерація валідних змінних та відповіді з перевіркою обмежень
//C: Generate valid variables and answer with constraint validation
const generateValidVariablesAndAnswer = (config: IGeneratorConfig): { variables: Record<string, number>; correctAnswer: string } => {
  let variables: Record<string, number>
  let correctAnswer: string
	let rawNumericResult: number
  let attempts = 0

  //C: Цикл генерації з перевіркою валідності результату
  //C: Generation loop with result validity checking
  do {
    logger.info(`GENERATOR`, `Спроба ${attempts + 1} генерації змінних`)

    variables = generateVariables(config.variables, config.constraints, config.template)

		let rawAnswer = evaluateTemplate(config.template, variables)
		rawNumericResult = extractNumericValue(rawAnswer)
		correctAnswer = formatDecimal(rawAnswer, true)

    logger.info('GENERATOR', 'Сгенеровані змінні:', variables)
    logger.info('GENERATOR', 'Чистая відповідь:', rawNumericResult)
    logger.info('GENERATOR', 'Правильна відповідь:', correctAnswer)

    if (isValidResult(correctAnswer, variables, config.constraints, rawNumericResult)) {
      logger.info('GENERATOR', 'Усі перевірки пройдені')
      break
    }

  } while (++attempts < 100)

  //C: Перевірка максимальної кількості спроб
  //C: Check maximum attempts limit
  if (attempts >= 100) {
    throw new Error('Не вдається згенерувати завдання з вказаними обмеженнями')
  }

  return { variables, correctAnswer }
}

//C: Комплексна перевірка валідності результату генерації
//C: Comprehensive validation of generation result
const isValidResult = (
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

	//C: Перевірка дозволу від'ємних значень ДО перевірки типу результату
  //C: Check allowance of negative values BEFORE result type check
  if (!constraints.canBeNegative && checkIfNegativeFraction(correctAnswer)) {
    logger.info('GENERATOR', `Пропуск: від'ємний результат не дозволен`)
    return false
  }

  //C: Перевірка чи результат є строковим (не числовим)
  //C: Check if result is non-numeric (string)
  const isStringResult = isNonNumericResult(correctAnswer)

  if (isStringResult) {
    logger.info('GENERATOR', 'Строковий результат, приймаємо')
    return true
  }

  //C: Вилучення числової частини з рядка (навіть з одиницями виміру)
  //C: Extract numeric part from string (even with measurement units)
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

  //C: Перевірка дозволу від'ємних значень
  //C: Check allowance of negative values
  if (!constraints.canBeNegative && checkIfNegativeFraction(correctAnswer)) {
    logger.info('GENERATOR', `Пропуск: від'ємний результат не дозволен`)
    return false
  }

  return true
}

//C: Вилучення числового значення з рядка (ігнорує одиниці виміру)
//C: Extract numeric value from string (ignores measurement units)
const extractNumericValue = (answer: string): number => {
  //C: Видаляємо HTML-теги для дробів
  //C: Remove HTML tags for fractions
  const cleanAnswer = answer.replace(/<[^>]*>/g, '')

  //C: Шукаємо числову частину (цілі та десяткові числа)
  //C: Look for numeric part (integers and decimals)
  const numericMatch = cleanAnswer.match(/(-?\d+[.,]?\d*)/)
  if (!numericMatch) return NaN

  //C: Заміняємо кому на крапку та видаляємо пробіли
  //C: Replace comma with dot and remove spaces
  const numericPart = numericMatch[0].replace(/\s/g, '').replace(',', '.')
  return Number(numericPart)
}

//C: Перевірка чи є результат нечисловим (строковим)
//C: Check if result is non-numeric (string)
const isNonNumericResult = (answer: string): boolean => {
  //C: Список індикаторів строкових результатів
  //C: List of string result indicators
  const nonNumericIndicators = STRING_RESULTS

  //C: Видаляємо всі одиниці виміру та пробіли
  //C: Remove all measurement units and spaces
  let cleanAnswer = answer
  nonNumericIndicators.forEach(unit => {
    cleanAnswer = cleanAnswer.replace(unit, '')
  })

  //C: Перевіряємо чи залишилось число
  //C: Check if number remains
	if (cleanAnswer === '') return true

	const numericValue = Number(cleanAnswer.replace(',', '.').replace(/\s/g, ''))
	return isNaN(numericValue)
}