import { useTranslation } from 'react-i18next';
import { BookList } from './components/BookList';
import { CreateBook } from './components/CreateBook';
import { LanguageSwitcher } from './components/LanguageSwitcher';

export function App() {
  const { t } = useTranslation();

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '1rem' }}>
      <h1>{t('app.title')}</h1>
      <LanguageSwitcher />
      <CreateBook />
      <BookList />
    </main>
  );
}
