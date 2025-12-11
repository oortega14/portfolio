import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import projectsData from '../data/projects.json';

const ProjectsSection = () => {
  const { t, i18n } = useTranslation();
  const { isInitialized } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isInitialized) return;

    // Cargar proyectos del JSON y aplicar traducciones
    const loadProjects = () => {
      const currentLang = i18n.language;
      const translatedProjects = projectsData
        .filter(project => project.published)
        .map(project => ({
          ...project,
          title: project.title[currentLang] || project.title.en,
          description: project.description[currentLang] || project.description.en,
          image: project.image_url
        }))
        .sort((a, b) => a.position - b.position);

      setProjects(translatedProjects);
      setLoading(false);
    };

    loadProjects();
  }, [isInitialized, i18n.language]);

  if (loading) {
    return (
      <section className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">{t('common.loading')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 pt-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('projects.title')}
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-300 max-w-3xl mx-auto"
          >
            {t('projects.subtitle')}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-400 text-lg">{t('projects.noProjects')}</p>
            </div>
          ) : (
            projects.map((project, index) => (
              <motion.div
                key={`${project.id}-${i18n.language}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-slate-800 rounded-xl overflow-hidden hover:bg-slate-750 transition-colors group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image || 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies && project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    {project.github_url && (
                      <motion.a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        <Github size={16} />
                        <span className="text-sm">{t('projects.code')}</span>
                      </motion.a>
                    )}

                    {project.live_url && (
                      <motion.a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        <ExternalLink size={16} />
                        <span className="text-sm">{t('projects.demo')}</span>
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;