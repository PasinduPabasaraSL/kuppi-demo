const express = require('express');
const cors = require('cors');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS lets the Vite dev server (http://localhost:5173) call this API on a different port.
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'se-kuppi-backend' });
});

app.use('/api/todos', todoRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

app.listen(PORT, () => {
  console.log(`se-kuppi-backend listening on http://localhost:${PORT}`);
});
