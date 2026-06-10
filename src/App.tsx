import { BookList } from './components/BookList';
import { CreateBook } from './components/CreateBook';

export function App() {
  return (
    <main style={{ maxWidth: 600, margin: '0 auto', padding: '1rem' }}>
      <h1>Bookstore</h1>
      <CreateBook />
      <BookList />
    </main>
  );
}
