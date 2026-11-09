import { test, expect } from '@playwright/test';

const password = 'local-loading-regression-password';
let accountNumber = 0;

function decode(message) {
  try {
    const text = message.toString();
    const value = JSON.parse(text.startsWith('a[') ? text.slice(1) : text);
    return Array.isArray(value) ? value.flatMap(decode) : [value];
  } catch {
    return [];
  }
}

// Delay actual DDP requests so the intermediate screens can be checked.
async function controlMethods(page) {
  const next = new Map();
  const counts = new Map();
  await page.routeWebSocket(/websocket/, (socket) => {
    const server = socket.connectToServer();
    socket.onMessage((message) => {
      const method = decode(message).find((item) => item.msg === 'method');
      if (method)
        counts.set(method.method, (counts.get(method.method) || 0) + 1);
      const gate = method && next.get(method.method);
      if (!gate) return server.send(message);
      next.delete(method.method);
      gate.release = () => server.send(message);
      gate.fail = () => {
        const send = (value) => {
          const json = JSON.stringify(value);
          socket.send(
            message.toString().startsWith('[')
              ? `a${JSON.stringify([json])}`
              : json
          );
        };
        send({
          msg: 'result',
          id: method.id,
          error: { error: 500, reason: 'Simulated board request failure' }
        });
        send({ msg: 'updated', methods: [method.id] });
      };
    });
  });
  return {
    count: (name) => counts.get(name) || 0,
    hold: (name) => {
      const gate = {};
      gate.wait = () =>
        expect
          .poll(() => Boolean(gate.release), { timeout: 15_000 })
          .toBe(true);
      next.set(name, gate);
      return gate;
    }
  };
}

async function signUp(page) {
  const email = `loading-${Date.now()}-${accountNumber++}@example.invalid`;
  await page.goto('/signup');
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page
    .getByRole('button', { name: 'Create Account', exact: true })
    .click();
  return email;
}

async function ready(page) {
  await expect(page.locator('#home')).toBeVisible();
  await expect(page.locator('#loading')).toHaveCount(0);
}

async function logOut(page) {
  // Also exercise logout initiated outside the Navbar (for example another tab).
  await page.evaluate(
    () =>
      new Promise((resolve, reject) =>
        window.Meteor.logout((error) => (error ? reject(error) : resolve()))
      )
  );
  await expect(
    page.getByRole('button', { name: 'Log In', exact: true })
  ).toBeVisible();
}

async function logIn(page, email, loginPassword = password) {
  await page.getByRole('textbox', { name: 'Email', exact: true }).fill(email);
  await page.getByLabel('Password', { exact: true }).fill(loginPassword);
  await page.getByRole('button', { name: 'Log In', exact: true }).click();
}

async function rememberAnimation(page) {
  await expect(page.locator('#loading')).toBeVisible();
  await page.waitForFunction(
    () => document.querySelector('#loading img')?.getAnimations().length === 1
  );
  await page.evaluate(() => {
    const loader = document.querySelector('#loading');
    const image = loader.querySelector('img');
    const animation = image.getAnimations()[0];
    const probe = {
      loader,
      image,
      animation,
      time: animation.currentTime,
      removed: false
    };
    probe.observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const removed of record.removedNodes) {
          if (removed.contains(image)) probe.removed = true;
        }
      }
    });
    probe.observer.observe(document.getElementById('react-target'), {
      childList: true,
      subtree: true
    });
    window.loaderProbe = probe;
  });
}

async function expectContinuousAnimation(page) {
  await expect(page.locator('#home')).toBeVisible();
  await expect(page.locator('#loading')).toHaveCount(1);
  await expect(page.locator('[aria-busy="true"]')).toHaveAttribute('inert', '');
  await expect
    .poll(() =>
      page.evaluate(() => {
        const probe = window.loaderProbe;
        return (
          probe.loader === document.querySelector('#loading') &&
          probe.image === document.querySelector('#loading img') &&
          probe.animation === probe.image.getAnimations()[0] &&
          probe.animation.currentTime > probe.time &&
          !probe.removed
        );
      })
    )
    .toBe(true);
  await page.evaluate(() => window.loaderProbe.observer.disconnect());
}

for (const viewport of [
  { width: 1280, height: 900 },
  { width: 390, height: 844 }
]) {
  test(`one animation spans login and board loading at ${viewport.width}px`, async ({
    page
  }) => {
    await page.setViewportSize(viewport);
    const control = await controlMethods(page);
    const email = await signUp(page);
    await ready(page);
    await logOut(page);

    for (const flow of ['manual', 'restored', 'reauthenticated']) {
      const previousRequests = control.count('getUserData');
      const login = control.hold('login');
      const board = control.hold('getUserData');
      if (flow === 'manual') await logIn(page, email);
      else if (flow === 'restored') await page.reload();
      else {
        await page.evaluate(
          ({ email, password }) =>
            window.Meteor.loginWithPassword({ email }, password, () => {}),
          { email, password }
        );
      }
      await login.wait();
      await rememberAnimation(page);
      login.release();
      await board.wait();
      await expectContinuousAnimation(page);
      expect(control.count('getUserData')).toBe(previousRequests + 1);
      board.release();
      await ready(page);
    }

    const save = control.hold('createTodolist');
    await page.getByText('new toodlist', { exact: true }).click();
    await save.wait();
    await expect(page.locator('#loading')).toHaveCount(0);
    save.release();
    await expect(
      page.getByRole('heading', { name: 'my toodlist' })
    ).toBeVisible();
  });
}

test('failed login and board requests release the loader, and refresh can recover', async ({
  page
}) => {
  const control = await controlMethods(page);
  const email = await signUp(page);
  await ready(page);
  await logOut(page);
  const login = control.hold('login');
  await logIn(page, email, 'wrong-password');
  await login.wait();
  await expect(page.locator('#loading')).toBeVisible();
  login.release();
  await expect(page.getByText('Email or password is incorrect.')).toBeVisible();
  await expect(page.locator('#loading')).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Log In', exact: true })
  ).toBeEnabled();

  const board = control.hold('getUserData');
  await logIn(page, email);
  await board.wait();
  board.fail();
  await expect(
    page.getByText(
      'Your board could not be loaded. Please refresh to try again.'
    )
  ).toBeVisible();
  await expect(page.locator('#loading')).toHaveCount(0);
  await page.reload();
  await ready(page);
});

test('a late board response is ignored after logging back into the same account', async ({
  page
}) => {
  const email = await signUp(page);
  await ready(page);
  await page.getByText('new toodlist', { exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'my toodlist' })
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        async () =>
          (await window.Meteor.callAsync('getUserData')).columnOrder.length
      )
    )
    .toBe(1);
  await logOut(page);
  await page.evaluate(() => {
    const callAsync = window.Meteor.callAsync.bind(window.Meteor);
    window.Meteor.callAsync = (name, ...args) => {
      if (name !== 'getUserData') return callAsync(name, ...args);
      window.Meteor.callAsync = callAsync;
      // Complete DDP normally, then delay the application's promise. Holding the
      // wire response would also block Meteor's subsequent authentication calls.
      return callAsync(name, ...args).then(
        (data) =>
          new Promise((resolve) => {
            window.releaseHeldBoard = () => resolve(data);
          })
      );
    };
  });
  await logIn(page, email);
  await page.waitForFunction(() => Boolean(window.releaseHeldBoard));
  await expect(page.locator('#loading')).toBeVisible();
  await logOut(page);
  await logIn(page, email);
  await ready(page);
  await page.getByRole('heading', { name: 'my toodlist' }).click();
  const titleInput = page
    .locator('[data-rfd-draggable-id]')
    .first()
    .locator('input');
  await titleInput.fill('Current session board');
  await titleInput.press('Enter');
  await expect
    .poll(() =>
      page.evaluate(async () => {
        const board = await window.Meteor.callAsync('getUserData');
        return board.columns[board.columnOrder[0]].title;
      })
    )
    .toBe('Current session board');
  await page.evaluate(() => window.releaseHeldBoard());
  // A round trip lets the earlier released response be processed before checking.
  await page.evaluate(() =>
    window.Meteor.callAsync('getUserData').then(() => undefined)
  );
  await expect(
    page.getByRole('heading', { name: 'Current session board' })
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'my toodlist' })).toHaveCount(
    0
  );
  await expect(page.locator('#loading')).toHaveCount(0);
});

test('switching accounts clears the previous board and waits for the new one', async ({
  page
}) => {
  const control = await controlMethods(page);
  await signUp(page);
  await ready(page);
  await page.getByText('new toodlist', { exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'my toodlist' })
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        async () =>
          (await window.Meteor.callAsync('getUserData')).columnOrder.length
      )
    )
    .toBe(1);
  await logOut(page);
  const board = control.hold('getUserData');
  await signUp(page);
  await board.wait();
  await expect(page.locator('#loading')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'my toodlist' })).toHaveCount(
    0
  );
  board.release();
  await ready(page);
  await expect(page.locator('[data-rfd-draggable-id]')).toHaveCount(0);
});
