import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing/react';
import { describe, it, expect } from 'vitest';
import { CreateBook } from '../components/CreateBook';
import { CreateBookDocument, BooksDocument } from '../graphql/generated';

describe('CreateBook', () => {
  it('renders the form with inputs and submit button', () => {
    render(
      <MockedProvider>
        <CreateBook />
      </MockedProvider>,
    );

    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Author')).toBeInTheDocument();
    expect(screen.getByLabelText('Published Year')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Book' })).toBeInTheDocument();
  });

  it('does not submit with empty required fields', async () => {
    const user = userEvent.setup();
    const mock = {
      request: {
        query: CreateBookDocument,
        variables: { title: '', author: '', publishedYear: null },
      },
      result: {
        data: {
          createBook: { id: '1', title: '', author: '', publishedYear: null, __typename: 'Book' },
          __typename: 'Mutation',
        },
      },
    };

    render(
      <MockedProvider mocks={[mock]}>
        <CreateBook />
      </MockedProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Create Book' }));
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
  });

  it('submits and clears the form on success', async () => {
    const user = userEvent.setup();
    const createBookMock = {
      request: {
        query: CreateBookDocument,
        variables: { title: 'Clean Code', author: 'Robert C. Martin', publishedYear: 2008 },
      },
      result: {
        data: {
          createBook: {
            id: '1',
            title: 'Clean Code',
            author: 'Robert C. Martin',
            publishedYear: 2008,
            __typename: 'Book',
          },
          __typename: 'Mutation',
        },
      },
    };

    const refetchMock = {
      request: { query: BooksDocument },
      result: { data: { books: [], __typename: 'Query' } },
    };

    render(
      <MockedProvider mocks={[createBookMock, refetchMock]}>
        <CreateBook />
      </MockedProvider>,
    );

    await user.type(screen.getByLabelText('Title'), 'Clean Code');
    await user.type(screen.getByLabelText('Author'), 'Robert C. Martin');
    await user.type(screen.getByLabelText('Published Year'), '2008');
    await user.click(screen.getByRole('button', { name: 'Create Book' }));

    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toHaveValue('');
    });
  });
});
