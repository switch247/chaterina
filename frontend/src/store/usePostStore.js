import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from './useAuthStore';

// eslint-disable-next-line no-unused-vars
export const usePostStore = create((set, get) => ({
  posts: [],
  selectedPost: null,
  isPostsLoading: false,
  isPostDetailLoading: false,

  // Fetch all posts
  getPosts: async () => {
    set({ isPostsLoading: true });
    try {
      const res = await axiosInstance.get('/posts');
      set({ posts: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch posts');
    } finally {
      set({ isPostsLoading: false });
    }
  },

  // Fetch a single post by ID
  getPostById: async (postId) => {
    set({ isPostDetailLoading: true });
    try {
      const res = await axiosInstance.get(`/posts/${postId}`);
      set({ selectedPost: res.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to fetch post details'
      );
    } finally {
      set({ isPostDetailLoading: false });
    }
  },

  // Create a new post
  createPost: async (postData) => {
    try {
      const res = await axiosInstance.post('/posts', postData);
      set((state) => ({ posts: [res.data, ...state.posts] }));
      toast.success('Post created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    }
  },

  // Update a post
  updatePost: async (postId, postData) => {
    try {
      const res = await axiosInstance.put(`/posts/${postId}`, postData);
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId ? res.data : post
        ),
      }));
      toast.success('Post updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update post');
    }
  },

  // Delete a post
  deletePost: async (postId) => {
    try {
      await axiosInstance.delete(`/posts/${postId}`);
      set((state) => ({
        posts: state.posts.filter((post) => post._id !== postId),
      }));
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete post');
    }
  },

  // Like a post
  likePost: async (postId) => {
    try {
      const res = await axiosInstance.post(`/posts/like/${postId}`);
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId ? res.data : post
        ),
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to like post');
    }
  },

  // Comment on a post
  addComment: async (postId, commentData) => {
    try {
      const res = await axiosInstance.post(
        `/posts/comment/${postId}`,
        commentData
      );
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId ? res.data : post
        ),
      }));
      toast.success('Comment added successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    }
  },
  
  subscribeToPosts: () => {
    const socket = useAuthStore.getState().socket;

    socket.on('newPost', (newPost) => {
      set((state) => ({
        posts: [newPost, ...state.posts],
      }));
    });

    socket.on('updatePost', (updatedPost) => {
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        ),
      }));
    });

    socket.on('deletePost', (deletedPostId) => {
      set((state) => ({
        posts: state.posts.filter((post) => post._id !== deletedPostId),
      }));
    });
  },

  unsubscribeFromPosts: () => {
    const socket = useAuthStore.getState().socket;
    socket.off('newPost');
    socket.off('updatePost');
    socket.off('deletePost');
  },

  // Set selected post
  setSelectedPost: (selectedPost) => set({ selectedPost }),
}));
