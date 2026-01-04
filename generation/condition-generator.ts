//C: Генератор тексту умов завдань
//C: Замінює змінні у шаблоні умови на реальні значення
//C: Формує фінальний текст завдання для користувача
//C: Працює з шаблонами що містять змінні @A, @B тощо

//C: Task condition text generator
//C: Replaces variables in condition template with actual values
//C: Forms final task text for user
//C: Works with templates containing @A, @B etc. variables



//@ Modules
import { logger } from '../utils/logger'
import { formatNumberWithSpaces } from '../utils/number-utils'

//C: Генерація тексту умови завдання шляхом підстановки значень змінних
//C: Generate task condition text by substituting variable values
export const generateCondition = (
  condition: string,
  variables: Record<string, number>
): string => {
  logger.info('CONDITION', 'Генерація умови:', condition)

  let result = condition
	const varNames = Object.keys(variables).sort((a, b) => b.length - a.length)

  //C: Заміна всіх входжень змінних (@A, @B тощо) на їх числові значення
  //C: Replace all variable occurrences (@A, @B etc.) with their numeric values
  varNames.forEach((varName) => {
    const value = variables[varName]

    const isPartOfFraction = new RegExp(`[.,]@${varName}`).test(condition)

    let formattedValue: string

    if (isPartOfFraction) {
      formattedValue = value.toString()
    } else {
      formattedValue = formatNumberWithSpaces(value)
    }

    result = result.replace(new RegExp(`@${varName}`, 'g'), formattedValue)
  })

	result = result.replace(/(\d)\.(\d)/g, '$1,$2')

  logger.info('CONDITION', 'Сгенерована умова:', result)
  return result
}