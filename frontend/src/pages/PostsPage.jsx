

import { useEffect, useState } from "react";
import { usePostStore } from "../store/usePostStore"; // Adjust the import path
import PostCard from "../components/PostCard"; // Create this component
import CreatePostModal from "../components/CreatePostModal"; // Create this component
import { Plus } from "lucide-react"; // Lucide icon for the create post button
import { Loader } from "lucide-react";
import Sidebar from "../components/Sidebar";
import RightSidebar from "../components/RightSidebar";
function PostsPage() {
    const { posts, isPostsLoading, getPosts, createPost, subscribeToPosts, unsubscribeFromPosts } = usePostStore();
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);

    // Fetch posts and subscribe to real-time updates on component mount
    useEffect(() => {
        getPosts(); // Fetch initial posts
        subscribeToPosts(); // Subscribe to real-time updates

        return () => {
            unsubscribeFromPosts(); // Unsubscribe when the component unmounts
        };
    }, [getPosts, subscribeToPosts, unsubscribeFromPosts]);


    // Handle post creation
    const handleCreatePost = async (postData) => {
        await createPost(postData);
        setShowCreatePostModal(false); // Close the modal after creating the post
    };

    return (
        <div className="h-screen bg-base-200">
            <div className="flex items-start justify-center pt-20 px-4 gap-5 h-full rounded-lg overflow-hidden">
                <Sidebar />

                <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)] overflow-y-auto">
                    <div className="container mx-auto p-4 mt-4">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">Posts</h1>
                            <button
                                onClick={() => setShowCreatePostModal(true)}
                                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <Plus className="mr-2" size={18} />
                                Create Post
                            </button>
                        </div>

                        {isPostsLoading ? (
                            <div className="flex  flex-col justify-center items-center h-40">
                                <Loader />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
                                {posts.map((post) => (
                                    <PostCard key={post._id} post={post} />
                                ))}
                            </div>
                        )}

                        <CreatePostModal
                            show={showCreatePostModal}
                            onHide={() => setShowCreatePostModal(false)}
                            onSubmit={handleCreatePost}
                        />
                    </div>
                </div>
                <RightSidebar />
            </div>
        </div>


    );
}

export default PostsPage;