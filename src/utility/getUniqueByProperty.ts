export function getUniqueByProperty<T>(
  array: T[],
  property: keyof T & string,
): T[] {
  const seen = new Set<T[typeof property]>();
  const result: T[] = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    const value = item[property];

    if (!seen.has(value)) {
      seen.add(value);
      result.push(item);
    }
  }

  return result;
}
