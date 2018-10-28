const mongoose = require('mongoose');

const { Schema } = mongoose;

const TaskSchema = new Schema({
  content: { type: String, required: true },
  board_id: { type: String, required: true },
});

module.exports = mongoose.model('Task', TaskSchema);
