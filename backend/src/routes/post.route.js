import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  addComment,
} from '../controllers/post.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Create a new post
router.post('/', protectRoute, createPost);

// Get all posts
router.get('/', getPosts);

// Get a single post by ID
router.get('/:postId', getPostById);

// Update a post
router.put('/:postId', protectRoute, updatePost);

// Delete a post
router.delete('/:postId', protectRoute, deletePost);

// Like a post
router.post('/like/:postId', protectRoute, likePost);

// Add a comment to a post
router.post('/comment/:postId', protectRoute, addComment);

export default router;
