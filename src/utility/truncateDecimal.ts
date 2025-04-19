export const truncateDecimal = (num: number): string => {
  const suffixes = [
    { suffix: "млрд", divisor: 1e9 },
    { suffix: "млн", divisor: 1e6 },
    { suffix: "тыс", divisor: 1e3 },
    { suffix: "", divisor: 1 },
  ];

  const found = suffixes.find(({ divisor }) => Math.abs(num) >= divisor);
  const { suffix, divisor: selectedDivisor } = found || {
    suffix: "",
    divisor: 1,
  };
  const divided = num / selectedDivisor;

  const formatted = divided.toLocaleString("ru-RU", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });

  return suffix ? `${formatted} ${suffix}` : formatted;
};
