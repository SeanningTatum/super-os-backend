const Column = require('../models/Column');
const taskController = require('./Task');

const getColumn = async (column_id) => {
  const column = await Column.findById(column_id);
  column.task_order = column.tasks;
  return column;
};

module.exports.createColumn = (title, board_id) => new Column({ title, board_id }).save();

module.exports.getColumnsByBoard = board_id => Column.find({ board_id });

module.exports.updateColumn = ({ ...column_data }) => Column.findByIdAndUpdate({ column_data });

module.exports.addTaskToColumn = async (column_id, content) => {
  const newTask = await taskController.createTask(content);
  const column = await Column.findById(column_id);

  column.tasks = [...column.tasks, newTask.id];

  return column.save();
};

module.exports.updateTaskOrder = async (column_id, updated_task_id_arr) => {
  const column = await getColumn(column_id);

  column.tasks = [...updated_task_id_arr];
  return column.save();
};

module.exports.getColumn = getColumn;
