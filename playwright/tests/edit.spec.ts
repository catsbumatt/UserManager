import { test, expect } from '@playwright/test';

test('Edit a user from the dashboard', async ({ page }) => {
  const username = `editme${Date.now()}`;
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

  // Find the user's list item
  const userRow = page.locator('li', { hasText: username });

  // Click Edit
  await userRow.getByRole('button', { name: 'Edit' }).click();

  // Change the username
  const updatedUsername = `${username}_updated`;
  const input = page.locator('input');
  await input.fill(updatedUsername);

  // Save
  await page.getByRole('button', { name: 'Save' }).click();

  // Confirm new username is visible
  await expect(page.locator('li', { hasText: updatedUsername })).toBeVisible();
});