import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useStableApiWithLang } from '../hooks/useStableApiWithLang';

const BlogSection = () => {
  const { t, i18n } = useTranslation();
  const { navigateWithLang, isInitialized } = useLanguage();
  const { apiGet, currentLang } = useStableApiWithLang();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastFetchLang = useRef(null);
  const fetchInProgress = useRef(false);

  useEffect(() => {
    // No hacer fetch hasta que el contexto esté inicializado
    if (!isInitialized) {
      console.log('❌ Context not initialized yet');
      return;
    }

    // Evitar fetch si ya está en progreso o es el mismo idioma
    if (fetchInProgress.current || lastFetchLang.current === currentLang) {
      console.log('❌ Fetch already in progress or same language');
      return;
    }

    const fetchBlogs = async () => {
      if (fetchInProgress.current) return;

      fetchInProgress.current = true;
      console.log(`🚀 Fetching blogs for language: ${currentLang}`);

      try {
        setLoading(true);
        const { data } = await apiGet('/blogs');
        console.log('📋 Raw API response:', data);
        console.log(`✅ Blogs fetched successfully for ${currentLang}`);

        // Verificar que data sea un array
        if (!Array.isArray(data)) {
          console.error('❌ API response is not an array:', data);
          setError('Invalid data format received from server');
          return;
        }

        const publishedBlogs = data
          .filter(blog => blog.published)
          .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

        setPosts(publishedBlogs);
        lastFetchLang.current = currentLang;
      } catch (error) {
        console.error('❌ Error fetching blogs:', error);
        console.error('Error details:', error.response?.data || error.message);
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
        fetchInProgress.current = false;
      }
    };

    fetchBlogs();
  }, [isInitialized, currentLang, apiGet]);

  // Reset cuando cambia el idioma
  useEffect(() => {
    if (lastFetchLang.current && lastFetchLang.current !== currentLang) {
      console.log(`🔄 Language changed from ${lastFetchLang.current} to ${currentLang}`);
      // Reset para permitir nuevo fetch
      fetchInProgress.current = false;
    }
  }, [currentLang]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePostClick = (slug) => {
    navigateWithLang(`/blog/${slug}`);
  };

  // Mostrar loading solo en la carga inicial
  if (loading && posts.length === 0) {
    return (
      <section className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">{t('common.loading')}</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {t('common.retry')}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Loading indicator para cambios de idioma (sutil) */}
        {loading && posts.length > 0 && (
          <div className="fixed top-20 right-4 z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span className="text-sm text-slate-300">Updating...</span>
            </div>
          </div>
        )}

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 pt-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('blog.title')}
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-300 max-w-3xl mx-auto"
          >
            {t('blog.subtitle')}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-400 text-lg">{t('blog.noPosts')}</p>
            </div>
          ) : (
            posts.map((post, index) => (
              <motion.article
                key={`${post.id}-${currentLang}`} // Key único por idioma
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-slate-800 rounded-xl p-6 hover:bg-slate-750 transition-colors cursor-pointer group"
                onClick={() => handlePostClick(post.slug)}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-3">
                    <span>{formatDate(post.published_at)}</span>
                    <span>{post.reading_time || '5 min read'}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {post.excerpt || post.content?.substring(0, 150) + '...'}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {post.tags && post.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <motion.div
                  className="flex items-center text-blue-400 text-sm font-semibold"
                  whileHover={{ x: 5 }}
                >
                  <span>{t('blog.readMore')}</span>
                  <ExternalLink size={14} className="ml-1" />
                </motion.div>
              </motion.article>
            ))
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <motion.button
            className="px-8 py-3 border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('blog.viewAll')}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;