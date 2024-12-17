const express = require('express');
const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
      } = require('../controllers/userController');

const router = express.Router();

router.get('/', getUsers); // Fetch all users
router.post('/', addUser); // Add a new user
router.patch('/:uid', updateUser); // Update a user
router.delete('/:uid', deleteUser); // Delete a user

module.exports = router;
