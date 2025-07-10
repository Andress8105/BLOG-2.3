import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, Download, ExternalLink, ImageIcon } from 'lucide-react';
import ImageModal from './ImageModal';

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    content: string;
    author: {
      username: string;
      avatar?: string;
    };
    images: Array<{
      _id: string;
      originalName: string;
      path: string;
    }>;
    documents: Array<{
      _id: string;
      originalName: string;
      path: string;
    }>;
    links: Array<{
      title: string;
      url: string;
      description: string;
    }>;
    tags: string[];
    createdAt: string;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [selectedImage, setSelectedImage] = React.useState<{
    url: string;
    name: string;
    id: string;
  } | null>(null);

  const handleDownload = async (postId: string, fileId: string, filename: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/download/${fileId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    console.error('Error loading image:', target.src);
    
    // Replace with a placeholder or hide the image
    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBMMTMwIDEwMEgxMTBWMTMwSDkwVjEwMEg3MEwxMDAgNzBaIiBmaWxsPSIjOUI5QkEwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUI5QkEwIiBmb250LXNpemU9IjEyIj5JbWFnZW4gbm8gZGlzcG9uaWJsZTwvdGV4dD4KPHN2Zz4=';
    target.alt = 'Imagen no disponible';
    target.className = target.className.replace('hover:scale-105', '');
  };

  const getImageUrl = (imagePath: string) => {
    // Ensure the path starts with uploads/
    const cleanPath = imagePath.startsWith('uploads/') ? imagePath : `uploads/${imagePath}`;
    const fullUrl = `http://localhost:5000/${cleanPath}`;
    console.log('Image URL:', fullUrl);
    return fullUrl;
  };

  const openImageModal = (image: any) => {
    setSelectedImage({
      url: getImageUrl(image.path),
      name: image.originalName,
      id: image._id
    });
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 mb-8">
      <div className="p-6">
        {/* Author Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-lg">{post.author.username}</p>
              <p className="text-sm text-gray-500 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(post.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {post.title}
        </h2>

        {/* Content */}
        <div className="text-gray-700 mb-6 leading-relaxed text-base">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>

        {/* Images - Full Size Display */}
        {post.images.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" />
              Imágenes ({post.images.length}):
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {post.images.map((image, index) => {
                const imageUrl = getImageUrl(image.path);
                return (
                  <div key={image._id} className="relative group">
                    <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors">
                      <img
                        src={imageUrl}
                        alt={image.originalName}
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                        style={{ 
                          objectFit: 'cover'
                        }}
                        onError={handleImageError}
                        onLoad={() => console.log('Image loaded successfully:', imageUrl)}
                        onClick={() => openImageModal(image)}
                      />
                      {/* Optional: Show filename on hover */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end">
                        <div className="w-full p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-white text-sm font-medium truncate">
                            {image.originalName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Documents */}
        {post.documents.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">📄 Documentos:</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                {post.documents.map((doc) => (
                  <button
                    key={doc._id}
                    onClick={() => handleDownload(post._id, doc._id, doc.originalName)}
                    className="flex items-center space-x-3 w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  >
                    <Download className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-700 font-medium">{doc.originalName}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Links */}
        {post.links.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">🔗 Enlaces:</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-3">
                {post.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                  >
                    <ExternalLink className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-green-700 font-medium">{link.title}</p>
                      {link.description && (
                        <p className="text-sm text-gray-600">{link.description}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={closeImageModal}
          imageUrl={selectedImage.url}
          imageName={selectedImage.name}
          postId={post._id}
          imageId={selectedImage.id}
        />
      )}
    </>
  );
};

export default PostCard;