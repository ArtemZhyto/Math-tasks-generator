//@ Modules
import { IConstraints } from '../../types'
import { generateWrongNumericValue } from './numeric-strategy'
import { formatNumericValue } from './formatter'

//C: Генерація строкової неправильної відповіді
//C: Generate string wrong answer
export const generateStringWrongAnswer = (correctAnswer: string, constraints: IConstraints): string => {
  const oppositeAnswers: Record<string, string> = {
    'Так': 'Ні',
    'Ні': 'Так',
    '>': '<',
    '<': '>',
    '=': Math.random() > 0.5 ? '>' : '<'
  }

  if (oppositeAnswers[correctAnswer]) {
    return oppositeAnswers[correctAnswer]
  }

  const numericString = correctAnswer.replace(/\s/g, '')
  const numericAnswer = Number(numericString.replace(',', '.'))

  if (!isNaN(numericAnswer)) {
    const wrongValue = generateWrongNumericValue(numericAnswer, constraints, 50)
    return formatNumericValue(wrongValue, constraints.integerResult)
  }

  const options = ['1', '2', '3', '4', '5'].filter(opt => opt !== correctAnswer)
  return options[Math.floor(Math.random() * options.length)]
}