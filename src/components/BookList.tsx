import { useQuery } from '@apollo/client/react';
import { BooksDocument } from '../graphql/generated';

export function BookList() {
  const { loading, error, data } = useQuery(BooksDocument);

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
