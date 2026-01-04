export const generateWrongAlgebraicAnswer = (correctAnswer: string): string => {
  const numberRegex = /([+-]?)\s*(\d+[.,]?\d*)/g

  return correctAnswer.replace(numberRegex, (match, sign, numStr, offset) => {
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

    const hasComma = numStr.includes(',')
    let formattedNum = hasComma ? result.toString().replace('.', ',') : result.toString()

    const restOfString = correctAnswer.slice(offset + match.length)
    const isFollowedByLetter = /^[a-zA-Zа-яА-ЯіІєЄїЇ]/.test(restOfString.trim())

    if (result === 1 && isFollowedByLetter) {
      formattedNum = ''
    }

    if (sign) {
      if (offset === 0) return `${sign}${formattedNum}`

      return ` ${sign} ${formattedNum} `.replace(/\s+/g, ' ').trim()
    }

    return formattedNum
  })
}