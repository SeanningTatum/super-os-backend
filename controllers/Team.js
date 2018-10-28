const Team = require('../models/Team');

module.exports.getTeam = id => Team.findById(id);

module.exports.createTeam = name => new Team({ name }).save();

module.exports.deleteTeam = async team_id => Team.findByIdAndDelete(team_id);

module.exports.updateTeam = ({ team_id, ...team_form }) => Team.findByIdAndUpdate(team_id, { ...team_form });
