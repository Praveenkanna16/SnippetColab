// routes/snippetRoutes.js
const express = require('express');

// Import the new function
const { 
  getAllSnippets, 
  getSnippetById, 
  createSnippet,
  addCommentToSnippet // <-- Import new function
} = require('../controllers/snippetController'); 

const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .get(protect, getAllSnippets)
  .post(protect, createSnippet); 

router.route('/:id').get(protect, getSnippetById);

// This is the new route for adding comments
router.route('/:id/comments').post(protect, addCommentToSnippet); // <-- Add new route

module.exports = router;