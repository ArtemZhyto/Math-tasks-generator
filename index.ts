//@ Modules
import { generateTask } from './core/generator'
import { IGeneratorConfig, IGeneratedTask } from './types'

//C: Головна функція-обгортка для генератора завдань
//C: Main wrapper function for task generator
const __GENERATOR = (config: IGeneratorConfig): IGeneratedTask => {
  return generateTask(config)
}

//C: Експорт типів TypeScript для зовнішнього використання
//C: Export TypeScript types for external usage
export type { IGeneratorConfig, IGeneratedTask, IConstraints, IVariableConfig } from './types'

//C: Експорт за замовчуванням головної функції генератора
//C: Default export of main generator function
export default __GENERATOR