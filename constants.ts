//C: Список одиниць виміру для спеціальної обробки
//C: List of measurement units for special handling
export const MEASUREMENT_UNITS = [
	'см', 'мм', 'дм', 'м', 'км', 'грн', 'коп', 'мг', 'г', 'кг',
	'ц', 'т', 'л', 'см^2', 'м^2', 'км^2', 'см^3', 'м^3',
	'км^3', 'хв', 'мс', 'с', 'год', '%', 'м/с', 'д', 'міс', 'тиж',
	'р', 'м/хв', 'вуз', 'км/год', 'км/с', 'гр', 'га', 'ар'
]

//C: Список строкових результатів (не числових)
//C: List of string results (non-numeric)
export const STRING_RESULTS = [
  '>', '<', '=', 'Перший', 'Другий', 'Рівні', 'Так', 'Ні',
  ...MEASUREMENT_UNITS
]

//C: Список одиниць виміру для зміни на графічні
//C: List of units of measurement to change to graphical units
export const UNITS_TO_SHORT: Record<string, string> = {
  "гр": "°",
  "см^2": "см²",
  "м^2": "м²",
  "км^2": "км²",
  "см^3": "см³",
  "м^3": "м³",
  "км^3": "км³",
  "м/с": "<sup>м</sup>/<sub>с</sub>",
  "м/хв": "<sup>м</sup>/<sub>хв</sub>",
  "км/год": "<sup>км</sup>/<sub>год</sub>",
  "км/с": "<sup>км</sup>/<sub>с</sub>"
}