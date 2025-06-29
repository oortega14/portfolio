import { createContext, useMemo, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);
  const isUpdatingRef = useRef(false);
  const initTimeoutRef = useRef(null);

  // Obtener idioma de la URL
  const getCurrentLanguage = useCallback(() => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get('lang') || 'en';
  }, [location.search]);

  // Cambiar idioma y actualizar URL - función estable
  const changeLanguage = useCallback((newLang) => {
    if (isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    // Cambiar en i18next
    i18n.changeLanguage(newLang);

    // Actualizar URL
    const currentSearch = new URLSearchParams(location.search);
    currentSearch.set('lang', newLang);
    navigate(`${location.pathname}?${currentSearch.toString()}`, { replace: true });

    // Reset flag después de un delay
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 200);
  }, [i18n, location.pathname, location.search, navigate]);

  // Navegar manteniendo el idioma - función estable
  const navigateWithLang = useCallback((path) => {
    const currentSearch = new URLSearchParams(location.search);
    currentSearch.set('lang', i18n.language);
    navigate(`${path}?${currentSearch.toString()}`);
  }, [i18n.language, location.search, navigate]);

  // Inicialización única y estable
  useEffect(() => {
    if (isInitialized) return;

    // Cancelar timeout anterior si existe
    if (initTimeoutRef.current) {
      clearTimeout(initTimeoutRef.current);
    }

    // Delay para evitar múltiples inicializaciones
    initTimeoutRef.current = setTimeout(() => {
      const langFromUrl = getCurrentLanguage();

      if (langFromUrl && ['en', 'es'].includes(langFromUrl)) {
        if (i18n.language !== langFromUrl) {
          i18n.changeLanguage(langFromUrl);
        }
      } else {
        // Si no hay lang en la URL, agregarlo sin causar re-render
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('lang', i18n.language);
        navigate(`${location.pathname}?${urlParams.toString()}`, { replace: true });
      }

      setIsInitialized(true);
    }, 100);

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, [getCurrentLanguage, i18n, location.pathname, navigate, isInitialized]);

  // Crear valor estable del contexto
  const contextValue = useMemo(() => ({
    currentLanguage: getCurrentLanguage(),
    changeLanguage,
    navigateWithLang,
    isInitialized
  }), [getCurrentLanguage, changeLanguage, navigateWithLang, isInitialized]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};