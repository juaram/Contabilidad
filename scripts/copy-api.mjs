import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Copia la carpeta api/ (endpoints PHP + schema.sql) dentro de dist/ tras el build,
// excluyendo los archivos solo para desarrollo local.
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'api');
const dest = join(root, 'dist', 'api');

if (!existsSync(src)) {
  console.error('[copy-api] No existe la carpeta api/');
  process.exit(1);
}

if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

const files = readdirSync(src).filter((f) => f !== 'config.local.php' && f !== 'router.php');
for (const f of files) {
  cpSync(join(src, f), join(dest, f), { recursive: true });
}

console.log(`[copy-api] API copiada a dist/api/ (${files.length} archivos)`);