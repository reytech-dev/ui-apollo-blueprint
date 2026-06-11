import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CreateBookDocument, BooksDocument } from '../graphql/generated';

export function CreateBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishedYear, setPublishedYear] = useState('');

  const [createBook, { loading, error }] = useMutation(CreateBookDocument, {
    refetchQueries: [{ query: BooksDocument }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;
    try {
      await createBook({
        variables: {
          title: title.trim(),
          author: author.trim(),
          publishedYear: publishedYear ? parseInt(publishedYear, 10) : null,
        },
      });
      setTitle('');
      setAuthor('');
      setPublishedYear('');
    } catch {
      // error surfaced via the error property from useMutation
    }
  };

  return (
    <section>
      <h2>Add Book</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
      >
        <label>
          Title
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Author
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </label>
        <label>
          Published Year
          <input
            type="number"
            value={publishedYear}
            onChange={(e) => setPublishedYear(e.target.value)}
          />
        </label>
        <button type="submit" disabled={loading} style={{ alignSelf: 'flex-start' }}>
          {loading ? 'Creating...' : 'Create Book'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </section>
  );
}
