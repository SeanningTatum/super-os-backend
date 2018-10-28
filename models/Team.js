const mongoose = require('mongoose');

const { Schema } = mongoose;

const TeamSchema = new Schema({
  name: { type: String, required: true },
  invite_keys: [String],
  date_created: { type: Date, default: new Date() },
});

module.exports = mongoose.model('Team', TeamSchema);
