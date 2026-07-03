import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing/react';
import { describe, it, expect } from 'vitest';
import { BookList } from '../components/BookList';
import { BooksDocument } from '../graphql/generated';

describe('BookList', () => {
  it('shows loading state', () => {
    const mock = {
      request: { query: BooksDocument },
      result: { data: { books: [] } },
      delay: Infinity,
    };

    render(
      <MockedProvider mocks={[mock]}>
        <BookList />
      </MockedProvider>,
    );
    expect(screen.getByText('Loading books...')).toBeInTheDocument();
  });

  it('shows empty state', async () => {
    const mock = {
      request: { query: BooksDocument },
      result: { data: { books: [], __typename: 'Query' } },
    };

    render(
      <MockedProvider mocks={[mock]}>
        <BookList />
      </MockedProvider>,
    );

    expect(await screen.findByText('No books found. Create one above.')).toBeInTheDocument();
  });

  it('renders a list of books', async () => {
    const mock = {
      request: { query: BooksDocument },
      result: {
        data: {
          books: [
            {
              id: '1',
              title: 'Clean Code',
              author: 'Robert C. Martin',
              publishedYear: 2008,
              __typename: 'Book',
            },
            {
              id: '2',
              title: 'Refactoring',
              author: 'Martin Fowler',
              publishedYear: null,
              __typename: 'Book',
            },
          ],
          __typename: 'Query',
        },
      },
    };

    render(
      <MockedProvider mocks={[mock]}>
        <BookList />
      </MockedProvider>,
    );

    expect(
      await screen.findByText('Clean Code by Robert C. Martin (2008)'),
    ).toBeInTheDocument();
    expect(screen.getByText('Refactoring by Martin Fowler')).toBeInTheDocument();
  });

  it('shows error state', async () => {
    const mock = {
      request: { query: BooksDocument },
      error: new Error('Network error'),
    };

    render(
      <MockedProvider mocks={[mock]}>
        <BookList />
      </MockedProvider>,
    );

    expect(await screen.findByText('Error: Network error')).toBeInTheDocument();
  });
});
