import type { VercelRequest, VercelResponse } from "@vercel/node";

// Функция с таймаутом
function fetchWithTimeout(url: string, timeout: number): Promise<Response> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Request timed out")), timeout);
    fetch(url)
      .then(response => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// Повтор запроса с ограничением попыток
async function fetchWithRetry(url: string, attempts: number = 3, timeout: number = 5000) {
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetchWithTimeout(url, timeout);
      const data = await response.json();

      if (data && Object.keys(data).length > 0) {
        return Object.values(data);
      }
    } catch (err) {
      console.warn(`Попытка ${i + 1} не удалась:`, err.message);
      if (i < attempts - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // задержка между попытками
      }
    }
  }
  throw new Error("Не удалось получить данные после нескольких попыток");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=3600");

  try {
    const result = await fetchWithRetry("https://valuta.tj/parser/echokurs.php");

    return res.status(200).json(result);
  } catch (err) {
    console.error("Ошибка в proxy-valuta:", err.message);
    return res.status(500).json({ error: "Ошибка при получении данных с valuta.tj" });
  }
}
