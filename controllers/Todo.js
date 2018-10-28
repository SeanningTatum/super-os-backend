const Todo = require('../models/Todo');

module.exports.createTodo = todo_data => new Todo({ ...todo_data }).save();

module.exports.deleteTodo = async todo_id => Todo.findByIdAndDelete(todo_id);

module.exports.getTodos = user_id => Todo.find({ assigned_to: user_id });

module.exports.getTodo = todo_id => Todo.findById(todo_id);

module.exports.assignTodoToUser = async (todo_id, user_id) => {
  const todo = await Todo.findById(todo_id);

  todo.assigned_to = [...todo.assigned_to, user_id];

  return todo.save();
};
