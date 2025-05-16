export const isObjectValid = <T extends Record<string, unknown>>(
  obj: T | null | undefined
): boolean => {
  //* Проверка на существование объекта
  if (!obj) return false;

  //* Итерация по ключам объекта
  for (const key in obj) {
    //* Проверяем, что ключ принадлежит объекту
    if (
      obj[key] !== undefined &&
      obj[key] !== null &&
      String(obj[key]).trim() !== ""
    ) {
      continue; //* Если значение валидно, продолжаем
    }
    return false; //* Если хоть одно значение не валидно, возвращаем false
  }

  return true; //* Если все значения валидны, возвращаем true
};
