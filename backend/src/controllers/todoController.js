const store = require('../data/todos');

// GET /api/todos
function getTodos(req, res) {
  res.json(store.getAll());
}

// POST /api/todos  { "title": "Learn Kubernetes" }
function createTodo(req, res) {
  const { title } = req.body || {};

  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: 'A non-empty "title" is required' });
  }

  const todo = store.create(title.trim());
  res.status(201).json(todo);
}

// PATCH /api/todos/:id
// With no body it toggles `completed`. With a body it applies the given fields.
function updateTodo(req, res) {
  const todo = store.findById(Number(req.params.id));
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const { title, completed } = req.body || {};

  if (typeof completed === 'boolean') {
    todo.completed = completed;
  } else if (completed === undefined && title === undefined) {
    todo.completed = !todo.completed;
  }

  if (typeof title === 'string' && title.trim() !== '') {
    todo.title = title.trim();
  }

  res.json(todo);
}

// DELETE /api/todos/:id
function deleteTodo(req, res) {
  const deleted = store.remove(Number(req.params.id));
  if (!deleted) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  res.status(204).send();
}

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };
