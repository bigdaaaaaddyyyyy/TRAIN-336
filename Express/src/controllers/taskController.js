import * as taskService from '../services/taskService.js';

/**
 * Controller: Handles HTTP input/output for GET /tasks
 */
export const getTasks = (req, res) => {
  const { completed, search } = req.query;

  // Convert query string "true"/"false" to boolean
  const completedFilter = completed !== undefined ? completed === 'true' : undefined;

  const tasks = taskService.getAllTasks({
    completed: completedFilter,
    search,
  });

  res.status(200).json({
    total: tasks.length,
    data: tasks,
  });
};

/**
 * Controller: Handles HTTP input/output for GET /tasks/:id
 */
export const getTaskById = (req, res) => {
  const taskId = parseInt(req.params.id, 10);

  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'Task ID must be a valid number' });
  }

  const task = taskService.findTaskById(taskId);

  if (!task) {
    return res.status(404).json({ error: `Task with ID ${taskId} not found` });
  }

  res.status(200).json({ data: task });
};

/**
 * Controller: Handles HTTP input/output for POST /tasks
 */
export const createTask = (req, res) => {
  const { title, completed } = req.body;

  // HTTP Request Validation
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'A non-empty string "title" is required.',
    });
  }

  const newTask = taskService.createTask({
    title,
    completed,
  });

  res.status(201).json({
    message: 'Task created successfully',
    data: newTask,
  });
};

/**
 * Controller: Handles HTTP input/output for PUT /tasks/:id
 */
export const updateTask = (req, res) => {
  const taskId = parseInt(req.params.id, 10);

  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'Task ID must be a valid number' });
  }

  const { title, completed } = req.body;

  // HTTP validation
  if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({ error: '"title" must be a non-empty string' });
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: '"completed" must be a boolean (true or false)' });
  }

  const updatedTask = taskService.updateTask(taskId, { title, completed });

  if (!updatedTask) {
    return res.status(404).json({ error: `Task with ID ${taskId} not found` });
  }

  res.status(200).json({
    message: 'Task updated successfully',
    data: updatedTask,
  });
};

/**
 * Controller: Handles HTTP input/output for DELETE /tasks/:id
 */
export const deleteTask = (req, res) => {
  const taskId = parseInt(req.params.id, 10);

  if (isNaN(taskId)) {
    return res.status(400).json({ error: 'Task ID must be a valid number' });
  }

  const deletedTask = taskService.deleteTask(taskId);

  if (!deletedTask) {
    return res.status(404).json({ error: `Task with ID ${taskId} not found` });
  }

  res.status(200).json({
    message: 'Task deleted successfully',
    data: deletedTask,
  });
};
