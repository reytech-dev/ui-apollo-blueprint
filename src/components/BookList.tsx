import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { BooksDocument } from '../graphql/generated';

export function BookList() {
  const { t } = useTranslation();
  const { loading, error, data } = useQuery(BooksDocument);

  if (loading) return <p>{t('books.loading')}</p>;
  if (error) return <p>Error: {error.message}</p>;

  const books = data?.books ?? [];

  if (books.length === 0) {
    return <p>{t('books.empty')}</p>;
  }

  return (
    <section>
      <h2>{t('books.heading')}</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.publishedYear
              ? t('books.detail', {
                  title: book.title,
                  author: book.author,
                  year: book.publishedYear,
                })
              : t('books.detailNoYear', { title: book.title, author: book.author })}
          </li>
        ))}
      </ul>
    </section>
  );
}
