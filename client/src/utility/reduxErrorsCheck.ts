// Утилита для безопасного получения сообщения об ошибке
export const getErrorMessage = (error: unknown): string => {
  if (typeof error !== "object" || error === null) return "Unknown error";

  // Проверка для FetchBaseQueryError (ошибки от сервера)
  if ("status" in error && "data" in error) {
    const serverError = error.data || undefined;
    if (typeof serverError === "string") return serverError;
    if (typeof serverError === "object" && "message" in serverError) {
      return String(serverError.message);
    }
  }

  // Проверка для SerializedError (клиентские ошибки)
  if ("message" in error) return String(error.message);

  return "Unknown error";
};
