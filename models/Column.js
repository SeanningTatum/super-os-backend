const mongoose = require('mongoose');

const { Schema } = mongoose;

const ColumnSchema = new Schema({
  title: { type: String, isRequired: true },
  board_id: { type: String, isRequired: true },
  tasks: { type: [String], default: [] },
});

module.exports = mongoose.model('Column', ColumnSchema);
