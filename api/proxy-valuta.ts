import type { VercelRequest, VercelResponse } from "@vercel/node";

// Задержка между попытками
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Запрос с попытками (максимум 5)
async function fetchWithRetries(
  url: string,
  maxAttempts: number = 5,
  timeout: number = 5000,
) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);

      if (!response.ok) {
        console.warn(`Попытка ${attempt}: ответ не OK (${response.status})`);
      } else {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          console.log(`✅ Успешно на попытке ${attempt}`);
          return Object.values(data);
        } else {
          console.warn(`Попытка ${attempt}: данные пустые`);
        }
      }
    } catch (err) {
      console.warn(`Попытка ${attempt}: ошибка запроса — ${err.message}`);
    }

    if (attempt < maxAttempts) {
      console.log("⏳ Ждём 10 секунд перед следующей попыткой...");
      await delay(10000);
    }
  }

  throw new Error(`Не удалось получить данные за ${maxAttempts} попыток`);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=3600");

  try {
    const result = await fetchWithRetries(
      "https://valuta.tj/parser/echokurs.php",
    );
    return res.status(200).json(result);
  } catch (err) {
    console.error("❌ Ошибка в proxy-valuta:", err.message);
    return res
      .status(500)
      .json({ error: "Не удалось получить данные после 5 попыток" });
  }
}
