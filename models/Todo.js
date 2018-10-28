const mongoose = require('mongoose');

const { Schema } = mongoose;

const TodoSchema = new Schema({
  project_id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  comments: { type: [String], default: [] },
  date_completed: Date,
  date_due: Date,
  completed_by: String,
  assigned_to: { type: [String], default: [] },
});

module.exports = mongoose.model('Todo', TodoSchema);
