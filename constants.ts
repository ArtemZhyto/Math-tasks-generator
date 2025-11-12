//C: Список одиниць виміру для спеціальної обробки
//C: List of measurement units for special handling
export const MEASUREMENT_UNITS = [
	'см', 'мм', 'дм', 'м', 'км', 'грн', 'коп', 'г', 'кг',
	'ц', 'т', 'л', 'см^2', 'м^2', 'км^2', 'см^3', 'м^3',
	'км^3', 'хв', 'мс', 'с', 'год', '%'
]

//C: Список строкових результатів (не числових)
//C: List of string results (non-numeric)
export const STRING_RESULTS = [
  '>', '<', '=', 'Перший', 'Другий', 'Рівні', 'Так', 'Ні',
  ...MEASUREMENT_UNITS
]