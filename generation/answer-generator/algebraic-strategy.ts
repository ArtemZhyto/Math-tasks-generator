//@ Modules
import { Arithmetic } from "../../evaluation/math-functions/arithmetic"

export const generateWrongAlgebraicAnswer = (correctAnswer: string): string => {
  const fractionRegex = /(\d+)?(?:<sup>(\d+)<\/sup>\/<sub>(\d+)<\/sub>)/g
  let resultText = correctAnswer

  resultText = resultText.replace(fractionRegex, (match, whole, num, den) => {
    let w = whole ? Number(whole) : 0
    let n = Number(num)
    let d = Number(den)

    const dice = Math.random()

    if (dice < 0.5) w += (Math.random() > 0.5 ? 1 : -1)
    else n += (Math.random() > 0.5 ? 1 : -1)

    return Arithmetic.simplifyFraction(w * d + n, d)
  })

  const numberRegex = /([+-]?)\s*(\d+[.,]?\d*)/g

  resultText = resultText.replace(numberRegex, (match, sign, numStr, offset) => {
    const before = resultText.slice(0, offset)
    const after = resultText.slice(offset + match.length)

    if (before.lastIndexOf('<sup') > before.lastIndexOf('</h4>') ||
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

    result = Math.max(1, Math.abs(Math.round(result)))

    let formattedNum = numStr.includes(',') ? result.toString().replace('.', ',') : result.toString()

    const trimmedBefore = before.trim()
    const trimmedAfter = after.trim()

    if (sign) {
      const isUnary = offset === 0 ||
                      trimmedBefore.endsWith('=') ||
                      trimmedBefore.endsWith('(') ||
                      trimmedBefore.endsWith(';')

      if (isUnary) {
        const spaceBefore = (offset === 0 || trimmedBefore.endsWith('(') || trimmedBefore.endsWith(';')) ? '' : ' '

        return `${spaceBefore}${sign}${formattedNum}`
      }

      return ` ${sign} ${formattedNum}`
    } else {
      const isCoordinatePart = trimmedBefore.endsWith('(') ||
                               trimmedBefore.endsWith(';') ||
                               trimmedAfter.startsWith(';') ||
                               trimmedAfter.startsWith(')')

      if (isCoordinatePart) return formattedNum

      if (trimmedBefore.endsWith('=')) return ` ${formattedNum}`

      return formattedNum
    }
  })

  return resultText
    .replace(/\s+/g, ' ')
    .replace(/\(\s+/g, '(')
    .replace(/\s+\)/g, ')')
    .replace(/\s+;/g, ';')
    .replace(/;\s*/g, '; ')
    .trim()
}