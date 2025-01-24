import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react"; // Lucide icons for like and comment
import { usePostStore } from "../store/usePostStore"; // Zustand store for posts
import { useAuthStore } from "../store/useAuthStore"; // Zustand store for authentication

function PostCard({ post }) {
    const { likePost, addComment } = usePostStore(); // Zustand actions
    const { authUser } = useAuthStore(); // Authenticated user
    const [commentText, setCommentText] = useState(""); // State for comment input
    const [showComments, setShowComments] = useState(false); // State to toggle comments visibility

    // Handle like post
    const handleLike = async () => {
        if (!authUser) {
            alert("You need to log in to like a post.");
            return;
        }
        try {
            await likePost(post._id);
        } catch (error) {
            console.error("Failed to like post:", error);
        }
    };

    // Handle add comment
    const handleAddComment = async () => {
        if (!authUser) {
            alert("You need to log in to comment.");
            return;
        }
        if (!commentText.trim()) {
            alert("Comment cannot be empty.");
            return;
        }
        try {
            await addComment(post._id, { text: commentText });
            setCommentText(""); // Clear the comment input
        } catch (error) {
            console.error("Failed to add comment:", error);
        }
    };

    return (
        <div className=" rounded-lg shadow-md overflow-hidden">
            {post.image && (
                <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
                <p className="">{post.content}</p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                    {post.user?.profilePic && (
                        <img
                            src={post.user.profilePic}
                            alt={post.user.email || "User"}
                            className="w-8 h-8 rounded-full mr-2"
                        />
                    )}
                    <span>{post.user?.email || "Unknown"}</span>
                </div>
                <div className="mt-4 flex space-x-4">
                    <button
                        onClick={handleLike}
                        className={`flex items-center ${post.likes?.includes(authUser?._id)
                            ? "text-red-500"
                            : "text-gray-600 hover:text-red-500"
                            } transition-colors`}
                    >
                        <Heart className="mr-1" size={16} />
                        <span>{post.likes?.length || 0}</span>
                    </button>
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center text-gray-600 hover:text-blue-500 transition-colors"
                    >
                        <MessageCircle className="mr-1" size={16} />
                        <span>{post.comments?.length || 0}</span>
                    </button>
                </div>

                {/* Comment Input */}
                {showComments && (
                    <div className="mt-4">
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={2}
                        />
                        <button
                            onClick={handleAddComment}
                            className="mt-2 bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Add Comment
                        </button>
                    </div>
                )}

                {/* Display Comments */}
                {showComments && (
                    <div className="mt-4 space-y-2">
                        {post.comments?.map((comment, index) => (
                            <div key={index} className="bg-gray-50 p-2 rounded-lg">
                                <div className="flex items-start">
                                    <img
                                        src={comment.user.profilePic || 'default-avatar.png'}
                                        alt={comment.user.email || "Commenter"}
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            {comment.user.email || "Unknown"}
                                        </p>
                                        <p className="text-sm text-gray-700">{comment.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PostCard;