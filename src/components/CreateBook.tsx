import { useMutation } from '@apollo/client/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CreateBookDocument, BooksDocument } from '../graphql/generated';
import { bookSchema, type BookFormData } from '../schemas/book.schema';
import { useNotificationStore } from '../stores/notification.store';

export function CreateBook() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const addNotification = useNotificationStore((state) => state.addNotification);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    mode: 'onBlur',
  });

  const [createBook, { loading, error }] = useMutation(CreateBookDocument, {
    refetchQueries: [{ query: BooksDocument }],
  });

  const onSubmit = async (data: BookFormData) => {
    try {
      await createBook({
        variables: {
          title: data.title,
          author: data.author,
          publishedYear: data.publishedYear ? parseInt(data.publishedYear, 10) : null,
        },
      });
      addNotification('success', t('notification.bookCreated'));
      navigate('/books');
    } catch {
      addNotification('error', t('notification.bookCreateFailed'));
    }
  };

  return (
    <section>
      <h2>{t('createBook.heading')}</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}
      >
        <label>
          {t('createBook.title')}
          <input type="text" {...register('title')} />
        </label>
        {errors.title && <p style={{ color: 'red', margin: 0 }}>{t(errors.title.message!)}</p>}

        <label>
          {t('createBook.author')}
          <input type="text" {...register('author')} />
        </label>
        {errors.author && <p style={{ color: 'red', margin: 0 }}>{t(errors.author.message!)}</p>}

        <label>
          {t('createBook.publishedYear')}
          <input type="number" {...register('publishedYear')} />
        </label>
        {errors.publishedYear && (
          <p style={{ color: 'red', margin: 0 }}>{t(errors.publishedYear.message!)}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}
        >
          {loading ? t('createBook.submitting') : t('createBook.submit')}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </section>
  );
}
