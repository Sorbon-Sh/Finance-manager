import express, { Express, Request, Response } from "express";
import cors from "cors";

// Создаем Express-приложение
const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
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

app.get("/api/exchange-rates", async (req: Request, res: Response) => {
  try {
    const response = await fetch("https://valuta.tj/parser/echokurs.php");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const ratesArray = Object.values(data);

    res.setHeader("Cache-Control", "s-maxage=3600").json(ratesArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Решение для Vercel
const vercelHandler = (req: Request, res: Response) => app(req, res);
export default vercelHandler;

// Локальный сервер
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
}
