import express, { Express, Request, Response } from "express";
import { VercelRequest, VercelResponse } from "@vercel/node";
import cors from "cors";

// Создаем Express-приложение
const app: Express = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: ["https://fin-manager-eta.vercel.app", "http://localhost:3000"],
    methods: ["GET", "OPTIONS"],
  }),
);

// Роуты
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

// app.get("/api/exchange-rates", async (req: Request, res: Response) => {
//   try {
//     const response = await fetch("https://valuta.tj/parser/echokurs.php");
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//     const data = await response.json();
//     const ratesArray = Object.values(data);

//     res.setHeader("Cache-Control", "s-maxage=3600").json(ratesArray);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const apiResponse = await fetch("https://valuta.tj/parser/echokurs.php");

    if (!apiResponse.ok) {
      return res
        .status(apiResponse.status)
        .json({ error: "Upstream API error" });
    }

    const data = await apiResponse.json();

    return res
      .setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate")
      .status(200)
      .json(Object.values(data));
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Локальный сервер
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
}
