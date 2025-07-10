import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, Download, ExternalLink, ImageIcon } from 'lucide-react';

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
    console.error('Error loading image:', e.currentTarget.src);
    e.currentTarget.style.display = 'none';
  };

  const getImageUrl = (imagePath: string) => {
    // Ensure the path starts with uploads/
    const cleanPath = imagePath.startsWith('uploads/') ? imagePath : `uploads/${imagePath}`;
    const fullUrl = `http://localhost:5000/${cleanPath}`;
    console.log('Image URL:', fullUrl);
    return fullUrl;
  };

  return (
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
              Imágenes:
            </h4>
            <div className="space-y-4">
              {post.images.map((image, index) => {
                const imageUrl = getImageUrl(image.path);
                return (
                  <div key={image._id} className="w-full">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <img
                        src={imageUrl}
                        alt={image.originalName}
                        className="w-full h-auto rounded-lg shadow-md border border-gray-300 max-w-full"
                        style={{ 
                          maxWidth: '100%', 
                          height: 'auto',
                          objectFit: 'contain'
                        }}
                        onError={handleImageError}
                        onLoad={() => console.log('Image loaded successfully:', imageUrl)}
                      />
                      <p className="text-sm text-gray-600 mt-3 text-center font-medium">
                        📷 {image.originalName}
                      </p>
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
  );
};

export default PostCard;