// The ONLY place the backend URL appears in the frontend.
// During the Kuppi we change VITE_API_URL (local -> Docker -> Kubernetes) and nothing else moves.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export { BASE_URL };

async function request(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data?.error) message = data.error;
    } catch {
      // Response had no JSON body; keep the status-based message.
    }
    throw new Error(message);
  }

  // 204 No Content (DELETE) has no body to parse.
  if (response.status === 204) return null;

  return response.json();
}

export const getHealth = () => request('/api/health');

export const getTodos = () => request('/api/todos');

export const createTodo = (title) => request('/api/todos', { method: 'POST', body: { title } });

export const toggleTodo = (id, completed) =>
  request(`/api/todos/${id}`, { method: 'PATCH', body: { completed } });

export const deleteTodo = (id) => request(`/api/todos/${id}`, { method: 'DELETE' });
