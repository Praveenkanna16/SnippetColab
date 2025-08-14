// controllers/snippetController.js
const Snippet = require('../models/Snippet');
const Comment = require('../models/Comment');

// @desc    Get all snippets
// @route   GET /api/snippets
exports.getAllSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find().populate('author', 'name').sort({ createdAt: -1 });
    res.json(snippets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single snippet by ID
// @route   GET /api/snippets/:id
exports.getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id)
      .populate('author', 'name email')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name email',
        },
      });

    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    res.json(snippet);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new snippet
// @route   POST /api/snippets
exports.createSnippet = async (req, res) => {
  const { title, description, code, language } = req.body;

  if (!title || !code || !language) {
    return res.status(400).json({ message: 'Please provide title, code, and language' });
  }

  try {
    const snippet = new Snippet({
      title,
      description,
      code,
      language,
      author: req.user.id, // Comes from the 'protect' middleware
    });

    const createdSnippet = await snippet.save();
    res.status(201).json(createdSnippet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while creating snippet' });
  }
};

// --- NEW FUNCTION FOR ADDING COMMENTS ---
// @desc    Add a comment to a snippet
// @route   POST /api/snippets/:id/comments
exports.addCommentToSnippet = async (req, res) => {
  const { text } = req.body;
  const snippetId = req.params.id;

  if (!text) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  try {
    const snippet = await Snippet.findById(snippetId);
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    const newComment = new Comment({
      text,
      author: req.user.id,
      snippet: snippetId,
    });

    const savedComment = await newComment.save();

    snippet.comments.push(savedComment._id);
    await snippet.save();
    
    const populatedComment = await Comment.findById(savedComment._id).populate('author', 'name email');

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while adding comment' });
  }
};