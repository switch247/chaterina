import Post from '../models/post.model.js';
import { io } from '../lib/socket.js';
// Create a new post
export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const newPost = new Post({
      content,
      image,
      user: req.user._id, // Attach the authenticated user's ID
    });
    await newPost.save();
    res.status(201).json(newPost);
    io.emit('newPost', newPost); // Broadcast the new post to all clients
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to create post', error: error.message });
  }
};

// Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', '-password')
      .populate('comments.user', '-password')
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch posts', error: error.message });
  }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('user', '-password')
      .populate('comments.user', '-password');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch post', error: error.message });
  }
};

// Update a post
export const updatePost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    // if (post.user.toString() !== req.user._id.toString()) {
    //   return res
    //     .status(403)
    //     .json({ message: 'Not authorized to update this post' });
    // }
    post.content = content || post.content;
    post.image = image || post.image;
    await post.save();
    res.status(200).json(post);
    io.emit('updatePost', post); // Broadcast the updated post to all clients
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to update post', error: error.message });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this post' });
    }
    await post.remove();
    res.status(200).json({ message: 'Post deleted successfully' });
    io.emit('deletePost', req.params.postId); // Broadcast the deleted post ID to all clients
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to delete post', error: error.message });
  }
};

// Like a post
export const likePost = async (req, res) => {
  console.log('liking post');
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.likes.includes(req.user._id)) {
      post.likes = post.likes.filter(
        (like) => like.toString() !== req.user._id.toString()
      );
      await post.save();
      return res.status(200).json({ message: 'Like removed', post });
    }
    post.likes.push(req.user._id);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to like post', error: error.message });
  }
};

// Add a comment to a post
export const addComment = async (req, res) => {
  console.log('Adding comment ...');
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const newComment = {
      text,
      user: req.user._id,
    };
    post.comments.push(newComment);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: 'Failed to add comment', error: error.message });
  }
};
