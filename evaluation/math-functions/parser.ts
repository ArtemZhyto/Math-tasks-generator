//C: Конвертація десяткового числа у звичайний дріб (ланцюгові дроби)
//C: Convert decimal number to simple fraction (continued fractions)
export const convertDecimalToFraction = (decimal: number) => {
  const tolerance = 1.0E-9
  let h1 = 1, h2 = 0, k1 = 0, k2 = 1
  let b = decimal
  do {
    const a = Math.floor(b)
    ;[h1, h2] = [a * h1 + h2, h1]
    ;[k1, k2] = [a * k1 + k2, k1]
    b = 1 / (b - a)
  } while (Math.abs(decimal - h1 / k1) > decimal * tolerance)

  return { numerator: h1, denominator: k1 }
}

//C: Парсинг будь-якого формату числа або дробу у чисельник та знаменник
//C: Parsing any number or fraction format into numerator and denominator
export const parseFraction = (fraction: string): { numerator: number; denominator: number } => {
  const clean = fraction.trim().replace(',', '.')

  //C: Обробка звичайних чисел та десяткових дробів
  //C: Handling regular numbers and decimal fractions
  if (!isNaN(Number(clean))) {
    return convertDecimalToFraction(Number(clean))
  }

  //C: Обробка HTML форматів дробів (простих та мішаних)
  //C: Handling HTML fraction formats (simple and mixed)
  const htmlMatch = clean.match(/(-?\d+)?\s*<sup>(-?\d+)<\/sup>\/<sub>(\d+)<\/sub>/)
  if (htmlMatch) {
    const whole = parseInt(htmlMatch[1] || "0")
    const num = parseInt(htmlMatch[2])
    const den = parseInt(htmlMatch[3])
    return {
      numerator: whole * den + (whole < 0 ? -num : num),
      denominator: den
    }
  }

  throw new Error(`Invalid fraction: ${fraction}`)
}