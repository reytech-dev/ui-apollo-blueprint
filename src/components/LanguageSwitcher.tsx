import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
] as const;

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label>
        {t('language.switch')}
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
