import { test, expect } from '@playwright/test';

test('new users can save a board, reload, sign out and sign back in', async ({
  page
}, testInfo) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const email = `revival-${Date.now()}@example.invalid`;
  const password = 'local-browser-test-password';
  await page.goto('/signup');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page
    .getByRole('button', { name: 'Create Account', exact: true })
    .click();
  await expect(page.locator('#home')).toBeVisible();
  await expect(page.locator('#loading')).toHaveCount(0);
  await expect(page.locator('[data-rfd-draggable-id]')).toHaveCount(0);

  await page.getByText('new toodlist', { exact: true }).click();
  const list = page.locator('[data-rfd-draggable-id]').first();
  await expect(
    list.getByRole('heading', { name: 'my toodlist' })
  ).toBeVisible();
  await list.getByRole('heading', { name: 'my toodlist' }).click();
  await list.locator('input').fill('Revived project');
  await list.locator('input').press('Enter');
  await list.getByText('new item', { exact: true }).click();
  await list.locator('input.todo-add-input').fill('First task');
  await list.locator('input.todo-add-input').press('Enter');
  await list.locator('input.todo-add-input').fill('Second task');
  await list.locator('input.todo-add-input').press('Enter');
  await list.locator('input.todo-add-input').blur();
  await expect(
    list.locator('.todo').filter({ hasText: 'First task' })
  ).toBeVisible();
  await expect(
    list.locator('.todo').filter({ hasText: 'Second task' })
  ).toBeVisible();

  // Wait for the method queue to reach the server before forcing a navigation.
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const data = await window.Meteor.callAsync('getUserData');
        return Object.keys(data.todos).length;
      })
    )
    .toBe(2);
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Revived project' })
  ).toBeVisible();
  await expect(page.getByText('First task', { exact: true })).toBeVisible();

  // Exercise the replacement drag-and-drop library and its persisted order.
  await page.locator('.todo').filter({ hasText: 'First task' }).focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowDown', { delay: 200 });
  await page.keyboard.press('Space');
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const data = await window.Meteor.callAsync('getUserData');
        return data.columns[data.columnOrder[0]].todoIds.map(
          (id) => data.todos[id].content
        );
      })
    )
    .toEqual(['Second task', 'First task']);

  const firstTodo = page.locator('.todo').filter({ hasText: 'First task' });
  await firstTodo.getByText('edit', { exact: true }).click();
  await page.locator('.todo input').fill('Edited task');
  await page.locator('.todo input').press('Enter');
  await expect(page.getByText('Edited task', { exact: true })).toBeVisible();

  await page.locator('.ant-avatar').first().click();
  await page.getByRole('menuitem', { name: 'Settings', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('dialog').locator('.ant-radio-wrapper').nth(1).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Close', exact: true })
    .click();
  await expect(list).toHaveClass(/blue/);

  await page.screenshot({
    path: testInfo.outputPath('board.png'),
    fullPage: true
  });

  await page.locator('.ant-avatar').first().click();
  await page.getByRole('menuitem', { name: 'Log out', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Log In', exact: true })
  ).toBeVisible();
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Log In', exact: true }).click();
  await expect(page.getByText('Edited task', { exact: true })).toBeVisible();
  await expect(list).toHaveClass(/blue/);
  await page
    .locator('.todo')
    .filter({ hasText: 'Second task' })
    .locator('a')
    .last()
    .click();
  await expect(page.getByText('Second task', { exact: true })).toHaveCount(0);
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const data = await window.Meteor.callAsync('getUserData');
        return Object.keys(data.todos).length;
      })
    )
    .toBe(1);
  expect(errors).toEqual([]);
});

test('signed-out DDP requests cannot read or modify a board', async ({
  page
}) => {
  await page.goto('/login');
  await expect(
    page.getByRole('button', { name: 'Log In', exact: true })
  ).toBeVisible();
  const results = await page.evaluate(async () => {
    const results = [];
    for (const [name, args] of [
      ['getUserData', ['another-user']],
      [
        'createTodolist',
        [{ id: 'intruder', title: 'Intruder', color: 'white', todoIds: [] }]
      ],
      ['updateAvatarSrc', ['https://example.com/image.png']]
    ]) {
      try {
        await window.Meteor.callAsync(name, ...args);
        results.push('allowed');
      } catch (error) {
        results.push(error.error);
      }
    }
    return results;
  });
  expect(results).toEqual([401, 401, 401]);
});

test('the sign-in screen fits a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/login');
  await expect(
    page.getByRole('button', { name: 'Log In', exact: true })
  ).toBeVisible();
  const dimensions = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    viewport: innerWidth
  }));
  expect(dimensions.width).toBeLessThanOrEqual(dimensions.viewport);
});
