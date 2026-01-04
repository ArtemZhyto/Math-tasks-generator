//@ Modules
import { MEASUREMENT_UNITS, STRING_RESULTS } from '../../constants'

//C: Перевірка чи є рядок повністю строковим результатом
//C: Check if string is completely string result
export const isCompletelyStringResult = (str: string): boolean => {
	const isAlgebraic = /[a-zA-Z]/.test(str) && (str.includes('+') || str.includes('-') || str.includes('*'))

  if (isAlgebraic) return true

  let cleanStr = str

  MEASUREMENT_UNITS.forEach(unit => {
    cleanStr = cleanStr.replace(unit, '')
  })

  const hasDigits = /\d/.test(cleanStr)

  return !hasDigits && STRING_RESULTS.some(result => str.includes(result))
}

//C: Виділення числової частини та одиниць виміру
//C: Extract numeric part and units of measurement
export const extractNumericAndUnits = (str: string): { numericPart: string; units: string } => {
  const numericMatch = str.match(/(-?\d+[.,]?\d*)/)

  if (!numericMatch) {
    return { numericPart: str, units: '' }
  }

  const numericPart = numericMatch[0]
  const units = str.replace(numericPart, '').trim()

  return { numericPart, units }
}