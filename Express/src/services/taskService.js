// In-memory data store for Day 3
// The service layer owns the data and business rules, independent of HTTP req/res.
let tasks = [
  { id: 1, title: 'Learn Express basics', completed: true, createdAt: new Date().toISOString() },
  { id: 2, title: 'Build in-memory CRUD for /tasks', completed: false, createdAt: new Date().toISOString() },
  { id: 3, title: 'Test all endpoints in Postman/Thunder Client', completed: false, createdAt: new Date().toISOString() },
];

let nextId = 4;

/**
 * Fetch tasks with optional filters
 * @param {Object} filters - { completed?: boolean, search?: string }
 */
export const getAllTasks = ({ completed, search } = {}) => {
  let result = [...tasks];

  if (completed !== undefined) {
    result = result.filter((t) => t.completed === completed);
  }

  if (search) {
    const term = search.toLowerCase();
    result = result.filter((t) => t.title.toLowerCase().includes(term));
  }

  return result;
};

/**
 * Find a single task by ID
 * @param {number} id
 * @returns {Object|null}
 */
export const findTaskById = (id) => {
  return tasks.find((t) => t.id === id) || null;
};

/**
 * Create a new task
 * @param {Object} taskData - { title: string, completed?: boolean }
 * @returns {Object}
 */
export const createTask = ({ title, completed = false }) => {
  const newTask = {
    id: nextId++,
    title: title.trim(),
    completed: Boolean(completed),
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  return newTask;
};

/**
 * Update an existing task
 * @param {number} id
 * @param {Object} updates - { title?: string, completed?: boolean }
 * @returns {Object|null}
 */
export const updateTask = (id, updates) => {
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) return null;

  if (updates.title !== undefined) {
    tasks[taskIndex].title = updates.title.trim();
  }

  if (updates.completed !== undefined) {
    tasks[taskIndex].completed = Boolean(updates.completed);
  }

  tasks[taskIndex].updatedAt = new Date().toISOString();
  return tasks[taskIndex];
};

/**
 * Delete a task
 * @param {number} id
 * @returns {Object|null}
 */
export const deleteTask = (id) => {
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) return null;

  const [deletedTask] = tasks.splice(taskIndex, 1);
  return deletedTask;
};
