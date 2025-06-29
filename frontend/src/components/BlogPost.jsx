import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useStableApiWithLang } from '../hooks/useStableApiWithLang';

const BlogPost = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { navigateWithLang, isInitialized } = useLanguage();
  const { apiGet, currentLang } = useStableApiWithLang();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastFetchLang = useRef(null);
  const lastFetchSlug = useRef(null);
  const fetchInProgress = useRef(false);

  useEffect(() => {
    // No hacer fetch hasta que el contexto esté inicializado
    if (!isInitialized || !slug) {
      return;
    }

    // Evitar fetch si ya está en progreso o son los mismos parámetros
    if (fetchInProgress.current || 
        (lastFetchLang.current === currentLang && lastFetchSlug.current === slug)) {
      return;
    }

    const fetchPost = async () => {
      if (fetchInProgress.current) return;
      
      fetchInProgress.current = true;
      
      try {
        setLoading(true);
        const { data } = await apiGet(`/blogs/${slug}`);
        
        setPost(data);
        setError(null);
        lastFetchLang.current = currentLang;
        lastFetchSlug.current = slug;
      } catch (error) {
        console.error('❌ Error fetching blog post:', error);
        setError('Blog post not found');
        setPost(null);
      } finally {
        setLoading(false);
        fetchInProgress.current = false;
      }
    };

    fetchPost();
  }, [isInitialized, currentLang, slug, apiGet]);

  // Reset cuando cambia el idioma o slug
  useEffect(() => {
    if ((lastFetchLang.current && lastFetchLang.current !== currentLang) ||
        (lastFetchSlug.current && lastFetchSlug.current !== slug)) {
      // Reset para permitir nuevo fetch
      fetchInProgress.current = false;
    }
  }, [currentLang, slug]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigateWithLang('/blog')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {t('blog.backToBlog')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigateWithLang('/blog')}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>{t('blog.backToBlog')}</span>
        </motion.button>

        {/* Article */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-slate-800 rounded-xl p-8"
        >
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-6">
              {post.published_at && (
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>{formatDate(post.published_at)}</span>
                </div>
              )}

              {post.author && (
                <div className="flex items-center space-x-1">
                  <User size={16} />
                  <span>{post.author}</span>
                </div>
              )}

              {post.reading_time && (
                <div className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span>{post.reading_time}</span>
                </div>
              )}

              {post.category && (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                  {post.category}
                </span>
              )}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-slate max-w-none">
            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export default BlogPost;