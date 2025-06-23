import express from 'express';

const router = express.Router();
let todos: any[] = [];

router.get('/', (req, res) => {
  res.json(todos);
});

router.post('/', (req, res) => {
  const timestamp = new Date().toISOString();
  const newTodo = {
    id: Date.now(),
    ...req.body,
    createdDate: timestamp,
    updatedDate: timestamp,
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const timestamp = new Date().toISOString();

  let updated = false;
  todos = todos.map(todo => {
    if (todo.id === id) {
      updated = true;
      return {
        ...todo,
        ...req.body,
        updatedDate: timestamp,
      };
    }
    return todo;
  });

  if (updated) {
    res.json({ message: 'Updated' });
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== id);
  res.json({ message: 'Deleted', todos });
});

export default router;
