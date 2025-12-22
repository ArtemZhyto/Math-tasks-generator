//C: Допоміжне форматування для варіантів відповідей
//C: Helper formatting for answer options

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

//C: Форматування числового значення з урахуванням обмежень
//C: Format numeric value considering constraints
export const formatNumericValue = (value: number, integerResult?: boolean): string => {
  if (integerResult) {
    value = Math.round(value)
  }

  const sign = value < 0 ? '-' : ''
  const absoluteValue = Math.abs(value)

  let formattedValue: string

  if (Number.isInteger(absoluteValue)) {
    formattedValue = formatNumberWithSpaces(absoluteValue)
  } else {
    const [integerPart, decimalPart] = absoluteValue.toString().split('.')
    const formattedInteger = formatNumberWithSpaces(Number(integerPart))
    formattedValue = `${formattedInteger},${decimalPart}`
  }

  return sign + formattedValue
}