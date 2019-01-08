const userRouter = require('express').Router();
const { getAllUsers, getUserById } = require('../controllers/users');
const { handle405 } = require('../errors/index');


userRouter.route('/')
  .get(getAllUsers)
  .all(handle405);

userRouter.route('/:username')
  .get(getUserById)
  .all(handle405);


module.exports = userRouter;
