//C: Обробник шаблонів математичних виразів
//C: Виконує підстановку змінних у шаблони
//C: Обчислює числову частину для перевірки обмежень
//C: Спеціальна обробка функції concat

//C: Mathematical templates processor
//C: Performs variable substitution in templates
//C: Calculates numeric part for constraint validation
//C: Special handling of concat function



//@ Modules
import { evaluateExpression } from './expression-evaluator'
import { logger } from '../utils/logger'

//C: Обчислення шаблону з підстановкою змінних та обробкою виразу
//C: Evaluate template with variable substitution and expression processing
export const evaluateTemplate = (template: string, variables: Record<string, number>): string => {
  logger.info('TEMPLATE', 'Початок обчислення шаблону:', template)
  let expression = template
  
  //C: Підстановка значень змінних у шаблон (@A, @B тощо)
  //C: Substitute variable values into template (@A, @B etc.)
  Object.entries(variables).forEach(([varName, value]) => {
    expression = expression.replace(new RegExp(`@${varName}`, 'g'), value.toString())
  })
  
  logger.info('TEMPLATE', 'Шаблон після підстановки змінних:', expression)
  
  //C: Обчислення математичного виразу з функціями
  //C: Evaluate mathematical expression with functions
  const result = evaluateExpression(expression)
  logger.info('TEMPLATE', 'Кінцевий результат:', result)
  return result
}

//C: Обчислення числової частини шаблону для перевірки обмежень
//C: Evaluate numeric part of template for constraint validation
export const evaluateNumericPart = (template: string, variables: Record<string, number>): number | string => {
  logger.info('NUMERIC_PART', 'Обчислення числової частини для:', template)
  
  let testExpression = template
  
  //C: Підстановка змінних у тестове вираження
  //C: Substitute variables into test expression
  Object.entries(variables).forEach(([varName, value]) => {
    testExpression = testExpression.replace(new RegExp(`@${varName}`, 'g'), value.toString())
  })
  
  logger.info('NUMERIC_PART', 'Тестовий вираз:', testExpression)
  
  //C: Спеціальна обробка функції concat для вилучення числової частини
  //C: Special handling of concat function to extract numeric part
  if (testExpression.startsWith('concat(')) {
    const numericExpression = extractNumericFromConcat(testExpression)
    return evaluateNumericExpression(numericExpression)
  }
  
  //C: Якщо вираз містить строкові функції (greater, less, equal, compare, isPrime)
  //C: то повертаємо строковий результат
  //C: If expression contains string functions, return string result
  const hasStringFunctions = /greater|less|equal|compare|isPrime/.test(testExpression)
  if (hasStringFunctions) {
    try {
      const stringResult = evaluateExpression(testExpression)
      logger.info('NUMERIC_PART', 'Строковий результат:', stringResult)
      return stringResult
    } catch (error) {
      logger.info('NUMERIC_PART', 'Помилка обчислення строкового результату:', error)
      throw error
    }
  }
  
  return evaluateNumericExpression(testExpression)
}

//C: Вилучення числового виразу з функції concat
//C: Extract numeric expression from concat function
const extractNumericFromConcat = (expression: string): string => {
  let depth = 0
  let commaPos = -1
  
  //C: Пошук першої коми на нульовому рівні вкладеності
  //C: Find first comma at zero nesting level
  for (let i = 7; i < expression.length; i++) {
    const char = expression[i]
    
    if (char === '(') depth++
    else if (char === ')') depth--
    else if (char === ',' && depth === 0) {
      commaPos = i
      break
    }
  }
  
  //C: Вилучення підрядка між 'concat(' та першою комою
  //C: Extract substring between 'concat(' and first comma
  if (commaPos !== -1) {
    return expression.substring(7, commaPos).trim()
  }
  
  return expression
}

//C: Обчислення числового виразу з конвертацією результату
//C: Evaluate numeric expression with result conversion
const evaluateNumericExpression = (expression: string): number => {
  //C: Обчислення виразу з подальшою конвертацією у число
  //C: Evaluate expression followed by conversion to number
  const result = evaluateExpression(expression)
  
  //C: Якщо результат - рядок, намагаємося витягти числову частину
  //C: If result is string, try to extract numeric part
  if (typeof result === 'string') {
    //C: Видаляємо всі нецифрові символи (крім мінуса, крапки та коми)
    //C: Remove all non-digit characters (except minus, dot and comma)
    const numericString = result.replace(/[^\d.,-]/g, '')
    
    //C: Якщо не залишилося цифр - це повністю строковий результат
    //C: If no digits left - it's completely string result
    if (numericString.length === 0) {
      throw new Error(`Повністю строковий результат: ${result}`)
    }
    
    //C: Конвертуємо залишок у число
    //C: Convert remainder to number
    const cleanResult = numericString.replace(/\s/g, '').replace(',', '.')
    const numericValue = Number(cleanResult)
    
    //C: Перевірка успішності конвертації у число
    //C: Check successful conversion to number
    if (isNaN(numericValue)) {
      throw new Error(`Не можу перевести у число: ${result}`)
    }
    
    return numericValue
  }
  
  //C: Якщо результат вже число
  //C: If result is already number
  return result
}