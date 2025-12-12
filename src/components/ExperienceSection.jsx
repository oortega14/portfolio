import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import experiencesData from '../data/experiences.json';

const ExperienceSection = () => {
  const { t, i18n } = useTranslation();
  const { isInitialized } = useLanguage();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isInitialized) return;

    // Cargar experiencias del JSON y aplicar traducciones
    const loadExperiences = () => {
      const currentLang = i18n.language;
      const translatedExperiences = experiencesData.map(exp => ({
        ...exp,
        title: exp.job_title[currentLang] || exp.job_title.en,
        description: exp.description[currentLang] || exp.description.en,
        current: !exp.end_date
      }));

      // Ordenar por posición
      const sortedExperiences = translatedExperiences.sort((a, b) => {
        if (a.position !== b.position) {
          return a.position - b.position;
        }
        return new Date(b.start_date) - new Date(a.start_date);
      });

      setExperiences(sortedExperiences);
      setLoading(false);
    };

    loadExperiences();
  }, [isInitialized, i18n.language]);

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
      <div className="max-w-4xl mx-auto">

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
                key={exp.id}
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
                      <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-blue-400 font-semibold">{exp.company}</p>
                        {exp.company_url && (
                          <a
                            href={exp.company_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-blue-400 transition-colors"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
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
                    <div>
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