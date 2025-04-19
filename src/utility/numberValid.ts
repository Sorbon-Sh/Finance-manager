export const numberValid = (value: string) => {
  // Только цифры и одна точка
  if (!/^[\d.]+$/.test(value)) {
    return "Разрешены только цифры и точка";
  }

  const dots = (value.match(/\./g) || []).length;
  if (dots > 1) {
    return "Можно использовать только одну точку";
  }

  const parts = value.split(".");

  if (parts[0].length > 6) {
    return "Максимум 6 цифр до точки";
  }

  if (parts[1] && parts[1].length > 13) {
    return "Максимум 13 цифры после точки";
  }

  const number = parseFloat(value);
  if (isNaN(number)) {
    return "Введите корректное число";
  }

  if (number < 0) {
    return "Число не может быть отрицательным";
  }
};
