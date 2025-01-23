const express = require('express');
const {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} = require('../controllers/todoController');

const router = express.Router();

// Create a new todo
router.post('/', createTodo);

// Get all todos
router.get('/', getTodos);

// Update a todo
router.put('/:id', updateTodo);

// Delete a todo
router.delete('/:id', deleteTodo);

module.exports = router;
