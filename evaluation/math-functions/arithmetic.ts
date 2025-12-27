//C: Ядро математичних обчислень та обробки дробів
//C: Mathematical calculation and fraction processing core
export const Arithmetic = {
  //C: Найбільший спільний дільник (Алгоритм Евкліда)
  //C: Greatest common divisor (Euclidean algorithm)
  gcd: (a: number, b: number): number => {
    a = Math.abs(a)
    b = Math.abs(b)
    while (b) {
      a %= b
      ;[a, b] = [b, a]
    }
    return a
  },

  //C: Найменше спільне кратне
  //C: Least common multiple
  lcm: (a: number, b: number): number => {
    if (a === 0 || b === 0) return 0
    return Math.abs(a * b) / Arithmetic.gcd(a, b)
  },

  //C: Спрощення дробу до найпростішого вигляду з виділенням цілої частини
  //C: Simplify fraction to simplest form with whole part extraction
  simplifyFraction: (numerator: number, denominator: number): string => {
    if (denominator === 0) return 'NaN'
    if (numerator === 0) return '0'

    const common = Arithmetic.gcd(numerator, denominator)
    let n = numerator / common
    let d = denominator / common

    if (d < 0) { n = -n; d = -d }

    const absN = Math.abs(n)
    if (d === 1) return n.toString()

    if (absN >= d) {
      const whole = Math.trunc(n / d)
      const remainder = absN % d
      if (remainder === 0) return whole.toString()

      const sign = (n < 0 && whole === 0) ? "-" : ""
      const wholeDisplay = whole === 0 ? sign : whole.toString()
      return `${wholeDisplay}<sup>${remainder}</sup>/<sub>${d}</sub>`
    }

    return `<sup>${n}</sup>/<sub>${d}</sub>`
  }
}