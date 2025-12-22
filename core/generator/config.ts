//@ Modules
import { IGeneratorConfig } from '../../types'

//C: Валідація конфігурації генератора
//C: Validate generator configuration
export const validateConfig = (config: IGeneratorConfig): void => {
  if (!config.variables || Object.keys(config.variables).length === 0) {
    throw new Error('Variables configuration is empty')
  }
}