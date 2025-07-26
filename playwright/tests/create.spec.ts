import { test, expect } from '@playwright/test';

test('Register new account successfully', async ({ page }) => {
  await page.goto('/register');
  const username = `user${Date.now()}`;
  await page.fill('input[placeholder="Username"]', username);
  await page.fill('input[placeholder="Password"]', 'password123');
  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page).toHaveURL('/');
});

test('Fail to register with existing username', async ({ request, page }) => {
  const existingUser = 'duplicateUser';
  await request.post('http://localhost:5000/api/register', {
    data: { username: existingUser, password: 'password123' }
  });

  await page.goto('/register');
  await page.fill('input[placeholder="Username"]', existingUser);
  await page.fill('input[placeholder="Password"]', 'password123');
  await page.getByRole('button', { name: 'Register' }).click();

  // You may want to check for an error alert if you show one
  // For now, we expect it to stay on the same page
  await expect(page).toHaveURL('/register');
});

test('Fail to register with empty fields', async ({ page }) => {
  await page.goto('/register');
  await page.getByRole('button', { name: 'Register' }).click();

  // Should still be on the register page, possibly show an alert
  await expect(page).toHaveURL('/register');
});