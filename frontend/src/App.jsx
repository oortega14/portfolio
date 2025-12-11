import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import ExperienceSection from './components/ExperienceSection';
import Footer from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';
import './App.css';
import './i18n';

const MainLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="App min-h-screen bg-slate-900 text-white">
      <Navigation />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname + location.search}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={location.pathname !== '/' ? 'pt-16' : ''}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <Routes>
          {/* Rutas principales */}
          <Route path="/" element={
            <MainLayout>
              <HeroSection />
              <AboutSection />
            </MainLayout>
          } />

          <Route path="/projects" element={
            <MainLayout>
              <ProjectsSection />
            </MainLayout>
          } />

          <Route path="/experience" element={
            <MainLayout>
              <ExperienceSection />
            </MainLayout>
          } />
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;