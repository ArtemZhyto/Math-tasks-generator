//C: Розділення тисяч (тільки для цілої частини)
//C: Thousand separators (only for integer part)
export const formatNumberWithSpaces = (num: number): string => {
  const numStr = num.toString()
  const [integerPart, decimalPart] = numStr.split('.')
  const absoluteValue = Math.abs(Number(integerPart)).toString()
  const cleanValue = absoluteValue.replace(/^0+/, '') || '0'

  const formattedInteger = cleanValue
    .split('')
    .reverse()
    .join('')
    .match(/.{1,3}/g)
    ?.join(' ')
    .split('')
    .reverse()
    .join('') || cleanValue

  const sign = num < 0 ? '-' : ''

  return decimalPart
    ? `${sign}${formattedInteger},${decimalPart}`
    : `${sign}${formattedInteger}`
}

//C: Перевірка наявності повторюваного паттерну в десятковій частині
//C: Check for repeating pattern in decimal part
export const hasRepeatingPattern = (decimalPart: string): boolean => {
  if (decimalPart.length < 3) return false

  if (new Set(decimalPart).size === 1) {
    return true
  }

  for (let patternLength = 1; patternLength <= Math.floor(decimalPart.length / 2); patternLength++) {
    const pattern = decimalPart.substring(0, patternLength)
    let isRepeating = true

    for (let i = patternLength; i < decimalPart.length; i += patternLength) {
      const segment = decimalPart.substring(i, i + patternLength)
      if (segment !== pattern.substring(0, segment.length)) {
        isRepeating = false
        break
      }
    }

    if (isRepeating) return true
  }

  return false
}