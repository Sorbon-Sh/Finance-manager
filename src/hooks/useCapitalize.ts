export const useCapitalize = () => {
  const toLowerCase = (word: string) => {
    return word.charAt(0).toLowerCase() + word.substring(1);
  };

  const toUpperCase = (word: string) => {
    return word.charAt(0).toUpperCase() + word.substring(1);
  };

  return { toLowerCase, toUpperCase };
};
