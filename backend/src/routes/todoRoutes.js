const express = require('express');
const controller = require('../controllers/todoController');

const router = express.Router();

router.get('/', controller.getTodos);
router.post('/', controller.createTodo);
router.patch('/:id', controller.updateTodo);
router.delete('/:id', controller.deleteTodo);

module.exports = router;
