const Todo = require('../models/todoModel');

// Create a new todo
const createTodo = async (req, res) => {
  const { title, description } = req.body;
  try {
    const newTodo = new Todo({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

