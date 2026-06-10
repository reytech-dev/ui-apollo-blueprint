import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';

export const client = new ApolloClient({
  link: new HttpLink({ uri: '/graphql' }),
  cache: new InMemoryCache(),
});

export const BOOKS_QUERY = gql`
  query Books {
    books {
      id
      title
      author
      publishedYear
    }
  }
`;

export const CREATE_BOOK_MUTATION = gql`
  mutation CreateBook($title: String!, $author: String!, $publishedYear: Int) {
    createBook(title: $title, author: $author, publishedYear: $publishedYear) {
      id
      title
      author
      publishedYear
    }
  }
`;
