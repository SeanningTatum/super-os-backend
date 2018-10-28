const Board = require('../models/Board');


module.exports.getBoard = board_id => Board.findById(board_id);

module.exports.createBoard = (args) => {
  const { user_id, board_name, background } = args;
  return new Board({ name: board_name, owned_by: user_id, background }).save();
};

module.exports.findBoardsByUser = user_id => Board.find({ owned_by: user_id });
