<div align="center">
 <h1>Math Task Generator / Генератор Математичних Завдань</h1>  
</div>

<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/🧮-Mathematics-blue" alt="Mathematics">
</div>

<br>

<div align="center">
  <a href="#math-task-generator" style="margin: 0 10px;">
    <img src="https://img.shields.io/badge/English-0052CC?style=for-the-badge&logo=google-translate" alt="English">
  </a>
  <a href="#генератор-математичних-завдань" style="margin: 0 10px;">
    <img src="https://img.shields.io/badge/Українська-0057B8?style=for-the-badge&logo=google-translate" alt="Українська">
  </a>
</div>

---

## Table of Contents / Зміст  

### English  
1. [Project Description](#project-description)  
2. [Features](#features)  
3. [How to Use](#how-to-use)  
4. [Configuration Object](#configuration-object)  
5. [Supporting the Project](#supporting-the-project)  
6. [Supporters Hall of Fame](#💎-supporters-hall-of-fame)
7. [Created & Maintained by](#author-section)

### Українська  
1. [Опис проекту](#опис-проекту)  
2. [Можливості](#можливості)  
3. [Як використовувати](#як-використовувати)  
4. [Об’єкт конфігурації](#обєкт-конфігурації)  
5. [Підтримка проекту](#підтримка-проекту)  
6. [Зала слави меценатів](#💎-зала-слави-меценатів)  
7. [Автор та розробник](#author-section-ua)

---

## Math Task Generator  

### Project Description  
A universal generator of mathematical problems with automatic answer generation. Generates problems for calculating perimeters, arithmetic operations, and more. Includes validation and customizable constraints.

### Features  
- Generates math tasks with **correct answers**  
- Supports **variables and constraints**  
- Auto-generates **multiple-choice options**  
- Handles **units of measurement** (cm, mm, etc.)  
- Works with **fractions, integers, and decimals**  
- Configurable **number ranges** and validation rules  

### How to Use  
Pass a config object to `generateTask()`:  

```javascript
const config = {
  condition: "Calculate the perimeter of a rectangle with sides @A cm and @B cm",
  template: "concat(multiply(2, sum(@A, @B)), ' см')",
  variables: {
    A: { range: [5, 12] },
    B: { range: [8, 15] }
  },
  constraints: {
    canBeNegative: false,
    integerResult: true,
    canGenerateWrongAnswer: true
  }
};

const task = generateTask(config);
```

#### Example Output:  
```javascript
{
  condition: "Calculate the perimeter of a rectangle with sides 7 cm and 10 cm",
  answers: ["34 см", "17 см", "24 см", "70 см"],
  correctAnswer: "34 см"
}
```

### Configuration Object  
| Field         | Type             | Description                                                                 |
|---------------|------------------|-----------------------------------------------------------------------------|
| `condition`   | string           | Problem text with variables (e.g., `@A`, `@B`)                              |
| `template`    | string           | Math expression using [supported functions](#supported-functions).          |
| `variables`   | Object           | Range/value definitions for variables (`range: [min,max]` or `values: [...]`). |
| `constraints` | Object           | Rules for answers (`minResult`, `maxResult`, `integerResult`, etc.).        |

#### Supported Functions  
- Arithmetic: `sum`, `multiply`, `minus`, `divide`, `modulus`  
- Fractions: `fraction`, `fractionAdd`, `toDecimal`  
- Comparisons: `greater`, `less`, `equal`  
- Utilities: `concat`, `round`, `sqrt`  

Full list: [`math-functions.ts`](#math-functions-library).  

## Supporting the Project

If this tool helps you in your work or studies, consider supporting its development:

<div align="center">
  <a href="https://send.monobank.ua/jar/8HQAch1y6E" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Support_Development-Monobank-%2300B2FF?style=for-the-badge&logo=monobank" alt="Support Development" height="50" style="border-radius: 8px;">
  </a>
</div>

_Your support helps improve and maintain this generator!_

## 💎 Supporters Hall of Fame

**We appreciate every contribution!** 🎉

- 🥇 **[Your name could be here!](#supporting-the-project)**

*Join our supporters family!*

<div align="center">

<h2 id="author-section">🎯 2025 • Artem Zhyto</h2>

**Math Task Generator**

`📚 Education` `⚡ Open Source` `💙 Ukraine`

<div align="center">
  <a href="https://github.com/ArtemZhyto" target="_blank" style="text-decoration: none; margin: 0 10px;">
    <img src="https://img.shields.io/badge/👨💻_Artem_Zhyto-Profile-blue?style=for-the-badge&logo=github" alt="Artem Zhyto Profile" height="40">
  </a>
  <a href="https://github.com/ArtemZhyto?tab=repositories" target="_blank" style="text-decoration: none; margin: 0 10px;">
    <img src="https://img.shields.io/badge/📂_All_Projects-Click_Here-green?style=for-the-badge" alt="View All Projects" height="40">
  </a>
</div>

---

*Empowering educators worldwide*  

</div>

---

## Генератор Математичних Завдань  

### Опис проекту  
Універсальний генератор математичних задач із автоматичним підбором відповідей. Генерує завдання на обчислення периметрів, арифметичні дії тощо. Має вбудовану перевірку обмежень.  

### Можливості  
- Генерує задачі з **правильними відповідями**  
- Підтримує **змінні та обмеження**  
- Автоматично створює **варіанти вибору**  
- Працює з **одиницями виміру** (см, мм, грн)  
- Обробляє **дроби, цілі та десяткові числа**  
- Налаштовувані **діапазони чисел**  

### Як використовувати  
Передайте об’єкт конфігурації у `generateTask()`:  

```javascript
const config = {
  condition: "Обчисліть периметр прямокутника зі сторонами @A см і @B см",
  template: "concat(multiply(2, sum(@A, @B)), ' см')",
  variables: {
    A: { range: [5, 12] },
    B: { range: [8, 15] }
  },
  constraints: {
    canBeNegative: false,
    integerResult: true,
    canGenerateWrongAnswer: true
  }
};

const task = generateTask(config);
```

#### Приклад результату:  
```javascript
{
  condition: "Обчисліть периметр прямокутника зі сторонами 7 см і 10 см",
  answers: ["34 см", "17 см", "24 см", "70 см"],
  correctAnswer: "34 см"
}
```

### Об’єкт конфігурації  
| Поле          | Тип              | Опис                                                                        |
|---------------|------------------|-----------------------------------------------------------------------------|
| `condition`   | string           | Текст задачі із змінними (напр., `@A`, `@B`).                               |
| `template`    | string           | Математичний вираз зі [списком функцій](#підтримувані-функції).             |
| `variables`   | Object           | Діапазони/значення змінних (`range: [min,max]` або `values: [...]`).        |
| `constraints` | Object           | Обмеження (`minResult`, `maxResult`, `integerResult` тощо).                 |

#### Підтримувані функції  
- Арифметика: `sum`, `multiply`, `minus`, `divide`, `modulus`  
- Дроби: `fraction`, `fractionAdd`, `toDecimal`  
- Порівняння: `greater`, `less`, `equal`  
- Додатково: `concat`, `round`, `sqrt`  

Повний список: [`math-functions.ts`](#бібліотека-математичних-функцій).  

### Підтримка проекту
Якщо цей генератор корисний у вашій роботі чи навчанні, ви можете підтримати його розвиток:

<div align="center">
  <a href="https://send.monobank.ua/jar/8HQAch1y6E" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Підтримати_розробку-Monobank-%2300B2FF?style=for-the-badge&logo=monobank" alt="Підтримати розробку" height="50" style="border-radius: 8px;">
  </a>
</div>

_Ваша підтримка допомагає покращувати та підтримувати цей проект!_

## 💎 Зала слави меценатів

**Цінуємо кожен внесок!** 🎉

- 🥇 **[Ваше ім'я може бути тут!](#підтримка-проекту)**

*Приєднуйтесь до родини меценатів!*

<div align="center">

<h2 id="author-section-ua">🎯 2025 • Artem Zhyto</h2>

**Генератор Математичних Завдань**

`📚 Освіта` `⚡ Відкритий код`

<div align="center">
  <a href="https://github.com/ArtemZhyto" target="_blank" style="text-decoration: none; margin: 0 10px;">
    <img src="https://img.shields.io/badge/👨💻_Artem_Zhyto-Профіль-blue?style=for-the-badge&logo=github" alt="Artem Zhyto Профіль" height="40">
  </a>
  <a href="https://github.com/ArtemZhyto?tab=repositories" target="_blank" style="text-decoration: none; margin: 0 10px;">
    <img src="https://img.shields.io/badge/📂_Всі_проекти-Переглянути-green?style=for-the-badge" alt="Всі проекти" height="40">
  </a>
</div>

---

*Надаємо можливості вчителям у всьому світі*

</div>