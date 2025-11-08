//C: Інтерфейс конфігурації генератора завдань
//C: Task generator configuration interface
export interface IGeneratorConfig {
  testID: string
  template: string
  condition: string
  variables: Record<string, IVariableConfig>
  constraints: IConstraints
}

//C: Конфігурація змінних для генерації
//C: Variables configuration for generation
export interface IVariableConfig {
  range?: [number, number]
  values?: number[]
  exclude?: number[]
}

//C: Обмеження для результатів генерації
//C: Constraints for generation results
export interface IConstraints {
  minResult?: number
  maxResult?: number
  integerResult?: boolean
  canBeNegative?: boolean
  canGenerateWrongAnswer?: boolean
}

//C: Інтерфейс згенерованого завдання
//C: Generated task interface
export interface IGeneratedTask {
  testID: string
  condition: string
  answers: string[]
  correctAnswer: string
}

//C: Тип математичної функції для генератора
//C: Math function type for generator
export type MathFunction = (
  ...args: any[]
) => string | number | boolean