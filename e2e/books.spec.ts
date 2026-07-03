import { test, expect } from '@playwright/test';

test.describe('Bookstore', () => {
  test('can create and view a book', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Bookstore' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Books' })).toBeVisible();

    await page.getByLabel('Title').fill('Clean Code');
    await page.getByLabel('Author').fill('Robert C. Martin');
    await page.getByLabel('Published Year').fill('2008');
    await page.getByRole('button', { name: 'Create Book' }).click();

    await expect(page.getByText('Clean Code by Robert C. Martin (2008)')).toBeVisible();
  });

  test('shows validation errors for empty form', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'Create Book' }).click();

    await expect(page.getByText('Title is required')).toBeVisible();
    await expect(page.getByText('Author is required')).toBeVisible();
  });

  test('switches language to German', { tag: '@smoke' }, async ({ page }) => {
    await page.goto('/');

    await page.getByLabel('Language').selectOption('de');

    await expect(page.getByRole('heading', { name: 'Buchhandlung' })).toBeVisible();
    await expect(page.getByLabel('Titel')).toBeVisible();
    await expect(page.getByLabel('Autor')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Buch erstellen' })).toBeVisible();
  });
});
