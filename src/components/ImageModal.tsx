import React from 'react';
import { X, Download } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageName: string;
  postId: string;
  imageId: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  imageName,
  postId,
  imageId
}) => {
  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/download/${imageId}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = imageName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-7xl max-h-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Download button */}
        <button
          onClick={handleDownload}
          className="absolute top-4 right-16 z-10 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all"
        >
          <Download className="w-5 h-5" />
        </button>

        {/* Image */}
        <img
          src={imageUrl}
          alt={imageName}
          className="max-w-full max-h-full object-contain rounded-lg"
          style={{ maxHeight: 'calc(100vh - 2rem)' }}
        />

        {/* Image name */}
        <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
          <p className="text-sm font-medium truncate">{imageName}</p>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;