#!/usr/bin/env node

/**
 * Script de Release do NeuroGame Launcher
 *
 * Automatiza o processo de:
 * 1. Incrementar versão
 * 2. Build do launcher
 * 3. Mover arquivos para pasta releases do backend
 * 4. Atualizar arquivos de metadata
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const LAUNCHER_DIR = path.join(__dirname, 'neurogame-launcher');
const BACKEND_DIR = path.join(__dirname, 'neurogame-backend');
const RELEASES_DIR = path.join(BACKEND_DIR, 'releases');

async function incrementVersion(type = 'patch') {
  console.log(`📦 Incrementando versão (${type})...`);

  const packagePath = path.join(LAUNCHER_DIR, 'package.json');
  const packageData = JSON.parse(await fs.readFile(packagePath, 'utf8'));

  const [major, minor, patch] = packageData.version.split('.').map(Number);

  let newVersion;
  switch (type) {
    case 'major':
      newVersion = `${major + 1}.0.0`;
      break;
    case 'minor':
      newVersion = `${major}.${minor + 1}.0`;
      break;
    case 'patch':
    default:
      newVersion = `${major}.${minor}.${patch + 1}`;
      break;
  }

  packageData.version = newVersion;
  await fs.writeFile(packagePath, JSON.stringify(packageData, null, 2) + '\n');

  console.log(`✅ Versão atualizada: ${packageData.version} → ${newVersion}`);
  return newVersion;
}

async function buildLauncher() {
  console.log('\n🔨 Construindo launcher...');

  try {
    // Install dependencies if needed
    console.log('📥 Verificando dependências...');
    execSync('npm install', {
      cwd: LAUNCHER_DIR,
      stdio: 'inherit'
    });

    // Build for Windows
    console.log('\n🪟 Construindo para Windows...');
    execSync('npm run build:win', {
      cwd: LAUNCHER_DIR,
      stdio: 'inherit'
    });

    console.log('✅ Build concluído!');
    return true;
  } catch (error) {
    console.error('❌ Erro ao construir:', error.message);
    return false;
  }
}

async function moveReleaseFiles() {
  console.log('\n📁 Movendo arquivos de release...');

  const distDir = path.join(LAUNCHER_DIR, 'dist-electron');

  // Create releases directory if it doesn't exist
  await fs.mkdir(RELEASES_DIR, { recursive: true });

  try {
    const files = await fs.readdir(distDir);

    // Files to copy
    const releaseFiles = files.filter(file =>
      file.endsWith('.exe') ||
      file.endsWith('.yml') ||
      file.endsWith('.blockmap')
    );

    for (const file of releaseFiles) {
      const source = path.join(distDir, file);
      const dest = path.join(RELEASES_DIR, file);

      await fs.copyFile(source, dest);
      console.log(`✅ Copiado: ${file}`);
    }

    console.log(`\n✅ ${releaseFiles.length} arquivos copiados para releases/`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao copiar arquivos:', error.message);
    return false;
  }
}

async function generateReleaseNotes(version) {
  const notes = `# NeuroGame Launcher v${version}

## Novidades
- Sistema de auto-atualização implementado
- Interface redesenhada com tema NeuroGame
- Sistema de solicitação de jogos
- Melhorias de performance e estabilidade

## Instalação
1. Baixe o instalador (.exe para Windows)
2. Execute o instalador
3. Siga as instruções na tela
4. O launcher será iniciado automaticamente

## Atualizações Automáticas
O launcher verifica automaticamente por atualizações a cada inicialização.
Quando uma nova versão estiver disponível, você será notificado.

---
Data de lançamento: ${new Date().toISOString().split('T')[0]}
`;

  const notesPath = path.join(RELEASES_DIR, `RELEASE_NOTES_${version}.md`);
  await fs.writeFile(notesPath, notes);
  console.log(`✅ Notas de release criadas: RELEASE_NOTES_${version}.md`);
}

async function listReleases() {
  console.log('\n📋 Releases disponíveis:\n');

  try {
    const exists = await fs.access(RELEASES_DIR).then(() => true).catch(() => false);
    if (!exists) {
      console.log('Nenhum release encontrado.');
      return;
    }

    const files = await fs.readdir(RELEASES_DIR);
    const stats = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(RELEASES_DIR, file);
        const stat = await fs.stat(filePath);
        return { file, size: stat.size, modified: stat.mtime };
      })
    );

    // Group by type
    const installers = stats.filter(f => f.file.endsWith('.exe'));
    const metadata = stats.filter(f => f.file.endsWith('.yml'));
    const other = stats.filter(f => !f.file.endsWith('.exe') && !f.file.endsWith('.yml'));

    if (installers.length > 0) {
      console.log('📦 Instaladores:');
      installers.forEach(f => {
        const sizeMB = (f.size / 1024 / 1024).toFixed(2);
        console.log(`  - ${f.file} (${sizeMB} MB)`);
      });
    }

    if (metadata.length > 0) {
      console.log('\n📄 Metadata:');
      metadata.forEach(f => console.log(`  - ${f.file}`));
    }

    if (other.length > 0) {
      console.log('\n📁 Outros:');
      other.forEach(f => console.log(`  - ${f.file}`));
    }

  } catch (error) {
    console.error('❌ Erro ao listar releases:', error.message);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log('🚀 NeuroGame Release Manager\n');

  switch (command) {
    case 'list':
      await listReleases();
      break;

    case 'build':
      const versionType = args[1] || 'patch';
      const version = await incrementVersion(versionType);
      const buildSuccess = await buildLauncher();

      if (buildSuccess) {
        await moveReleaseFiles();
        await generateReleaseNotes(version);
        console.log('\n✨ Release criado com sucesso!');
        console.log(`\n📥 URL de download: http://localhost:3000/api/v1/downloads/`);
        await listReleases();
      }
      break;

    case 'copy':
      await moveReleaseFiles();
      break;

    default:
      console.log(`
Uso: node release.js <comando> [opções]

Comandos:
  build [patch|minor|major]  Incrementa versão, faz build e cria release
                             - patch: 1.0.0 → 1.0.1 (padrão)
                             - minor: 1.0.0 → 1.1.0
                             - major: 1.0.0 → 2.0.0

  copy                       Copia arquivos de dist-electron para releases/

  list                       Lista todos os releases disponíveis

Exemplos:
  node release.js build           # Build com versão patch
  node release.js build minor     # Build com versão minor
  node release.js list            # Listar releases
      `);
  }
}

main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
