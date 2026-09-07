import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');

console.log('🔄 Sincronizando directorio canónico src/ y assets a frontend/...');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 1. Limpiar y sincronizar src/
const targetSrc = path.join(frontendDir, 'src');
if (fs.existsSync(targetSrc)) {
  fs.rmSync(targetSrc, { recursive: true, force: true });
}
copyRecursiveSync(path.join(rootDir, 'src'), targetSrc);
console.log('✅ src/ sincronizado.');

// 2. Limpiar y sincronizar public/
const targetPublic = path.join(frontendDir, 'public');
if (fs.existsSync(targetPublic)) {
  fs.rmSync(targetPublic, { recursive: true, force: true });
}
copyRecursiveSync(path.join(rootDir, 'public'), targetPublic);
console.log('✅ public/ sincronizado.');

// 3. Archivos de configuración raíz
const configFiles = [
  'package.json',
  'index.html',
  'vite.config.ts',
  'tailwind.config.js',
  'postcss.config.js',
  'tsconfig.json',
  'tsconfig.node.json'
];

configFiles.forEach((file) => {
  const srcFile = path.join(rootDir, file);
  const destFile = path.join(frontendDir, file);
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, destFile);
  }
});
console.log('✅ Archivos de configuración sincronizados.');
console.log('🎉 Sincronización completada con éxito. Un solo código fuente canónico.');
