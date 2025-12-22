//C: Ядро математичних обчислень
//C: Mathematical calculation core
export const Arithmetic = {
  //C: Найбільший спільний дільник
  //C: Greatest common divisor
  gcd: (a: number, b: number): number => {
    a = Math.abs(a)
    b = Math.abs(b)
    return b === 0 ? a : Arithmetic.gcd(b, a % b)
  },

  //C: Найменше спільне кратне
  //C: Least common multiple
  lcm: (a: number, b: number): number => {
    return Math.abs(a * b) / Arithmetic.gcd(a, b)
  },

  //C: Спрощення дробу до найпростішого вигляду
  //C: Simplify fraction to simplest form
  simplifyFraction: (numerator: number, denominator: number): string => {
    const gcdValue = Arithmetic.gcd(numerator, denominator)
    const simpleNum = numerator / gcdValue
    const simpleDen = denominator / gcdValue

    if (simpleDen === 1) return simpleNum.toString()
    if (simpleNum === 0) return "0"

    if (Math.abs(simpleNum) > Math.abs(simpleDen)) {
      const whole = Math.trunc(simpleNum / simpleDen)
      const remainder = Math.abs(simpleNum % simpleDen)
      if (remainder === 0) return whole.toString()
      return `${whole}<sup>${remainder}</sup>/<sub>${simpleDen}</sub>`
    }

    return `<sup>${simpleNum}</sup>/<sub>${simpleDen}</sub>`
  }
}