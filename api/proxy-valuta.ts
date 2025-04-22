import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await fetch("https://valuta.tj/parser/echokurs.php");

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch" });
    }

    const data = await response.json();

    // Преобразуем в массив
    const result = Object.values(data);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
