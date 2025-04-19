// server.ts
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

// CORS с явными заголовками
app.use(cors({
  origin: [
    /\.vercel\.app$/,
    /localhost/
  ],
  methods: ['GET', 'OPTIONS']
}));

// Обязательный хелсчек
app.get('/', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Основной эндпоинт
app.get('/exchange-rates', async (req, res) => {
  try {
    const response = await fetch('https://valuta.tj/parser/echokurs.php');
    const data = await response.json();
    res.json(Object.values(data));
  } catch () {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Обработка OPTIONS
app.options('*', (req, res) => {
  res.status(200).end();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
