// Copyright 2026 ArtemZhyto

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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