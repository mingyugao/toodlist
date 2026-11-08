import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const deployment = JSON.parse(
  readFileSync(new URL('../galaxy.json', import.meta.url))
);
const target = process.argv[2] || deployment.hostname;
const labels = target.split('.');

if (
  process.argv.length > 3 ||
  target.length > 253 ||
  !labels.every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))
) {
  console.error(
    'Usage: npm run deploy [-- <new-app-name-or-current-hostname>]'
  );
  process.exit(1);
}

const args = [
  'scripts/meteor.sh',
  'deploy',
  target,
  '--owner',
  deployment.owner
];
if (labels.length === 1) {
  // Provision a database only when explicitly creating a new app. Updates use
  // the full Galaxy hostname and its existing database settings.
  args.push('--plan', 'free', '--mongo');
}

const child = spawn('sh', args, {
  cwd: root,
  env: {
    ...process.env,
    DEPLOY_HOSTNAME: `${deployment.region}.galaxy-deploy.meteor.com`
  },
  stdio: ['inherit', 'pipe', 'pipe']
});

// Galaxy prints the newly provisioned database URI. Buffer complete lines so
// credentials are hidden even when a URI arrives across multiple chunks.
for (const [stream, output] of [
  [child.stdout, process.stdout],
  [child.stderr, process.stderr]
]) {
  const lines = createInterface({ input: stream, crlfDelay: Infinity });
  lines.on('line', (line) => {
    output.write(
      line.replace(
        /mongodb(?:\+srv)?:\/\/\S+/g,
        '[MongoDB connection details hidden; available in the Galaxy dashboard]'
      ) + '\n'
    );
  });
}

child.on('error', (error) => {
  console.error(`Could not start deployment: ${error.message}`);
  process.exitCode = 1;
});
child.on('close', (code) => {
  process.exitCode = code ?? 1;
});
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}
