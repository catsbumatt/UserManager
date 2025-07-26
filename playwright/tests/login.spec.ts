import { test, expect } from '@playwright/test';

const username = `loginUser${Date.now()}`;
const password = 'password123';

test.beforeAll(async ({ request }) => {
  await request.post('http://localhost:5000/api/register', {
    data: { username, password }
  });
});

test('Login with correct credentials', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[placeholder="Username"]', username);
  await page.fill('input[placeholder="Password"]', password);
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText(username)).toBeVisible();
});

test('Fail to login with incorrect password', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[placeholder="Username"]', username);
  await page.fill('input[placeholder="Password"]', 'wrongpassword');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('/');
});

test('Fail to login with nonexistent user', async ({ page }) => {
  await page.goto('/');
  await page.fill('input[placeholder="Username"]', 'ghostuser');
  await page.fill('input[placeholder="Password"]', 'ghostpass');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('/');
});