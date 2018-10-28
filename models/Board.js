const mongoose = require('mongoose');

const { Schema } = mongoose;

const BoardSchema = new Schema({
  name: { type: String, required: true },
  owned_by: { type: String, required: true },
  background: { type: String, required: true },
  columnOrder: [String],
});

module.exports = mongoose.model('Board', BoardSchema);
