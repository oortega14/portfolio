import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Menu, X, User, Code, Briefcase, BookOpen, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { changeLanguage, navigateWithLang } = useLanguage();

  // Determinar la pestaña activa basada en la ruta actual
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/projects') return 'projects';
    if (path === '/experience') return 'experience';
    if (path.startsWith('/blog')) return 'blog';
    return 'home';
  };

  const activeTab = getActiveTab();

  const tabs = [
    { id: 'home', label: t('nav.home'), icon: User, path: '/' },
    { id: 'projects', label: t('nav.projects'), icon: Code, path: '/projects' },
    { id: 'experience', label: t('nav.experience'), icon: Briefcase, path: '/experience' },
    { id: 'blog', label: t('nav.blog'), icon: BookOpen, path: '/blog' }
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    changeLanguage(newLang);
  };

  const handleNavigation = (tab) => {
    navigateWithLang(tab.path);
  };

  const handleLogoClick = () => {
    navigateWithLang('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.button
            onClick={handleLogoClick}
            className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Oscar's Portfolio
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => handleNavigation(tab)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${activeTab === tab.id
                      ? 'text-blue-400 bg-blue-400/10'
                      : 'text-slate-300 hover:text-blue-400'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
            {/* Language Switch Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg text-slate-300 hover:text-blue-400 transition-colors border border-slate-700 ml-4"
              aria-label="Change language"
            >
              <Globe size={18} />
              <span className="text-sm uppercase">{i18n.language === 'en' ? 'ES' : 'EN'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {/* Language Switch Button (Mobile) */}
            <button
              onClick={toggleLanguage}
              className="mr-2 text-slate-300 hover:text-blue-400"
              aria-label="Change language"
            >
              <Globe size={22} />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-blue-400"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-700"
            >
              <div className="py-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        handleNavigation(tab);
                        setIsMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg transition-colors ${activeTab === tab.id
                          ? 'text-blue-400 bg-blue-400/10'
                          : 'text-slate-300 hover:text-blue-400'
                        }`}
                    >
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;