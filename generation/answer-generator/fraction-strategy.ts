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
  let attempts = 0
  while (attempts < 20) {
    const strategy = Math.floor(Math.random() * 5)
    let wrongNumerator = correct.numerator
    let wrongDenominator = correct.denominator

    switch (strategy) {
      case 0: wrongNumerator = correct.numerator + MathFunctions.randomInt(-3, 3); break
      case 1: wrongDenominator = correct.denominator + MathFunctions.randomInt(-2, 2); break
      case 2:
        wrongNumerator = correct.numerator + MathFunctions.randomInt(-2, 2)
        wrongDenominator = correct.denominator + MathFunctions.randomInt(-1, 1)
        break
      case 3:
        const factor = MathFunctions.randomInt(1, 3)
        wrongNumerator = correct.numerator * factor + MathFunctions.randomInt(-1, 1)
        wrongDenominator = correct.denominator * factor + MathFunctions.randomInt(-1, 1)
        break
      default:
        wrongNumerator = MathFunctions.randomInt(1, 5)
        wrongDenominator = MathFunctions.randomInt(2, 8)
    }

    wrongNumerator = Math.max(1, Math.abs(wrongNumerator))
    wrongDenominator = Math.max(2, Math.abs(wrongDenominator))
    const simplified = MathFunctions.simplifyFraction(wrongNumerator, wrongDenominator)

    if (simplified !== correctAnswer && simplified !== '0' && !simplified.includes('NaN') &&
       (constraints.canBeNegative || !simplified.includes('-'))) {
      return simplified
    }
    attempts++
  }
  return MathFunctions.simplifyFraction(MathFunctions.randomInt(1, 5), MathFunctions.randomInt(2, 8))
}