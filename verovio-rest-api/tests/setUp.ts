import { execSync } from 'child_process';
import { join } from 'path';

(function applySchema() {
  const prismaBinary = join(__dirname, '..', 'node_modules', '.bin', 'prisma');
  execSync(`${prismaBinary} db push`, {
    env: {
      ...process.env,
      DATABASE_URL: process.env.POSTGRES_URL,
    },
  });
})();
