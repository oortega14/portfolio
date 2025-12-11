import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Github, Linkedin } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-700 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-slate-400 mb-6">
              {t('footer.cta')}
            </p>
            
            <div className="flex justify-center space-x-6 mb-6">
              <motion.a
                href="mailto:ortegaoscar14@gmail.com"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Mail size={24} />
              </motion.a>
              <motion.a
                href="https://github.com/oortega14"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Github size={24} />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/oscardeveloper/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Linkedin size={24} />
              </motion.a>
            </div>
            
            <p className="text-slate-500 text-sm">
              {t('footer.copyright')}
            </p>
          </motion.div>
        </div>
      </footer>
  )
}

export default Footer