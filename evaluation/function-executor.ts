//C: Виконавець математичних функцій
//C: Виконує конкретні математичні функції за назвою
//C: Обробляє спеціальні випадки як concat
//C: Форматує результати виконання функцій

//C: Mathematical functions executor
//C: Executes specific mathematical functions by name
//C: Handles special cases like concat
//C: Formats function execution results



//@ Modules
import MathFunctions from './math-functions'
import { logger } from '../utils/logger'

//C: Перевірка чи є аргумент строковим літералом (в лапках)
//C: Check if argument is string literal (in quotes)
export const isStringLiteral = (arg: string): boolean => {
  return (arg.startsWith("'") && arg.endsWith("'")) ||
         (arg.startsWith('"') && arg.endsWith('"'))
}

//C: Головна функція виконання математичних функцій
//C: Main function for executing mathematical functions
export const executeFunction = (func: string, args: string[]): string => {
  logger.info(`EXECUTE`, 'Виконання функції ${func} з аргументами:', args)

	//C: Очищення аргументів від лапок для строкових літералів
  //C: Clean arguments from quotes for string literals
  const processedArgs = args.map(arg => {
    if (isStringLiteral(arg)) {
      return arg.slice(1, -1)
    }
    return arg
  })

	logger.info(`EXECUTE`, 'Оброблені аргументи:', processedArgs)

  //C: Спеціальна обробка функції конкатенації
  //C: Special handling for concatenation function
  if (func === 'concat') {
    return handleConcat(args)
  }

	return executeMathFunction(func, processedArgs)
}

//C: Обробка функції конкатенації з особливою логікою
//C: Handle concatenation function with special logic
const handleConcat = (args: any[]): string => {
  logger.info('CONCAT', 'Спеціальна обробка concat з аргументами:', args)

  //C: Функція concat вже сама обробляє лапки, передаємо аргументи як є
  //C: Concat function handles quotes itself, pass arguments as is
  const result = MathFunctions.concat(...args)
  logger.info('CONCAT', 'Результат конкатенації:', result)
  return result
}

//C: Виконання конкретної математичної функції за назвою
//C: Execute specific mathematical function by name
const executeMathFunction = (func: string, args: any[]): string => {
  switch (func) {
    //C: Базові арифметичні операції
    //C: Basic arithmetic operations
    case 'sum': return (Number(args[0]) + Number(args[1])).toString()
    case 'multiply': return (Number(args[0]) * Number(args[1])).toString()
    case 'minus': return (Number(args[0]) - Number(args[1])).toString()
    case 'divide': return (Number(args[0]) / Number(args[1])).toString()
    case 'modulus': return MathFunctions.modulus(Number(args[0]), Number(args[1])).toString()

    //C: Математичні функції та перевірки
    //C: Mathematical functions and checks
    case 'isPrime': return MathFunctions.isPrime(Number(args[0]), args[1], args[2])
    case 'pow': return MathFunctions.pow(Number(args[0]), Number(args[1])).toString()
    case 'sqrt': return MathFunctions.sqrt(Number(args[0])).toString()
    case 'root': return MathFunctions.root(Number(args[0]), Number(args[1])).toString()
    case 'round': return handleRound(args)

    //C: Функції порівняння з умовним поверненням
    //C: Comparison functions with conditional return
    case 'greater': return MathFunctions.greater(Number(args[0]), Number(args[1]), args[2], args[3])
    case 'less': return MathFunctions.less(Number(args[0]), Number(args[1]), args[2], args[3])
    case 'equal': return MathFunctions.equal(Number(args[0]), Number(args[1]), args[2], args[3])
    case 'compare': return MathFunctions.compare(Number(args[0]), Number(args[1]), args[2], args[3], args[4])

    //C: Статистичні функції
    //C: Statistical functions
    case 'max': return MathFunctions.max(...args.map(Number)).toString()
    case 'min': return MathFunctions.min(...args.map(Number)).toString()

    //C: Операції з дробами
    //C: Fraction operations
    case 'fraction': return MathFunctions.fraction(Number(args[0]), Number(args[1]))
    case 'fractionAdd': return MathFunctions.fractionAdd(...args)
    case 'fractionSubtract': return MathFunctions.fractionSubtract(args[0], args[1])
    case 'fractionMultiply': return MathFunctions.fractionMultiply(...args)
    case 'fractionDivide': return MathFunctions.fractionDivide(args[0], args[1])

    //C: Робота з компонентами дробів
    //C: Working with fraction components
    case 'numerator': return MathFunctions.numerator(args[0]).toString()
    case 'denominator': return MathFunctions.denominator(args[0]).toString()

    //C: Математичні утиліти
    //C: Mathematical utilities
    case 'gcd': return MathFunctions.gcd(Number(args[0]), Number(args[1])).toString()
    case 'lcm': return MathFunctions.lcm(Number(args[0]), Number(args[1])).toString()

    //C: Конвертація між форматами
    //C: Conversion between formats
    case 'toDecimal': return MathFunctions.toDecimal(args[0]).toString()
    case 'toFraction': return handleToFraction(args)

    default: throw new Error(`Unknown function: ${func}`)
  }
}

//C: Обробка функції округлення з параметром точності
//C: Handle rounding function with precision parameter
const handleRound = (args: any[]): string => {
  const value = Number(args[0])
  const precision = args[1] ? Number(args[1]) : 1000
  return MathFunctions.round(value, precision).toString()
}

//C: Обробка конвертації десяткового числа у дріб
//C: Handle conversion of decimal number to fraction
const handleToFraction = (args: any[]): string => {
  const decimalValue = Number(args[0])
  if (isNaN(decimalValue)) {
    throw new Error(`Invalid decimal value: ${args[0]}`)
  }
  const maxDenominator = args[1] ? Number(args[1]) : 1000
  return MathFunctions.toFraction(decimalValue, maxDenominator)
}