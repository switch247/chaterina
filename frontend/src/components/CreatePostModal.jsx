import { useState } from "react";
import { X } from "lucide-react"; // Lucide icon for closing the modal
import { v2 as cloudinary } from "cloudinary"; // Import Cloudinary SDK

// Configure Cloudinary
cloudinary.config({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
});

function CreatePostModal({ show, onHide, onSubmit }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [isUploading, setIsUploading] = useState(false); // State for image upload loading
  const [error, setError] = useState(""); // State for error handling

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content) {
      setError("Content is required.");
      return;
    }
    onSubmit({ content, image });
    setContent("");
    setImage("");
    setError("");
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async (file) => {
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
      const uploadResult = await cloudinary.uploader.upload(file, {
        upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET, // Use the upload preset
        public_id: `post_${Date.now()}`, // Unique public ID for the image
      });

      setImage(uploadResult.secure_url); // Set the uploaded image URL
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-base-200 rounded-lg w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-base-300">
          <h2 className="text-lg font-semibold text-base-content">Create Post</h2>
          <button
            onClick={onHide}
            className="text-base-content hover:text-error transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-base-content mb-1">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border border-base-300 rounded-lg bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base-content"
              rows={4}
              required
              aria-required="true"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-base-content mb-1">
              Upload Image (optional)
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="w-full file-input file-input-bordered file-input-primary bg-base-100"
              disabled={isUploading}
              aria-describedby="image-upload-help"
            />
            {isUploading && (
              <p className="text-sm text-base-content mt-2">Uploading image...</p>
            )}
            {image && !isUploading && (
              <div className="mt-2">
                <img
                  src={image}
                  alt="Uploaded"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
          {error && (
            <p className="text-sm text-error mb-4">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-focus transition-colors"
            disabled={isUploading}
          >
            {isUploading ? "Creating Post..." : "Create Post"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePostModal;