const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.get('/todos', (req, res) => {
  res.status(200).json(router.db.get('todos').value());
});

server.post('/todos', (req, res) => {
  const todos = router.db.get('todos');
  const newTodo = { id: Date.now(), ...req.body };
  todos.push(newTodo).write();
  res.status(201).json(newTodo);
});

server.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updated = router.db.get('todos').find({ id }).assign(req.body).write();
  res.status(200).json(updated);
});

server.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  router.db.get('todos').remove({ id }).write();
  res.status(200).json({ message: 'Deleted' });
});

server.use(router);
server.listen(8000, () => {
  console.log('JSON Server is running');
});
