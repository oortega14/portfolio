import { useCallback, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

export const useStableApiWithLang = () => {
  const { i18n } = useTranslation();
  const currentLangRef = useRef(i18n.language);
  
  // Actualizar la referencia sin causar re-render
  currentLangRef.current = i18n.language;

  // Crear funciones estables que no cambien en cada render
  const stableApi = useMemo(() => {
    const apiGet = async (url, config = {}) => {
      const params = {
        lang: currentLangRef.current,
        ...config.params
      };
      console.log(`📡 API GET: ${url} with lang: ${currentLangRef.current}`);
      return api.get(url, { ...config, params });
    };

    const apiPost = async (url, data, config = {}) => {
      const params = {
        lang: currentLangRef.current,
        ...config.params
      };
      return api.post(url, data, { ...config, params });
    };

    const apiPut = async (url, data, config = {}) => {
      const params = {
        lang: currentLangRef.current,
        ...config.params
      };
      return api.put(url, data, { ...config, params });
    };

    const apiDelete = async (url, config = {}) => {
      const params = {
        lang: currentLangRef.current,
        ...config.params
      };
      return api.delete(url, { ...config, params });
    };

    return { apiGet, apiPost, apiPut, apiDelete };
  }, []); // Sin dependencias para mantener estabilidad

  return {
    ...stableApi,
    currentLang: i18n.language
  };
};