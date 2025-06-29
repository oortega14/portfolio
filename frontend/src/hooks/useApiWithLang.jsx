import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

export const useApiWithLang = () => {
  const { i18n } = useTranslation();
  const lastLangRef = useRef(i18n.language);

  const apiGet = useCallback(async (url, config = {}) => {
    const params = {
      lang: i18n.language,
      ...config.params
    };

    return api.get(url, { ...config, params });
  }, [i18n.language]);

  const apiPost = useCallback(async (url, data, config = {}) => {
    const params = {
      lang: i18n.language,
      ...config.params
    };

    return api.post(url, data, { ...config, params });
  }, [i18n.language]);

  const apiPut = useCallback(async (url, data, config = {}) => {
    const params = {
      lang: i18n.language,
      ...config.params
    };

    return api.put(url, data, { ...config, params });
  }, [i18n.language]);

  const apiDelete = useCallback(async (url, config = {}) => {
    const params = {
      lang: i18n.language,
      ...config.params
    };

    return api.delete(url, { ...config, params });
  }, [i18n.language]);

  // Verificar si realmente cambió el idioma
  const hasLanguageChanged = () => {
    const changed = lastLangRef.current !== i18n.language;
    lastLangRef.current = i18n.language;
    return changed;
  };

  return {
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
    currentLang: i18n.language,
    hasLanguageChanged
  };
};