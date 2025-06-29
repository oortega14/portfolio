import { motion } from 'framer-motion';
import { Linkedin, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AboutSection = () => {
  const { t } = useTranslation();

  const skills = [
    { name: 'Ruby on Rails', level: 95, color: 'bg-red-500' },
    { name: 'PostgreSQL', level: 90, color: 'bg-indigo-500' },
    { name: 'React', level: 85, color: 'bg-blue-500' },
    { name: 'TypeScript', level: 80, color: 'bg-blue-600' },
    { name: 'AWS', level: 70, color: 'bg-orange-500' },
    { name: 'Python', level: 40, color: 'bg-green-500' },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('about.title')}
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            {t('about.description')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <img
              src="https://images.unsplash.com/photo-1607799279861-4dd421887fb3"
              alt="Coding workspace"
              className="rounded-xl shadow-2xl"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('about.skillsTitle')}</h3>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-slate-300 mb-2">
                      <span>{skill.name}</span>
                      <span>{skill.level}%</span>
                    </div>
                    <div className="bg-slate-700 rounded-full h-3">
                      <motion.div
                        className={`h-3 rounded-full ${skill.color}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <motion.a
                href="https://www.linkedin.com/in/oscardeveloper/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Linkedin size={18} />
                <span>{t('about.linkedin')}</span>
              </motion.a>
              
              <motion.a
                href="mailto:ortegaoscar14@gmail.com"
                className="flex items-center space-x-2 px-4 py-2 border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <Mail size={18} />
                <span>{t('about.contact')}</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;