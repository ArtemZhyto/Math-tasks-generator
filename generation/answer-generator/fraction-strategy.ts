//@ Modules
import { IConstraints } from '../../types'
import MathFunctions from '../../evaluation/math-functions'

//C: Генерація варіацій дробу шляхом зміни чисельника/знаменника
//C: Generate fraction variations by changing numerator/denominator
export const generateFractionVariation = (
  correct: { numerator: number; denominator: number },
  constraints: IConstraints,
  correctAnswer: string
): string => {
  for (let attempts = 0; attempts < 20; attempts++) {
    const strategy = Math.floor(Math.random() * 5)
    let n = correct.numerator
    let d = correct.denominator

    if (strategy === 0) n += MathFunctions.randomInt(-3, 3)
    else if (strategy === 1) d += MathFunctions.randomInt(-2, 2)
    else if (strategy === 2) { n += MathFunctions.randomInt(-2, 2); d += MathFunctions.randomInt(-1, 1) }
    else if (strategy === 3) { const f = MathFunctions.randomInt(1, 3); n = n * f + 1; d = d * f - 1 }
    else { n = MathFunctions.randomInt(1, 5); d = MathFunctions.randomInt(2, 8) }

    const isNegative = (n * d < 0) && constraints.canBeNegative
    const absN = Math.max(1, Math.abs(n))
    const absD = Math.max(2, Math.abs(d))

    const fraction = MathFunctions.simplifyFraction(absN, absD)
    const result = isNegative ? `-${fraction}` : fraction

    if (result !== correctAnswer && !result.includes('NaN') && result !== '0') {
      return result
    }
  }

  return MathFunctions.simplifyFraction(MathFunctions.randomInt(1, 5), MathFunctions.randomInt(2, 8))
}