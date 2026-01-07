// IMPORTS AND CONFIGURATION


// Prisma client for database access
const { PrismaClient } = require('@prisma/client');

// middleware to allow external requests (frontend)
const cors = require('cors');

// web framework
const express = require('express');

// Prisma instance
const prisma = new PrismaClient();

// server instance
const app = express();




// MIDDLEWARES


// allows requests from other domains
app.use(cors());

// allows working with JSON in request bodies
app.use(express.json());




// STATUS ROUTES


// API health check route
app.get('/health', (req, res) => {
  res.send('API is running');
});




// TASK CREATION 


// creates a new task
app.post('/tasks', async (req, res) => {
  const { title, notes } = req.body;

  // basic validation
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  // creates the task in the database
  const newTask = await prisma.task.create({
    data: {
      title,
      notes,
    },
  });

  res.status(201).json(newTask);
});




// TASK LOADING 


// fetches all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});




// TASK DELETING 


// deletes a task by id
app.delete('/tasks/:id', async (req, res) => {
  const id = Number(req.params.id);

  // checks if the id is numeric
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    await prisma.task.delete({
      where: { id }
    });

    // success with no content returned
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Task not found' });
  }
});




// TASK EDITING 


// updates an existing task
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, notes } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { title, notes }
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
});




// SERVER START


// starts the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
