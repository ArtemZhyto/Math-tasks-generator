//C: Генерація випадкового цілого числа в заданому діапазоні
//C: Generate random integer in specified range
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}