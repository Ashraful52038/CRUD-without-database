const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 6000;

// Middleware for parsing JSON bodies
app.use(express.json());

// creating a new task
app.post('/tasks', (req, res) => {
  const { name, details } = req.body;
  if (!name || !details) {
    return res.status(400).json({ error: 'Name and details are required' });
  }

  const tasks = JSON.parse(fs.readFileSync('./tasks.json'));
  const newTask = { id: tasks.length + 1, name, details };
  tasks.push(newTask);
  fs.writeFileSync('./tasks.json', JSON.stringify(tasks));
  res.json(newTask);
});

// updating a task
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { name, details } = req.body;
  if (!name || !details) {
    return res.status(400).json({ error: 'Name and details are required' });
  }

  const tasks = JSON.parse(fs.readFileSync('./tasks.json'));
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks[taskIndex] = { id: taskId, name, details };
  fs.writeFileSync('./tasks.json', JSON.stringify(tasks));
  res.json(tasks[taskIndex]);
});

//  deleting a task
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const tasks = JSON.parse(fs.readFileSync('tasks.json'));
  const updatedTasks = tasks.filter(task => task.id !== taskId);
  fs.writeFileSync('./tasks.json', JSON.stringify(updatedTasks));
  res.json({ message: 'Task deleted successfully' });
});

// get all tasks
app.get('/tasks', (req, res) => {
  const tasks = JSON.parse(fs.readFileSync('./tasks.json'));
  res.json(tasks);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
