import { useRouter } from 'next/router';
import es from '@/locales/es.json';
import en from '@/locales/en.json';

type TranslationKey = string;
type Translations = typeof es;

const translations: Record<string, Translations> = {
  es,
  en,
};

export function useTranslation() {
  const router = useRouter();
  const { locale = 'es' } = router;

  const t = (key: TranslationKey): string => {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to Spanish if key not found
        value = translations['es'];
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if translation not found
          }
        }
        break;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return { t, locale };
}
