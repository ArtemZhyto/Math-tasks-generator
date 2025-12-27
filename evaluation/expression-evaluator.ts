//C: Обчислювач математичних виразів з функціями
//C: Рекурсивно обчислює вкладені математичні функції
//C: Парсить аргументи функцій з урахуванням вкладеності
//C: Обробляє строкові літерали та десяткові числа

//C: Mathematical expression evaluator with functions
//C: Recursively evaluates nested mathematical functions
//C: Parses function arguments considering nesting
//C: Handles string literals and decimal numbers



//@ Modules
import { ALL_FUNCTIONS } from './math-functions'
import { executeFunction, isStringLiteral } from './function-executor'
import { logger } from '../utils/logger'

//C: Рекурсивний обчислювач математичних виразів
//C: Recursive mathematical expression evaluator
export const evaluateExpression = (expr: string): string => {
  let currentExpr = expr
  let lastExpr = ""
  let iterations = 0

  //C: Цикл обробки виразу до повної деконструкції всіх функцій
  //C: Expression processing loop until all functions are fully deconstructed
  while (currentExpr !== lastExpr && iterations < 50) {
    lastExpr = currentExpr
    iterations++

    const match = findInnermostFunction(currentExpr)
    if (match) {
      const [fullMatch, func, argsStr] = match
      const args = parseArguments(argsStr)

      //C: Рекурсивне обчислення вкладених аргументів-функцій
      //C: Recursive evaluation of nested function arguments
      const evaluatedArgs = args.map(arg =>
        arg.includes('(') && !isStringLiteral(arg) ? evaluateExpression(arg) : arg
      )

      const rawResult = executeFunction(func, evaluatedArgs)
      currentExpr = currentExpr.replace(fullMatch, sanitizeNumericResult(rawResult))
    }
  }
  return currentExpr
}

//C: Усунення похибок плаваючої коми та форматування результату
//C: Eliminating floating point errors and formatting result
const sanitizeNumericResult = (val: string): string => {
  const num = parseFloat(val)
  if (!isNaN(num) && isFinite(num) && val.includes('.')) {
    return parseFloat(num.toPrecision(12)).toString()
  }
  return val
}

//C: Пошук найглибшої вкладеної функції у виразі
//C: Find innermost nested function in expression
const findInnermostFunction = (expr: string): RegExpMatchArray | null => {
  const functionRegex = new RegExp(`(${ALL_FUNCTIONS.join('|')})\\(([^()]*)\\)`)
  return expr.match(functionRegex)
}

//C: Парсинг рядка аргументів функції на окремі параметри
//C: Parse function arguments string into separate parameters
export const parseArguments = (argsStr: string): string[] => {
  logger.info('PARSE_ARGS', 'Парсинг аргументів з:', argsStr)
  const args: string[] = []
  let current = ''
  let depth = 0
  let inQuotes = false
  let quoteChar = ''

  //C: Побітова обробка рядка аргументів
  //C: Character-by-character processing of arguments string
  for (let i = 0; i < argsStr.length; i++) {
    const char = argsStr[i]

    //C: Обробка початку строкового літералу
    //C: Handle string literal start
    if ((char === "'" || char === '"') && !inQuotes) {
      inQuotes = true
      quoteChar = char
      current += char
			continue
    } else if (char === quoteChar && inQuotes) {
      //C: Обробка кінця строкового літералу
      //C: Handle string literal end
      inQuotes = false
      current += char
      continue
    }

    if (inQuotes) {
      //C: Всередині строкового літералу - додаємо символ
      //C: Inside string literal - add character
      current += char
    } else {
      //C: Обробка поза строковими літералами
      //C: Processing outside string literals
      if (char === '(') {
        //C: Збільшення глибини вкладеності дужок
        //C: Increase bracket nesting depth
        depth++
        current += char
      } else if (char === ')') {
        //C: Зменшення глибини вкладеності дужок
        //C: Decrease bracket nesting depth
        depth--
        current += char
      } else if (char === ',' && depth === 0) {
        //C: Розділювач аргументів тільки на нульовому рівні вкладеності
        //C: Argument separator only at zero nesting level
				if (current.trim()) {
          args.push(current.trim())
        }
				current = ''
      } else {
        //C: Додавання символу до поточного аргументу
        //C: Add character to current argument
        current += char
      }
    }
  }

  //C: Додавання останнього аргументу якщо він є (не строкового)
  //C: Add last argument if exists (non-string)
  if (current.trim()) {
    args.push(current.trim())
  }

  logger.info('PARSE_ARGS', 'Результат парсингу:', args)
  return args
}