import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await fetch("https://valuta.tj/parser/echokurs.php");
    const data = await response.json();

    const result = Object.values(data);

    // 🔥 ВАЖНО: выставляем CORS заголовок
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=3600");

    return res.status(200).json(result);
  } catch (err) {
    console.error("Ошибка в proxy-valuta:", err);

    // 🛠 Добавь CORS заголовок даже при ошибке
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
