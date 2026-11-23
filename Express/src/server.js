import express from 'express';
import 'dotenv/config';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Built-in Middlewares
// express.json() parses incoming JSON request bodies into req.body
app.use(express.json());
// express.urlencoded() parses URL-encoded bodies (form posts)
app.use(express.urlencoded({ extended: true }));

// 2. Request Logger Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Pass control to the next handler
});

// 3. Root / Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Day 3: Express Basics & CRUD API is running!',
    endpoints: {
      'GET /tasks': 'List all tasks (supports ?completed=true and ?search=...)',
      'GET /tasks/:id': 'Get task by ID',
      'POST /tasks': 'Create a new task { "title": "...", "completed": false }',
      'PUT /tasks/:id': 'Update a task { "title": "...", "completed": true }',
      'DELETE /tasks/:id': 'Delete a task by ID',
    },
  });
});

// 4. Mount Task Routes on /tasks
app.use('/tasks', taskRoutes);

// 5. 404 Catch-All Handler (must come AFTER all registered routes)
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`,
  });
});

// 6. Global Error Handler (must take 4 parameters: err, req, res, next)
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

// 7. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Tasks API available at http://localhost:${PORT}/tasks`);
});
