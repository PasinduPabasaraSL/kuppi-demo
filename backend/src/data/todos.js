// In-memory data store for the Kuppi demo.
// Data lives only in memory, so restarting the server resets it back to the seed list.
// This is exactly what makes the Docker / Kubernetes "stateless container" demo interesting later.

const todos = [
  { id: 1, title: 'Learn Git', completed: true },
  { id: 2, title: 'Build Docker image', completed: false },
  { id: 3, title: 'Deploy to Kubernetes', completed: false },
];

let nextId = 4;

function getAll() {
  return todos;
}

function findById(id) {
  return todos.find((todo) => todo.id === id);
}

function create(title) {
  const todo = { id: nextId, title, completed: false };
  nextId += 1;
  todos.push(todo);
  return todo;
}

function remove(id) {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
}

module.exports = { getAll, findById, create, remove };
