//C: Ядро тригонометричних обчислень
//C: Trigonometric calculation core
export const Trigonometry = {
  //C: Переведення градусів у радіани (оскільки Math працює з радіанами)
  //C: Conversion of degrees to radians
  toRadians: (d: number): number => (d * Math.PI) / 180,

  sin: (degrees: number): number => {
    const res = Math.sin(Trigonometry.toRadians(degrees))

		return Math.abs(res) < 1e-10 ? 0 : res
  },

  cos: (degrees: number): number => {
    const res = Math.cos(Trigonometry.toRadians(degrees))

		return Math.abs(res) < 1e-10 ? 0 : res
  },

  tg: (degrees: number): number => {
    const c = Trigonometry.cos(degrees)

		if (c === 0) return NaN

		return Trigonometry.sin(degrees) / c
  },

  ctg: (degrees: number): number => {
    const s = Trigonometry.sin(degrees)

		if (s === 0) return NaN

		return Trigonometry.cos(degrees) / s
  }
}