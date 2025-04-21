import { VercelRequest, VercelResponse } from "@vercel/node";

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const response = await fetch("https://valuta.tj/parser/echokurs.php");

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch rates" });
    }

    const data = await response.json();
    const rates = Object.values(data);

    res
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate")
      .status(200)
      .json(rates);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
