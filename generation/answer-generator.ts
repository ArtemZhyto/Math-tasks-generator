//C: Генератор варіантів відповідей для тестових завдань
//C: Створює правильні та неправильні варіанти відповідей
//C: Обробляє числові, строкові та дробові типи відповідей
//C: Генерує 4 варіанти відповідей з одним правильним

//C: Answer options generator for test tasks
//C: Creates correct and incorrect answer options
//C: Handles numeric, string and fraction answer types
//C: Generates 4 answer options with one correct



//@ Modules
import { IConstraints } from '../types'
import MathFunctions from '../evaluation/math-functions'
import { parseFraction } from '../utils/fraction-utils'
import { logger } from '../utils/logger'
import { MEASUREMENT_UNITS } from '../constants'

//C: Генерація варіантів відповідей для тестових завдань
//C: Generate answer options for test tasks
export const generateAnswers = (
  correctAnswer: string, 
  constraints: IConstraints, 
  isNumeric: boolean
): string[] => {
  logger.info('ANSWERS', 'Генерація варіантів для:', correctAnswer, 'isNumeric:', isNumeric)
  
  //C: Перевірка чи потрібно генерувати варіанти відповідей
  //C: Check if answer options need to be generated
  const shouldGenerateOptions = constraints.canGenerateWrongAnswer && Math.random() > 0.5
  if (!shouldGenerateOptions) {
    return []
  }
  
  const answers = new Set<string>()
  answers.add(correctAnswer)
  
  const isFractionAnswer = correctAnswer.includes('<sup>') || correctAnswer.includes('/')
  const hasUnits = hasMeasurementUnits(correctAnswer)
  
  //C: Генерація 3 неправильних варіантів для створення 4 варіантів відповіді
  //C: Generate 3 wrong options to create 4 answer choices
  while (answers.size < 4) {
    let wrongAnswer = generateWrongAnswer(correctAnswer, constraints, isNumeric, isFractionAnswer, hasUnits)
    
    if (!answers.has(wrongAnswer)) {
      answers.add(wrongAnswer)
    }
  }
  
  return Array.from(answers).sort(() => Math.random() - 0.5)
}

//C: Основний маршрутизатор для генерації неправильних відповідей за типом
//C: Main router for generating wrong answers by type
const generateWrongAnswer = (
  correctAnswer: string,
  constraints: IConstraints,
  isNumeric: boolean,
  isFractionAnswer: boolean,
  hasUnits: boolean
): string => {
  if (hasUnits) {
    return generateWrongAnswerWithUnits(correctAnswer, constraints)
  }
  
  if (isFractionAnswer) {
    return generateFractionWrongAnswer(correctAnswer, constraints)
  }
  
  if (isNumeric) {
    return generateNumericWrongAnswer(Number(correctAnswer), constraints)
  }
  
  return generateStringWrongAnswer(correctAnswer, constraints)
}

//C: Генерація неправильної відповіді з одиницями виміру
//C: Generate wrong answer with measurement units
const generateWrongAnswerWithUnits = (correctAnswer: string, constraints: IConstraints): string => {
  logger.info('WRONG_UNITS', 'Генерація неправильної відповіді з одиниицями для:', correctAnswer)
  
  const parts = correctAnswer.split(' ')
  if (parts.length < 2) {
    return generateStringWrongAnswer(correctAnswer, constraints)
  }
  
  const numericPart = parts[0]
  const units = parts.slice(1).join(' ')
  const numericValue = Number(numericPart.replace(',', '.'))
  
  if (isNaN(numericValue)) {
    return generateStringWrongAnswer(correctAnswer, constraints)
  }
  
  const wrongNumeric = generateWrongNumericValue(numericValue, constraints, 20)
  const formattedWrongAnswer = formatNumericValue(wrongNumeric, constraints.integerResult)
  
  return `${formattedWrongAnswer} ${units}`
}

//C: Генерація числової неправильної відповіді
//C: Generate numeric wrong answer
const generateNumericWrongAnswer = (correctValue: number, constraints: IConstraints): string => {
  const wrongAnswer = generateWrongNumericValue(correctValue, constraints, 50)
  return formatNumericValue(wrongAnswer, constraints.integerResult)
}

//C: Генерація неправильного числового значення з обмеженнями
//C: Generate wrong numeric value with constraints
const generateWrongNumericValue = (
  correctValue: number, 
  constraints: IConstraints, 
  maxAttempts: number
): number => {
  let wrongValue: number
  let attempts = 0
  
  do {
    wrongValue = applyWrongValueStrategy(correctValue, constraints)
    attempts++
    
    //C: Примусове завершення після перевищення ліміту спроб
    //C: Force completion after exceeding attempt limit
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

//C: Застосування різних стратегій для створення неправильної відповіді
//C: Apply different strategies to create wrong answer
const applyWrongValueStrategy = (correctValue: number, constraints: IConstraints): number => {
  const strategy = Math.floor(Math.random() * 4)
  
  switch (strategy) {
    case 0:
      //C: Випадкове число з діапазону обмежень
      //C: Random number from constraint range
      const min = constraints.minResult || 1
      const max = constraints.maxResult || 20
      return MathFunctions.randomInt(min, max)
      
    case 1:
      //C: Зсув значення на випадкове число
      //C: Shift value by random number
      let offset = correctValue + MathFunctions.randomInt(-10, 10)
      return offset === correctValue ? correctValue + 1 : offset
      
    case 2:
      //C: Множення або ділення на коефіцієнт
      //C: Multiply or divide by coefficient
      let multiplied = correctValue * (Math.random() > 0.5 ? 2 : 0.5)
      return constraints.integerResult ? Math.round(multiplied) : multiplied
      
    default:
      //C: Невелике зміщення на ±1
      //C: Small shift by ±1
      return correctValue + (Math.random() > 0.5 ? 1 : -1)
  }
}

//C: Генерація строкової неправильної відповіді
//C: Generate string wrong answer
const generateStringWrongAnswer = (correctAnswer: string, constraints: IConstraints): string => {
  //C: Словник протилежних відповідей для булевих та операторів порівняння
  //C: Dictionary of opposite answers for boolean and comparison operators
  const oppositeAnswers: Record<string, string> = {
    'Так': 'Ні',
    'Ні': 'Так',
    '>': '<',
    '<': '>',
    '=': Math.random() > 0.5 ? '>' : '<'
  }
  
  if (oppositeAnswers[correctAnswer]) {
    return oppositeAnswers[correctAnswer]
  }
  
  if (correctAnswer.includes('<sup>') || correctAnswer.includes('/')) {
    return generateFractionWrongAnswer(correctAnswer, constraints)
  }
  
  const numericAnswer = Number(correctAnswer.replace(',', '.'))
  if (!isNaN(numericAnswer)) {
    return generateNumericWrongAnswer(numericAnswer, constraints)
  }
  
  //C: Випадковий вибір з доступних варіантів
  //C: Random selection from available options
  const options = ['1', '2', '3', '4', '5'].filter(opt => opt !== correctAnswer)
  return options[Math.floor(Math.random() * options.length)]
}

//C: Генерація дробової неправильної відповіді
//C: Generate fraction wrong answer
const generateFractionWrongAnswer = (correctAnswer: string, constraints: IConstraints): string => {
  try {
    const parsedCorrect = parseFraction(correctAnswer)
    
    if (parsedCorrect.denominator === 1) {
      return generateFractionFromInteger(parsedCorrect.numerator)
    }
    
    //C: Передаємо correctAnswer як додатковий параметр
    //C: Pass correctAnswer as additional parameter
    return generateFractionVariation(parsedCorrect, constraints, correctAnswer)
  } catch (error) {
    //C: Резервна генерація випадкового дробу при помилці
    //C: Fallback to random fraction generation on error
    return MathFunctions.simplifyFraction(
      MathFunctions.randomInt(1, 5),
      MathFunctions.randomInt(2, 8)
    )
  }
}

//C: Генерація дробу з цілого числа
//C: Generate fraction from integer
const generateFractionFromInteger = (integer: number): string => {
  const strategies = [
    () => MathFunctions.simplifyFraction(integer + 1, 2),
    () => MathFunctions.simplifyFraction(integer * 2, 3),
    () => MathFunctions.simplifyFraction(integer - 1, 2),
    () => MathFunctions.simplifyFraction(integer, 2)
  ]
  
  const randomStrategy = strategies[Math.floor(Math.random() * strategies.length)]
  return randomStrategy()
}

//C: Генерація варіацій дробу шляхом зміни чисельника/знаменника
//C: Generate fraction variations by changing numerator/denominator
const generateFractionVariation = (
  correct: { numerator: number; denominator: number }, 
  constraints: IConstraints,
  correctAnswer: string //C: Додаємо цей параметр / Add this parameter
): string => {
  let attempts = 0
  
  while (attempts < 20) {
    const strategy = Math.floor(Math.random() * 5)
    let wrongNumerator = correct.numerator
    let wrongDenominator = correct.denominator
    
    switch (strategy) {
      case 0:
        //C: Зміна чисельника на ±3
        //C: Change numerator by ±3
        wrongNumerator = correct.numerator + MathFunctions.randomInt(-3, 3)
        if (wrongNumerator === correct.numerator) {
          wrongNumerator = correct.numerator + 1
        }
        break
        
      case 1:
        //C: Зміна знаменника на ±2
        //C: Change denominator by ±2
        wrongDenominator = correct.denominator + MathFunctions.randomInt(-2, 2)
        if (wrongDenominator === correct.denominator || wrongDenominator <= 0) {
          wrongDenominator = correct.denominator + 1
        }
        break
        
      case 2:
        //C: Зміна обох компонентів дробу
        //C: Change both fraction components
        wrongNumerator = correct.numerator + MathFunctions.randomInt(-2, 2)
        wrongDenominator = correct.denominator + MathFunctions.randomInt(-1, 1)
        if (wrongNumerator === correct.numerator && wrongDenominator === correct.denominator) {
          wrongNumerator = correct.numerator + 1
          wrongDenominator = correct.denominator + 1
        }
        break
        
      case 3:
        //C: Масштабування дробу з випадковим фактором
        //C: Scale fraction with random factor
        const factor = MathFunctions.randomInt(1, 3)
        wrongNumerator = correct.numerator * factor + MathFunctions.randomInt(-1, 1)
        wrongDenominator = correct.denominator * factor + MathFunctions.randomInt(-1, 1)
        break
        
      default:
        //C: Повністю випадкова генерація дробу
        //C: Completely random fraction generation
        wrongNumerator = MathFunctions.randomInt(1, 5)
        wrongDenominator = MathFunctions.randomInt(2, 8)
    }
    
    //C: Нормалізація значень для уникнення некоректних дробів
    //C: Normalize values to avoid invalid fractions
    wrongNumerator = Math.max(1, Math.abs(wrongNumerator))
    wrongDenominator = Math.max(2, Math.abs(wrongDenominator))
    
    const simplified = MathFunctions.simplifyFraction(wrongNumerator, wrongDenominator)
    
    //C: Перевірка чи підходить згенерований варіант
    //C: Check if generated option is suitable
    if (simplified !== correctAnswer && 
        simplified !== '0' && 
        !simplified.includes('NaN') &&
        (constraints.canBeNegative || !simplified.includes('-'))) {
      return simplified
    }
    
    attempts++
  }
  
  //C: Резервний варіант після 20 невдалих спроб
  //C: Fallback option after 20 failed attempts
  return MathFunctions.simplifyFraction(
    MathFunctions.randomInt(1, 5),
    MathFunctions.randomInt(2, 8)
  )
}

//C: Перевірка наявності одиниць виміру у відповіді
//C: Check for measurement units in answer
const hasMeasurementUnits = (answer: string): boolean => {
  return MEASUREMENT_UNITS.some(unit => answer.includes(unit))
}

//C: Форматування числового значення з урахуванням обмежень
//C: Format numeric value considering constraints
const formatNumericValue = (value: number, integerResult?: boolean): string => {
  if (integerResult) {
    value = Math.round(value)
  }
  
  return Number.isInteger(value) 
    ? value.toString() 
    : value.toString().replace('.', ',')
}