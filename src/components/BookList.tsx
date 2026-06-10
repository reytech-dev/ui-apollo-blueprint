import { useQuery } from '@apollo/client';
import { BOOKS_QUERY } from '../graphql';

interface Book {
  id: string;
  title: string;
  author: string;
  publishedYear?: number | null;
}

export function BookList() {
  const { loading, error, data } = useQuery<{ books: Book[] }>(BOOKS_QUERY);

  if (loading) return <p>Loading books...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const books = data?.books ?? [];

  if (books.length === 0) {
    return <p>No books found. Create one above.</p>;
  }

  return (
    <section>
      <h2>Books</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author}
            {book.publishedYear ? ` (${book.publishedYear})` : ''}
          </li>
        ))}
      </ul>
    </section>
  );
}
