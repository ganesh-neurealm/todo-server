import express from 'express';

const router = express.Router();
let todos = []; 

router.get('/', (req, res) => {
  res.json(todos);
});

router.post('/', (req, res) => {
  const newTodo = { id: Date.now(), ...req.body };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.map(todo => (todo.id === id ? { ...todo, ...req.body } : todo));
  res.json({ message: 'Updated' });
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== id);
  res.json({ message: 'Deleted' });
});

export default router;
