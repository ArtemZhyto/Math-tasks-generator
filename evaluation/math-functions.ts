//C: Бібліотека математичних функцій
//C: Містить реалізації всіх підтримуваних функцій
//C: Операції з дробами, порівняння, арифметика
//C: Конвертація між форматами чисел

//C: Mathematical functions library
//C: Contains implementations of all supported functions
//C: Fraction operations, comparisons, arithmetic
//C: Conversion between number formats



//C: Список всіх доступних математичних функцій для генератора
//C: List of all available mathematical functions for generator
export const ALL_FUNCTIONS = [
  'sum', 'multiply', 'minus', 'divide', 'modulus', 'isPrime',
  'pow', 'sqrt', 'root', 'greater', 'less', 'equal', 'compare', 
  'max', 'min', 'fraction', 'fractionAdd', 'fractionSubtract',
  'fractionMultiply', 'fractionDivide', 'numerator', 'denominator',
  'gcd', 'lcm', 'toDecimal', 'toFraction', 'round', 'concat'
]

//C: Об'єкт з реалізаціями всіх математичних функцій
//C: Object with implementations of all mathematical functions
const MathFunctions = {
  //C: Базові арифметичні операції
  //C: Basic arithmetic operations
  sum: (a: number, b: number): number => a + b,
	multiply: (a: number, b: number): number => a * b,
  minus: (a: number, b: number): number => a - b,
  divide: (a: number, b: number): number => a / b,
  
  //C: Операція модуля з перевіркою ділення на нуль
  //C: Modulus operation with division by zero check
  modulus: (a: number, b: number): number => {
    if (b === 0) {
      throw new Error('Division by zero is not allowed')
    }
    return a % b
  },

  //C: Конкатенація аргументів у рядок
  //C: Concatenate arguments into string
	concat: (...args: any[]): string => {
    console.log('🔤 [CONCAT] Вызов concat с аргументами:', args)
    const result = args.join('')
    console.log('🔤 [CONCAT] Результат:', result)
    return result
  },

  //C: Математичні функції піднесення до степеня та коренів
  //C: Mathematical functions for exponentiation and roots
  pow: (a: number, b: number): number => Math.pow(a, b),
  sqrt: (a: number): number => Math.sqrt(a),
	root: (n: number, a: number): number => Math.pow(a, 1/n),

  //C: Округлення чисел з заданою точністю
  //C: Round numbers with specified precision
	round: (a: number, precision: number = 1): number => {
		if (precision === 1) {
			return Math.round(a)
		}
		return Math.round(a * precision) / precision
	},

  //C: Функції порівняння з умовним поверненням значень
  //C: Comparison functions with conditional value return
  greater: (a: number, b: number, ifTrue: any, ifFalse: any): any => a > b ? ifTrue : ifFalse,
  less: (a: number, b: number, ifTrue: any, ifFalse: any): any => a < b ? ifTrue : ifFalse,
  equal: (a: number, b: number, ifTrue: any, ifFalse: any): any => a === b ? ifTrue : ifFalse,
  compare: (a: number, b: number, ifGreater: any, ifLess: any, ifEqual: any): any => {
    if (a > b) return ifGreater
    if (a < b) return ifLess
    return ifEqual
  },

  //C: Пошук максимального та мінімального значення
  //C: Find maximum and minimum value
  max: (...numbers: number[]): number => Math.max(...numbers),
  min: (...numbers: number[]): number => Math.min(...numbers),

  //C: Перевірка чи є число простим
  //C: Check if number is prime
  isPrime: (n: number, ifTrue: any, ifFalse: any): any => {
    if (n < 2) return ifFalse
    if (n === 2) return ifTrue
    if (n % 2 === 0) return ifFalse
    
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) return ifFalse
    }
    return ifTrue
  },

  //C: Створення дробу з чисельника та знаменника
  //C: Create fraction from numerator and denominator
	fraction: (numerator: number, denominator: number): string => {
		return MathFunctions.simplifyFraction(numerator, denominator)
	},
	
  //C: Конвертація дробу у десяткове число
  //C: Convert fraction to decimal number
	toDecimal: (fraction: string): number => {
    const parsed = parseFraction(fraction)
    return parsed.numerator / parsed.denominator
  },

  //C: Конвертація десяткового числа у дріб з обмеженням знаменника
  //C: Convert decimal number to fraction with denominator limit
	toFraction: (decimal: number, maxDenominator: number = 1000): string => {
		if (Number.isInteger(decimal)) return decimal.toString()

    //C: Обробка від'ємних чисел та виділення цілої частини
    //C: Handle negative numbers and extract whole part
		const sign = decimal < 0 ? -1 : 1
		decimal = Math.abs(decimal)
		const whole = Math.floor(decimal)
		let frac = decimal - whole

    //C: Пошук найкращого наближення дробу
    //C: Find best fraction approximation
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

		const simplified = MathFunctions.simplifyFraction(bestNumerator, bestDenominator)

    //C: Форматування результату з урахуванням знаку та цілої частини
    //C: Format result considering sign and whole part
		if (whole === 0)
			return sign < 0 ? `-${simplified}` : simplified

		return sign < 0
			? `-${whole}${simplified}`
			: `${whole}${simplified}`
	},

  //C: Додавання дробів з приведенням до спільного знаменника
  //C: Add fractions by finding common denominator
  fractionAdd: (...args: any[]): string => {
    const fractions = args as string[]
    
    const parsedFractions = fractions.map(f => parseFraction(f))
    let commonDenominator = parsedFractions.reduce((lcm, f) => MathFunctions.lcm(lcm, f.denominator), 1)
    
    let sumNumerator = 0
    parsedFractions.forEach(f => {
      sumNumerator += f.numerator * (commonDenominator / f.denominator)
    })
    
    return MathFunctions.simplifyFraction(sumNumerator, commonDenominator)
  },

  //C: Віднімання дробів
  //C: Subtract fractions
  fractionSubtract: (...args: any[]): string => {
    const [f1, f2] = args as string[]
    
    const frac1 = parseFraction(f1)
    const frac2 = parseFraction(f2)
    const commonDenominator = MathFunctions.lcm(frac1.denominator, frac2.denominator)
    
    const numerator1 = frac1.numerator * (commonDenominator / frac1.denominator)
    const numerator2 = frac2.numerator * (commonDenominator / frac2.denominator)
    
    return MathFunctions.simplifyFraction(numerator1 - numerator2, commonDenominator)
  },

  //C: Множення дробів
  //C: Multiply fractions
  fractionMultiply: (...args: any[]): string => {
    const fractions = args as string[]
    
    const parsedFractions = fractions.map(f => parseFraction(f))
    let numerator = parsedFractions.reduce((acc, f) => acc * f.numerator, 1)
    let denominator = parsedFractions.reduce((acc, f) => acc * f.denominator, 1)
    
    return MathFunctions.simplifyFraction(numerator, denominator)
  },

  //C: Ділення дробів (множення на обернений дріб)
  //C: Divide fractions (multiply by reciprocal)
  fractionDivide: (...args: any[]): string => {
    const [f1, f2] = args as string[]
    
    const frac1 = parseFraction(f1)
    const frac2 = parseFraction(f2)
    
    return MathFunctions.simplifyFraction(frac1.numerator * frac2.denominator, frac1.denominator * frac2.numerator)
  },

  //C: Спрощення дробу до найпростішого вигляду
  //C: Simplify fraction to simplest form
  simplifyFraction: (numerator: number, denominator: number): string => {
    const gcd = MathFunctions.gcd(numerator, denominator)
    const simpleNum = numerator / gcd
    const simpleDen = denominator / gcd
    
    if (simpleDen === 1) return simpleNum.toString()
    if (simpleNum === 0) return "0"
    
    //C: Конвертація неправильного дробу у змішане число
    //C: Convert improper fraction to mixed number
    if (Math.abs(simpleNum) > Math.abs(simpleDen)) {
      const whole = Math.trunc(simpleNum / simpleDen)
      const remainder = Math.abs(simpleNum % simpleDen)
      
      if (remainder === 0) {
        return whole.toString()
      }
      
      return `${whole}<sup>${remainder}</sup>/<sub>${simpleDen}</sub>`
    }
    
    return `<sup>${simpleNum}</sup>/<sub>${simpleDen}</sub>`
  },

  //C: Отримання чисельника з дробу
  //C: Get numerator from fraction
  numerator: (fraction: string): number => {
    const parsed = parseFraction(fraction)
    return parsed.numerator
  },

  //C: Отримання знаменника з дробу
  //C: Get denominator from fraction
  denominator: (fraction: string): number => {
    const parsed = parseFraction(fraction)
    return parsed.denominator
  },

  //C: Найбільший спільний дільник (рекурсивний алгоритм Евкліда)
  //C: Greatest common divisor (recursive Euclidean algorithm)
  gcd: (a: number, b: number): number => {
    a = Math.abs(a)
    b = Math.abs(b)
    return b === 0 ? a : MathFunctions.gcd(b, a % b)
  },

  //C: Найменше спільне кратне
  //C: Least common multiple
  lcm: (a: number, b: number): number => {
    return Math.abs(a * b) / MathFunctions.gcd(a, b)
  },

  //C: Генерація випадкового цілого числа в діапазоні
  //C: Generate random integer in range
  randomInt: (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

//C: Функція парсингу рядка дробу у числові компоненти
//C: Function to parse fraction string into numeric components
function parseFraction(fraction: string): { numerator: number; denominator: number } {
  //C: Парсинг змішаних дробів (наприклад, "1<sup>2</sup>/<sub>3</sub>")
  //C: Parse mixed fractions (e.g., "1<sup>2</sup>/<sub>3</sub>")
  const mixedMatch = fraction.match(/(-?\d+)\s*<sup>(\d+)<\/sup>\/<sub>(\d+)<\/sub>/)
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1])
    const numerator = parseInt(mixedMatch[2])
    const denominator = parseInt(mixedMatch[3])
    return {
      numerator: whole * denominator + (whole < 0 ? -numerator : numerator),
      denominator: denominator
    }
  }
  
  //C: Парсинг простих дробів (наприклад, "<sup>2</sup>/<sub>3</sub>")
  //C: Parse simple fractions (e.g., "<sup>2</sup>/<sub>3</sub>")
  const simpleMatch = fraction.match(/<sup>(-?\d+)<\/sup>\/<sub>(\d+)<\/sub>/)
  if (simpleMatch) {
    return {
      numerator: parseInt(simpleMatch[1]),
      denominator: parseInt(simpleMatch[2])
    }
  }
  
  //C: Обробка цілих чисел
  //C: Handle whole numbers
  const num = Number(fraction)
  if (!isNaN(num)) {
    return { numerator: num, denominator: 1 }
  }
  
  throw new Error(`Invalid fraction format: ${fraction}`)
}

export default MathFunctions