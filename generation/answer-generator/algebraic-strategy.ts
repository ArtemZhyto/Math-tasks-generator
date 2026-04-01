//@ Modules
import { Arithmetic } from "../../evaluation/math-functions/arithmetic"

export const generateWrongAlgebraicAnswer = (correctAnswer: string): string => {
  const fractionRegex = /(-)?(\d+)?(?:<sup>(\d+)<\/sup>\/<sub>(\d+)<\/sub>)/g
  let resultText = correctAnswer

  resultText = resultText.replace(fractionRegex, (match, minus, whole, num, den) => {
    let w = whole ? Number(whole) : 0
    let n = Number(num)
    let d = Number(den)
    const hasMinus = !!minus

    const dice = Math.random()

		if (dice < 0.5) w += (Math.random() > 0.5 ? 1 : -1)
    else n += (Math.random() > 0.5 ? 1 : -1)

    let totalNumerator = w * d + n

    if (hasMinus) totalNumerator = -totalNumerator

    const simplified = Arithmetic.simplifyFraction(totalNumerator, d)

    if (simplified.includes('-')) {
      const pureFraction = simplified.replace(/-/g, '')

      return `-${pureFraction}`
    }

    return simplified
  })

  const numberRegex = /([+-]?)\s*(\d+[.,]?\d*)/g

  resultText = resultText.replace(numberRegex, (match, sign, numStr, offset) => {
    const before = resultText.slice(0, offset)

    if (before.lastIndexOf('<sup') > before.lastIndexOf('</sup>') ||
        before.lastIndexOf('<sub') > before.lastIndexOf('</sub>')) {
      return match
    }

    const num = Number(numStr.replace(',', '.'))

    if (isNaN(num)) return match

    let result: number
    const dice = Math.random()

    if (dice < 0.4) {
      const offsetVal = [1, 2, 3][Math.floor(Math.random() * 3)]
      result = num + (Math.random() > 0.5 ? offsetVal : -offsetVal)
    } else if (dice < 0.8) {
      result = num * (Math.random() > 0.5 ? 2 : 1.5)
    } else {
      result = num <= 5 ? num + 10 : num - 4
    }

    const finalAbsNum = Math.max(1, Math.abs(Math.round(result)))
    let formattedNum = numStr.includes(',') ? finalAbsNum.toString().replace('.', ',') : finalAbsNum.toString()

    const trimmedBefore = before.trim()

    if (sign) {
      const isUnary = offset === 0 ||
                      /[[(=;]/.test(trimmedBefore.slice(-1))

      if (isUnary) {
        const needsSpace = offset !== 0 && !trimmedBefore.endsWith('(') && !trimmedBefore.endsWith(';')

        return `${needsSpace ? ' ' : ''}${sign}${formattedNum}`
      }

      return ` ${sign} ${formattedNum}`
    }

    const endsWithComparison = /[=><≥≤]/.test(trimmedBefore.slice(-1))

    return (endsWithComparison ? ` ${formattedNum}` : formattedNum)
  })

  return resultText
    .replace(/\s+/g, ' ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s+;/g, ';')
    .replace(/;\s*/g, '; ')
    .trim()
}