import React, { useState, useEffect } from 'react';
import { postService } from '../services/postService';
import PostCard from '../components/PostCard';
import { Loader2, RefreshCw } from 'lucide-react';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await postService.getAllPosts();
      setPosts(response.posts);
      console.log('Posts loaded:', response.posts);
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError('Error al cargar las publicaciones');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Cargando publicaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchPosts}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Intentar de nuevo</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenido a <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">BlogPlatform</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre historias increíbles, ideas y conocimientos de nuestra comunidad de escritores
          </p>
        </div>

        {/* Posts Feed */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-12 border border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                No hay publicaciones aún
              </h3>
              <p className="text-gray-600 text-lg">
                ¡Sé el primero en compartir tu historia!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* Refresh Button */}
        {posts.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={fetchPosts}
              className="flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-lg hover:bg-white hover:shadow-md transition-all duration-200 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Actualizar publicaciones</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;