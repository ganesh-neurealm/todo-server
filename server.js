const express = require('express');
const cors = require('cors');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// File path for db.json
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

// Initialize DB with default data
async function initDB() {
  await db.read();
  if (!db.data) {
    db.data = { todos: [] }; // ✅ Set default data structure
    await db.write();
  }
}
initDB();

// Routes
app.get('/todos', async (req, res) => {
  await db.read();
  res.json(db.data.todos);
});

app.post('/todos', async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });

  await db.read();
  const newTodo = { id: Date.now(), title };
  db.data.todos.push(newTodo);
  await db.write();

  res.status(201).json(newTodo);
});

app.put('/todos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { title } = req.body;

  await db.read();
  const todo = db.data.todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ message: 'Todo not found' });

  todo.title = title;
  await db.write();

  res.json(todo);
});

app.delete('/todos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  await db.read();
  const before = db.data.todos.length;
  db.data.todos = db.data.todos.filter(t => t.id !== id);
  if (before === db.data.todos.length) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  await db.write();
  res.json({ message: 'Deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
