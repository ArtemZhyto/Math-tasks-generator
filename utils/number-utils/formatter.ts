//C: Розділення тисяч (тільки для цілої частини)
//C: Thousand separators (only for integer part)
export const formatNumberWithSpaces = (num: number): string => {
  const sign = num < 0 ? '-' : ''
  const absoluteNum = Math.abs(num)

  const [integerPart, decimalPart] = absoluteNum.toString().split('.')

  //C: Форматуємо цілу частину з пробілами
  //C: Format integer part with spaces
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  if (decimalPart !== undefined) {
    return `${sign}${formattedInteger},${decimalPart}`
  }

  return `${sign}${formattedInteger}`
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