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

    await expect(page.getByText('Clean Code')).toBeVisible();
    await expect(page.getByText(/Robert C. Martin/)).toBeVisible();
    await expect(page.getByText('(2008)')).toBeVisible();
  });
});
