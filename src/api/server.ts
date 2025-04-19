import express, { Express, Request, Response } from "express";
import cors from "cors"; // Добавьте cors
const app: Express = express();
const port = 3001;

// Добавьте middleware
app.use(cors());
// Добавьте запуск сервера (это отсутствовало)
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
app.get("/exchange-rates", async (req: Request, res: Response) => {
  try {
    const url = "https://valuta.tj/parser/echokurs.php";
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.text();

    const data = JSON.parse(rawData);

    // Преобразуем объект в массив
    const ratesArray = Object.values(data);

    if (!Array.isArray(ratesArray)) {
      throw new Error("Response is not an array");
    }

    res.json(ratesArray); // Возвращаем массив курсов
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error" });
  }
});
