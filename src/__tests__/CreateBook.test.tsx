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

  it('shows validation errors on submit with empty required fields', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <CreateBook />
      </MockedProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Create Book' }));

    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Author is required')).toBeInTheDocument();
  });

  it('shows validation error for out-of-range year', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <CreateBook />
      </MockedProvider>,
    );

    await user.type(screen.getByLabelText('Title'), 'Test');
    await user.type(screen.getByLabelText('Author'), 'Test Author');
    await user.type(screen.getByLabelText('Published Year'), '1000');
    await user.click(screen.getByRole('button', { name: 'Create Book' }));

    expect(await screen.findByText('Invalid year')).toBeInTheDocument();
  });

  it('shows validation error on blur for empty title', async () => {
    const user = userEvent.setup();

    render(
      <MockedProvider>
        <CreateBook />
      </MockedProvider>,
    );

    const titleInput = screen.getByLabelText('Title');
    await user.click(titleInput);
    await user.tab();

    expect(await screen.findByText('Title is required')).toBeInTheDocument();
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
