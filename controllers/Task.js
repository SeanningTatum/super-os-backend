const Task = require('../models/Task');

module.exports.getTask = task_id => Task.findById(task_id);

module.exports.createTask = (content, board_id) => new Task({ content, board_id }).save();

module.exports.getTasksInColumn = task_id_arr => Task.find({ _id: { $in: task_id_arr } });

module.exports.getTasksInBoard = board_id => Task.find({ board_id });
