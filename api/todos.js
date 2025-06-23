import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();
const dbPath = path.resolve('db.json');

// Helper to read/write DB
const readDB = async () => JSON.parse(await fs.readFile(dbPath, 'utf-8'));
const writeDB = async (data) => await fs.writeFile(dbPath, JSON.stringify(data, null, 2));

router.get('/', async (req, res) => {
  const db = await readDB();
  res.json(db.todos);
});

router.post('/', async (req, res) => {
  const db = await readDB();
  const newTodo = { id: Date.now(), ...req.body };
  db.todos.push(newTodo);
  await writeDB(db);
  res.status(201).json(newTodo);
});

router.put('/:id', async (req, res) => {
  const db = await readDB();
  const id = parseInt(req.params.id);
  db.todos = db.todos.map(t => t.id === id ? { ...t, ...req.body } : t);
  await writeDB(db);
  res.json({ message: 'Updated' });
});

router.delete('/:id', async (req, res) => {
  const db = await readDB();
  const id = parseInt(req.params.id);
  db.todos = db.todos.filter(t => t.id !== id);
  await writeDB(db);
  res.json({ message: 'Deleted' });
});

export default router;
