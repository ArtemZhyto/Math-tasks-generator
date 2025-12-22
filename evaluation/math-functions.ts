//C: Бібліотека математичних функцій
//C: Mathematical functions library

//@ Modules
import { logger } from '../utils/logger'
import { ALL_FUNCTIONS } from './math-functions/constants'
import { parseFraction } from './math-functions/parser'
import { Arithmetic } from './math-functions/arithmetic'

export { ALL_FUNCTIONS }

//C: Об'єкт з реалізаціями всіх математичних функцій
//C: Object with implementations of all mathematical functions
const MathFunctions = {
  sum: (a: number, b: number): number => a + b,
  multiply: (a: number, b: number): number => a * b,
  minus: (a: number, b: number): number => a - b,
  divide: (a: number, b: number): number => a / b,

  modulus: (a: number, b: number): number => {
    if (b === 0) throw new Error('Division by zero is not allowed')
    return a % b
  },

  concat: (...args: any[]): string => {
    logger.info('CONCAT', 'Виклик concat з аргументами: ', args)
    const processedArgs = args.map(arg => {
      if (typeof arg === 'string') {
        if ((arg.startsWith("'") && arg.endsWith("'")) ||
            (arg.startsWith('"') && arg.endsWith('"'))) {
          return arg.slice(1, -1)
        }
      }
      return arg
    })
    const result = processedArgs.join('')
    logger.info('CONCAT', 'Результат: ', result)
    return result
  },

  pow: (a: number, b: number): number => Math.pow(a, b),
  sqrt: (a: number): number => Math.sqrt(a),
  root: (n: number, a: number): number => Math.pow(a, 1/n),

  round: (a: number, precision: number = 1000): number => {
    return Math.round(a * precision) / precision
  },

  greater: (a: number, b: number, ifTrue: any, ifFalse: any): any => a > b ? ifTrue : ifFalse,
  less: (a: number, b: number, ifTrue: any, ifFalse: any): any => a < b ? ifTrue : ifFalse,
  equal: (a: number, b: number, ifTrue: any, ifFalse: any): any => a === b ? ifTrue : ifFalse,
  compare: (a: number, b: number, ifGreater: any, ifLess: any, ifEqual: any): any => {
    if (a > b) return ifGreater
    if (a < b) return ifLess
    return ifEqual
  },

  max: (...numbers: number[]): number => Math.max(...numbers),
  min: (...numbers: number[]): number => Math.min(...numbers),

  isPrime: (n: number, ifTrue: any, ifFalse: any): any => {
    if (n < 2) return ifFalse
    if (n === 2) return ifTrue
    if (n % 2 === 0) return ifFalse
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) return ifFalse
    }
    return ifTrue
  },

  //C: Робота з дробами (використовує допоміжні модулі)
  //C: Fraction operations (uses helper modules)
  fraction: (numerator: number, denominator: number): string => {
    return Arithmetic.simplifyFraction(numerator, denominator)
  },

  toDecimal: (fraction: string): number => {
    const parsed = parseFraction(fraction)
    return parsed.numerator / parsed.denominator
  },

  toFraction: (decimal: number, maxDenominator: number = 1000): string => {
    if (Number.isInteger(decimal)) return decimal.toString()
    const sign = decimal < 0 ? -1 : 1
    decimal = Math.abs(decimal)
    const whole = Math.floor(decimal)
    let frac = decimal - whole
    let bestNumerator = 1, bestDenominator = 1, minError = Infinity

    for (let d = 1; d <= maxDenominator; d++) {
      const n = Math.round(frac * d)
      const error = Math.abs(frac - n / d)
      if (error < minError) {
        minError = error
        bestNumerator = n
        bestDenominator = d
      }
    }

    const simplified = Arithmetic.simplifyFraction(bestNumerator, bestDenominator)
    if (whole === 0) return sign < 0 ? `-${simplified}` : simplified
    return sign < 0 ? `-${whole}${simplified}` : `${whole}${simplified}`
  },

  fractionAdd: (...args: any[]): string => {
    const fractions = args as string[]
    const parsedFractions = fractions.map(f => parseFraction(f))
    let commonDenominator = parsedFractions.reduce((lcmVal, f) => Arithmetic.lcm(lcmVal, f.denominator), 1)
    let sumNumerator = 0
    parsedFractions.forEach(f => {
      sumNumerator += f.numerator * (commonDenominator / f.denominator)
    })
    return Arithmetic.simplifyFraction(sumNumerator, commonDenominator)
  },

  fractionSubtract: (...args: any[]): string => {
    const [f1, f2] = args as string[]
    const frac1 = parseFraction(f1)
    const frac2 = parseFraction(f2)
    const commonDenominator = Arithmetic.lcm(frac1.denominator, frac2.denominator)
    const numerator1 = frac1.numerator * (commonDenominator / frac1.denominator)
    const numerator2 = frac2.numerator * (commonDenominator / frac2.denominator)
    return Arithmetic.simplifyFraction(numerator1 - numerator2, commonDenominator)
  },

  fractionMultiply: (...args: any[]): string => {
    const fractions = args as string[]
    const parsedFractions = fractions.map(f => parseFraction(f))
    let numerator = parsedFractions.reduce((acc, f) => acc * f.numerator, 1)
    let denominator = parsedFractions.reduce((acc, f) => acc * f.denominator, 1)
    return Arithmetic.simplifyFraction(numerator, denominator)
  },

  fractionDivide: (...args: any[]): string => {
    const [f1, f2] = args as string[]
    const frac1 = parseFraction(f1)
    const frac2 = parseFraction(f2)
    return Arithmetic.simplifyFraction(frac1.numerator * frac2.denominator, frac1.denominator * frac2.numerator)
  },

  numerator: (fraction: string): number => parseFraction(fraction).numerator,
  denominator: (fraction: string): number => parseFraction(fraction).denominator,

  //C: Проксі до Arithmetic модулю
  gcd: (a: number, b: number): number => Arithmetic.gcd(a, b),
  lcm: (a: number, b: number): number => Arithmetic.lcm(a, b),
  simplifyFraction: (n: number, d: number): string => Arithmetic.simplifyFraction(n, d),

  randomInt: (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

export default MathFunctions