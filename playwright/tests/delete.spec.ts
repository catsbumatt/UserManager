import { test, expect } from '@playwright/test';

test('Delete a user after login', async ({ page }) => {
  const username = `deleteUser${Date.now()}`;
  const password = 'password123';

  // Register
  await page.goto('/register');
  await page.fill('input[placeholder="Username"]', username);
  await page.fill('input[placeholder="Password"]', password);
  await page.getByRole('button', { name: 'Register' }).click();

  // Login
  await page.goto('/');
  await page.fill('input[placeholder="Username"]', username);
  await page.fill('input[placeholder="Password"]', password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('/dashboard');

  // Delete
  const userRow = page.locator('li', { hasText: username });
  await userRow.getByRole('button', { name: 'Delete' }).click();

  await expect(page.locator('li', { hasText: username })).toHaveCount(0);
});

test('Prevent deletion if not logged in', async ({ request }) => {
  const username = `notLoggedIn${Date.now()}`;
  const password = 'password123';

  const registerResponse = await request.post('http://localhost:5000/api/register', {
    data: { username, password }
  });

  // Try deleting without login
  const deleteResponse = await request.delete(`http://localhost:5000/api/users/1`, {
    // No cookies/session attached
  });

  expect(deleteResponse.status()).toBe(401);
});