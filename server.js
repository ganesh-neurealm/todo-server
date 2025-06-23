import express from 'express';
import cors from 'cors';
import todosRouter from './api/todos.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/todos', todosRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
