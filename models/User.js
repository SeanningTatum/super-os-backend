const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String },
  email: { type: String, required: true, unique: true },
  dateCreated: { type: Date, default: new Date() },
  team_id: String,
  user_type: [String],
});

module.exports = mongoose.model('User', UserSchema);
