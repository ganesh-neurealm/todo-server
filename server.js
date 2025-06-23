const express = require('express');
const cors = require('cors');
const { Low, JSONFile } = require('lowdb');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Use CORS to allow cross-origin requests (optional, but usually needed)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Setup LowDB to read/write JSON file
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

// Initialize DB with default data if empty
async function initDB() {
  await db.read();
  db.data = db.data || { todos: [] };
  await db.write();
}
initDB();

// GET /todos - get all todos
app.get('/todos', async (req, res) => {
  await db.read();
  res.json(db.data.todos);
});

// POST /todos - add a new todo
app.post('/todos', async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }
  await db.read();
  const newTodo = {
    id: Date.now(),
    title,
  };
  db.data.todos.push(newTodo);
  await db.write();
  res.status(201).json(newTodo);
});

// PUT /todos/:id - update a todo by id
app.put('/todos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  await db.read();
  const todo = db.data.todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  todo.title = title;
  await db.write();
  res.json(todo);
});

// DELETE /todos/:id - delete a todo by id
app.delete('/todos/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  await db.read();
  const todosBefore = db.data.todos.length;
  db.data.todos = db.data.todos.filter(t => t.id !== id);
  
  if (todosBefore === db.data.todos.length) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  await db.write();
  res.json({ message: 'Deleted' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
