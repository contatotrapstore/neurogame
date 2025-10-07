const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const jogosDir = path.join(__dirname, 'Jogos');
const downloadsDir = path.join(__dirname, 'neurogame-backend', 'downloads');

// Criar pasta downloads se não existir
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Listar todos os jogos
const jogos = fs.readdirSync(jogosDir).filter(file => {
  return fs.statSync(path.join(jogosDir, file)).isDirectory();
});

console.log(`📦 Encontrados ${jogos.length} jogos para compactar\n`);

// Função para obter tamanho de pasta
function getFolderSize(folderPath) {
  let totalSize = 0;

  function calculateSize(dirPath) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        calculateSize(filePath);
      } else {
        totalSize += stats.size;
      }
    });
  }

  calculateSize(folderPath);
  return totalSize;
}

// Compactar cada jogo usando PowerShell (Windows)
jogos.forEach((jogo, index) => {
  const jogoPath = path.join(jogosDir, jogo);
  const zipPath = path.join(downloadsDir, `${jogo}.zip`);

  console.log(`[${index + 1}/${jogos.length}] Compactando ${jogo}...`);

  try {
    // Usar PowerShell Compress-Archive
    const command = `powershell -Command "Compress-Archive -Path '${jogoPath}\\*' -DestinationPath '${zipPath}' -Force"`;
    execSync(command, { stdio: 'inherit' });

    // Verificar tamanho
    const zipStats = fs.statSync(zipPath);
    const originalSize = getFolderSize(jogoPath);
    const compressao = ((1 - zipStats.size / originalSize) * 100).toFixed(1);

    console.log(`   ✅ ${(zipStats.size / 1024 / 1024).toFixed(1)}MB (${compressao}% compressão)\n`);
  } catch (error) {
    console.error(`   ❌ Erro ao compactar ${jogo}:`, error.message);
  }
});

console.log('✅ Todos os jogos foram compactados!');
console.log(`📁 Local: ${downloadsDir}`);
