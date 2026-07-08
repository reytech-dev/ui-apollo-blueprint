import { Routes, Route, Navigate, Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookList } from './components/BookList';
import { CreateBook } from './components/CreateBook';
import { LanguageSwitcher } from './components/LanguageSwitcher';

function Layout() {
  const { t } = useTranslation();

  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '1rem' }}>
      <h1>{t('app.title')}</h1>
      <LanguageSwitcher />
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/books" style={{ marginRight: '1rem' }}>
          {t('nav.booksList')}
        </Link>
        <Link to="/books/create">{t('nav.createBook')}</Link>
      </nav>
      <Outlet />
    </main>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/books" replace />} />
        <Route path="books" element={<BookList />} />
        <Route path="books/create" element={<CreateBook />} />
      </Route>
    </Routes>
  );
}
