//@ Modules
import { STRING_RESULTS } from '../../constants'

//C: Вилучення числового значення з рядка (ігнорує одиниці виміру)
//C: Extract numeric value from string (ignores measurement units)
export const extractNumericValue = (answer: string): number => {
  //C: Видаляємо HTML-теги для дробів
  //C: Remove HTML tags for fractions
  const cleanAnswer = answer.replace(/<[^>]*>/g, '')

  //C: Шукаємо числову частину (цілі та десяткові числа)
  //C: Look for numeric part (integers and decimals)
  const numericMatch = cleanAnswer.match(/(-?\d+[.,]?\d*)/)
  if (!numericMatch) return NaN

  //C: Заміняємо кому на крапку та видаляємо пробіли
  //C: Replace comma with dot and remove spaces
  const numericPart = numericMatch[0].replace(/\s/g, '').replace(',', '.')
  return Number(numericPart)
}

//C: Перевірка чи є результат нечисловим (строковим)
//C: Check if result is non-numeric (string)
export const isNonNumericResult = (answer: string): boolean => {
  //C: Список індикаторів строкових результатів
  //C: List of string result indicators
  const nonNumericIndicators = STRING_RESULTS

  //C: Видаляємо всі одиниці виміру та пробіли
  //C: Remove all measurement units and spaces
  let cleanAnswer = answer
  nonNumericIndicators.forEach(unit => {
    cleanAnswer = cleanAnswer.replace(unit, '')
  })

  //C: Перевіряємо чи залишилось число
  //C: Check if number remains
  if (cleanAnswer === '') return true

  const numericValue = Number(cleanAnswer.replace(',', '.').replace(/\s/g, ''))
  return isNaN(numericValue)
}