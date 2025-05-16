import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=3600");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); // максимум 8 секунд

  try {
    const response = await fetch("https://valuta.tj/parser/echokurs.php", {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // Проверка на корректный ответ и JSON
    const contentType = response.headers.get("content-type") || "";
    if (!response.ok || !contentType.includes("application/json")) {
      throw new Error(`Bad response: ${response.status} — ${contentType}`);
    }

    const data = await response.json();
    const result = Object.values(data);

    return res.status(200).json(result);
  } catch (err) {
    clearTimeout(timeout);
    console.error("Ошибка в proxy-valuta:", err);
    return res
      .status(500)
      .json({ error: err.message || "Не удалось получить данные валют" });
  }
}
