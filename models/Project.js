const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  team_id: { type: String, required: true },
  description: String,
  members_id: { type: [String], unique: true },
});

module.exports = mongoose.model('Project', ProjectSchema);
