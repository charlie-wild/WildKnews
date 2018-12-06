const userRouter = require('express').Router();
const { getAllUsers, getUserById } = require('../controllers/users');
const { handle405 } = require('../errors/index');


userRouter.route('/')
  .get(getAllUsers)
  .all(handle405);

userRouter.route('/:user_id')
  .get(getUserById)
  .all(handle405);


module.exports = userRouter;
