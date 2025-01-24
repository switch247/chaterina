import { useState } from "react";
import { X } from "lucide-react"; // Lucide icon for closing the modal

function CreatePostModal({ show, onHide, onSubmit }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [isUploading, setIsUploading] = useState(false); // State for image upload loading

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit({ content, image });
    setContent("");
    setImage("");
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async (file) => {
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "YOUR_CLOUDINARY_UPLOAD_PRESET"); // Replace with your upload preset
    formData.append("cloud_name", "YOUR_CLOUDINARY_CLOUD_NAME"); // Replace with your cloud name

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/YOUR_CLOUDINARY_CLOUD_NAME/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setImage(data.secure_url); // Set the uploaded image URL
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
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
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-base-content mb-1">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border border-base-300 rounded-lg bg-base-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base-content"
              rows={4}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-base-content mb-1">
              Upload Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="w-full file-input file-input-bordered file-input-primary bg-base-100"
              disabled={isUploading}
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