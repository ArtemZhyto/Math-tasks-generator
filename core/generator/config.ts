//@ Modules
import { IGeneratorConfig } from '../../types'

//C: Валідація конфігурації генератора
//C: Validate generator configuration
export const validateConfig = (config: IGeneratorConfig): void => {
  if (!config.variables || Object.keys(config.variables).length === 0) {
    throw new Error('Variables configuration is empty')
  }

  if (!config.template?.trim()) {
    throw new Error('Template is required')
  }

  if (!config.condition?.trim()) {
    throw new Error('Condition is required')
  }

  if (!config.testID?.trim()) {
    throw new Error('TestID is required')
  }

  if (config.constraints.minResult !== undefined &&
      config.constraints.maxResult !== undefined &&
      config.constraints.minResult > config.constraints.maxResult) {
    throw new Error('minResult cannot be greater than maxResult')
  }
}