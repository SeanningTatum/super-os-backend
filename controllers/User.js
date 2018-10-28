const bcrypt = require('bcrypt');
const { ApolloError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const saltRounds = 10;


module.exports.getUser = user_id => User.findById(user_id);

module.exports.deleteUser = async user_id => User.findByIdAndDelete(user_id);

module.exports.updateUser = ({ user_id, ...user_form }) => User.findByIdAndUpdate(user_id, { ...user_form });

module.exports.getMembers = team_id => User.find({ team_id });

module.exports.joinTeam = (user_id, team_id) => User.findByIdAndUpdate(user_id, { team_id });

module.exports.getMembersInProject = members_id_arr => User.find({ _id: { $in: members_id_arr } });

module.exports.getUsersAssignedToTask = users_id_arr => User.find({ _id: { $in: users_id_arr } });

module.exports.register = async ({ username, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
    const user = await new User({ username, email, password: hashedPassword }).save();

    return jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );
  } catch (error) {
    if (error.code === 11000) {
      return new ApolloError('Email has already been taken!');
    }
    return new ApolloError('A server error has occurred');
  }
};

module.exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) return new ApolloError('User not found');

  const match = await bcrypt.compare(password, user.password);

  if (!match) return new ApolloError('Password is incorrect');

  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' },
  );
};
