const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const downloadsDir = path.join(__dirname, 'neurogame-backend', 'downloads');

// Mapeamento de slugs para IDs e nomes
const jogosMap = {
  'autorama': { id: '93be773c-b20c-480b-86d4-7377fc55e247', name: 'Autorama', version: '1.2.0' },
  'balao': { id: '29aeea09-59c4-486f-88e6-0d07957a989a', name: 'Balão', version: '1.0.0' },
  'batalhadetanques': { id: '4f0f3152-8c71-4da9-aea7-194cad4c41c2', name: 'Batalha de Tanques', version: '1.0.0' },
  'correndopelostrilhos': { id: '64a8c7a3-66d4-4f16-bc65-6a72dbc6667b', name: 'Correndo pelos Trilhos', version: '1.0.0' },
  'desafioaereo': { id: '89d48119-022f-4522-befc-2461848536e5', name: 'Desafio Aéreo', version: '1.0.0' },
  'desafioautomotivo': { id: '361b3a08-3fe3-406e-bc81-d49a1990afb6', name: 'Desafio Automotivo', version: '1.0.0' },
  'desafionasalturas': { id: '4fa8b047-77e6-4b5b-8ce7-5b591e9bbb36', name: 'Desafio nas Alturas', version: '1.0.0' },
  'fazendinha': { id: 'd41c3f6a-dfab-4dfc-bfc3-54b6089f1feb', name: 'Fazendinha', version: '1.0.0' },
  'labirinto': { id: 'ee43d9c0-733f-48f8-a778-24735cc6ea95', name: 'Labirinto', version: '1.0.0' },
  'missaoespacial': { id: 'c14f818c-1dda-4ad3-9b19-ddb993c9fab4', name: 'Missão Espacial', version: '1.0.0' },
  'resgateemchamas': { id: 'f9d1db91-33dc-463a-9d5f-87b751fb827e', name: 'Resgate em Chamas', version: '1.0.0' },
  'taxicity': { id: '2ec6899a-6d2b-4fb4-bde8-414b2d7aecb7', name: 'Taxi City', version: '1.0.0' },
  'tesourodomar': { id: 'bc83342c-5e59-431e-997c-ba37d04f23dc', name: 'Tesouro do Mar', version: '1.0.0' }
};

// Função para calcular SHA256
function calculateSHA256(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    stream.on('data', data => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

async function main() {
  const files = fs.readdirSync(downloadsDir).filter(f => f.endsWith('.zip'));

  console.log(`📊 Processando ${files.length} jogos...\n`);

  const metadata = [];

  for (const file of files) {
    const slug = file.replace('.zip', '');
    const filePath = path.join(downloadsDir, file);
    const stats = fs.statSync(filePath);
    const gameInfo = jogosMap[slug];

    if (!gameInfo) {
      console.warn(`⚠️  ${slug} não encontrado no mapeamento`);
      continue;
    }

    console.log(`Processando ${gameInfo.name}...`);

    const checksum = await calculateSHA256(filePath);
    const sizeInBytes = stats.size;
    const sizeInMB = (sizeInBytes / 1024 / 1024).toFixed(2);

    // Espaço mínimo = tamanho do arquivo * 2.5 (para descompactação + margem)
    const minimumDiskSpace = Math.ceil(sizeInBytes * 2.5);

    metadata.push({
      id: gameInfo.id,
      name: gameInfo.name,
      slug: slug,
      version: gameInfo.version,
      download_url: `https://neurogame.onrender.com/downloads/${file}`,
      file_size: sizeInBytes,
      file_size_mb: sizeInMB,
      checksum: checksum,
      installer_type: 'zip',
      minimum_disk_space: minimumDiskSpace,
      file_name: file
    });

    console.log(`   ✅ ${sizeInMB}MB - ${checksum.substring(0, 16)}...\n`);
  }

  // Salvar metadata JSON
  const outputPath = path.join(__dirname, 'games-metadata.json');
  fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));

  console.log(`\n✅ Metadata gerado: ${outputPath}`);

  // Gerar SQL UPDATE statements
  const sqlPath = path.join(__dirname, 'update-games.sql');
  const sqlStatements = metadata.map(game => {
    return `UPDATE games SET
  version = '${game.version}',
  download_url = '${game.download_url}',
  file_size = ${game.file_size},
  checksum = '${game.checksum}',
  installer_type = '${game.installer_type}',
  minimum_disk_space = ${game.minimum_disk_space}
WHERE id = '${game.id}';`;
  }).join('\n\n');

  fs.writeFileSync(sqlPath, sqlStatements);
  console.log(`✅ SQL gerado: ${sqlPath}\n`);

  // Resumo
  console.log('📊 RESUMO:');
  console.log(`   Total de jogos: ${metadata.length}`);
  console.log(`   Tamanho total: ${(metadata.reduce((sum, g) => sum + parseInt(g.file_size), 0) / 1024 / 1024).toFixed(2)}MB`);
}

main().catch(console.error);
