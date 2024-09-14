import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Импортируем для преобразования URL в путь
import cors from 'cors';

// Определяем текущий путь к директории (аналог __dirname в CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Разрешаем CORS для всех запросов
app.use(cors());

// Middleware для работы с JSON
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Маршрут для отдачи данных
app.get('/api/get-charts', (req, res) => {
  // Используем __dirname для указания правильного пути к файлу
  const filePath = path.join(__dirname, 'data', 'charts.json');
  
  // Логируем путь, чтобы убедиться, что он корректный
  console.log('Attempting to read file from:', filePath);

  // Читаем файл charts.json
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err); // Логируем ошибку, если чтение не удалось
      return res.status(500).send({ error: 'Failed to load data' });
    }

    // Отправляем данные клиенту
    try {
      const jsonData = JSON.parse(data);
      res.send(jsonData);
    } catch (parseErr) {
      console.error('Error parsing JSON:', parseErr); // Логируем ошибку парсинга JSON
      res.status(500).send({ error: 'Failed to parse JSON' });
    }
  });
});

// Маршрут для сохранения данных
app.post('/api/save-charts', (req, res) => {
  console.log('Received data:', req.body); // Проверка полученных данных
  const updatedData = req.body;

  // Используем __dirname для указания правильного пути к файлу
  const filePath = path.join(__dirname, 'data', 'charts.json');

  // Пишем данные в файл
  fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), (err) => {
    if (err) {
      console.error('Error writing to file:', err); // Логирование ошибки
      return res.status(500).send({ error: 'Failed to save data' });
    }
    res.send({ success: true, message: 'Data saved successfully' });
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
