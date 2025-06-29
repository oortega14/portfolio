import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useStableApiWithLang } from '../hooks/useStableApiWithLang';

const ExperienceSection = () => {
  const { t } = useTranslation();
  const { isInitialized } = useLanguage();
  const { apiGet, currentLang } = useStableApiWithLang();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const lastFetchLang = useRef(null);
  const fetchInProgress = useRef(false);

  useEffect(() => {
    // No hacer fetch hasta que el contexto esté inicializado
    if (!isInitialized) {
      return;
    }

    // Evitar fetch si ya está en progreso o es el mismo idioma
    if (fetchInProgress.current || lastFetchLang.current === currentLang) {
      return;
    }

    const fetchExperiences = async () => {
      if (fetchInProgress.current) return;
      
      fetchInProgress.current = true;
      
      try {
        setLoading(true);
        const { data } = await apiGet('/experiences');
        
        // Ordenar por posición o por fecha de inicio (más reciente primero)
        const sortedExperiences = data.sort((a, b) => {
          if (a.position !== b.position) {
            return a.position - b.position;
          }
          return new Date(b.start_date) - new Date(a.start_date);
        });
        
        setExperiences(sortedExperiences);
        lastFetchLang.current = currentLang;
      } catch (error) {
        console.error('❌ Error fetching experiences:', error);
        setError('Failed to load experiences');
      } finally {
        setLoading(false);
        fetchInProgress.current = false;
      }
    };

    fetchExperiences();
  }, [isInitialized, currentLang, apiGet]);

  // Reset cuando cambia el idioma
  useEffect(() => {
    if (lastFetchLang.current && lastFetchLang.current !== currentLang) {
      fetchInProgress.current = false;
    }
  }, [currentLang]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  const formatPeriod = (startDate, endDate, current) => {
    const start = formatDate(startDate);
    if (current) {
      return `${start} - Present`;
    }
    const end = formatDate(endDate);
    return `${start} - ${end}`;
  };

  // Mostrar loading solo en la carga inicial
  if (loading && experiences.length === 0) {
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
      <div className="max-w-4xl mx-auto">
        {/* Loading indicator para cambios de idioma (sutil) */}
        {loading && experiences.length > 0 && (
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
            {t('experience.title')}
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-300 max-w-3xl mx-auto"
          >
            {t('experience.subtitle')}
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-500/30 hidden md:block" />

          {experiences.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">{t('experience.noExperiences')}</p>
            </div>
          ) : (
            experiences.map((exp, index) => (
              <motion.div
                key={`${exp.id}-${currentLang}`} // Key único por idioma
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative mb-12 md:ml-16"
              >
                {/* Timeline dot */}
                <div className="absolute -left-20 top-6 w-4 h-4 bg-blue-500 rounded-full border-4 border-slate-900 hidden md:block" />

                <div className="bg-slate-800 rounded-xl p-6 hover:bg-slate-750 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Company Logo */}
                        {exp.company_logo_url && (
                          <img
                            src={exp.company_logo_url}
                            alt={`${exp.company} logo`}
                            className="w-12 h-12 rounded-lg object-contain bg-white/10 p-1"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}

                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                          <div className="flex items-center gap-2">
                            <p className="text-blue-400 font-semibold">{exp.company}</p>
                            {exp.website_url && (
                              <a
                                href={exp.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-blue-400 transition-colors"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                          </div>
                          {exp.position_name && (
                            <p className="text-slate-400 text-sm mt-1">{exp.position_name}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-slate-400 text-sm mt-2 sm:mt-0 sm:text-right">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{formatPeriod(exp.start_date, exp.end_date, exp.current)}</span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center space-x-1 mt-1">
                          <MapPin size={14} />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {exp.description && (
                    <p className="text-slate-300 mb-4">{exp.description}</p>
                  )}

                  {/* Technologies */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-400 mb-2">{t('experience.technologies')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded border border-green-500/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Responsibilities */}
                  {exp.responsabilities && exp.responsabilities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-400 mb-2">{t('experience.responsabilities')}</h4>
                      <ul className="space-y-2">
                        {exp.responsabilities.map((responsibility, i) => (
                          <li key={i} className="flex items-start space-x-2 text-slate-300">
                            <span className="text-blue-400 mt-2">•</span>
                            <span className="text-sm">{responsibility}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;