import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import ExperienceSection from './components/ExperienceSection';
import BlogSection from './components/BlogSection';
import BlogPost from './components/BlogPost';
import Login from './components/Login';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import { LanguageProvider } from './contexts/LanguageContext';
import './App.css';
import './i18n';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

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
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
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
          
          <Route path="/blog" element={
            <MainLayout>
              <BlogSection />
            </MainLayout>
          } />
          
          <Route path="/blog/:slug" element={
            <MainLayout>
              <BlogPost />
            </MainLayout>
          } />
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;