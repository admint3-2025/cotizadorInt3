import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routesDir = path.join(__dirname, 'routes');

// Función para convertir placeholders ? a $1, $2, etc
function convertQueryPlaceholders(content) {
  let result = content;
  
  // Reemplazar imports
  result = result.replace(/import\s+{\s*dbGet,?\s*dbRun,?\s*dbAll\s*}\s+from/g, 'import { getOne, query, getAll } from');
  result = result.replace(/import\s+{\s*dbRun,?\s*dbGet,?\s*dbAll\s*}\s+from/g, 'import { query, getOne, getAll } from');
  result = result.replace(/dbGet/g, 'getOne');
  result = result.replace(/dbRun/g, 'query');
  result = result.replace(/dbAll/g, 'getAll');
  
  // Convertir placeholders en queries
  const lines = result.split('\n');
  const newLines = [];
  
  for (let line of lines) {
    if (line.includes('SELECT') || line.includes('INSERT') || line.includes('UPDATE') || line.includes('DELETE')) {
      let questionMarkCount = 0;
      let newLine = line.replace(/\?/g, () => {
        questionMarkCount++;
        return `$${questionMarkCount}`;
      });
      newLines.push(newLine);
    } else {
      newLines.push(line);
    }
  }
  
  return newLines.join('\n');
}

// Procesar todos los archivos en routes/
const files = fs.readdirSync(routesDir);

files.forEach(file => {
  if (file.endsWith('.js')) {
    const filePath = path.join(routesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const converted = convertQueryPlaceholders(content);
    fs.writeFileSync(filePath, converted, 'utf8');
    console.log(`✅ Convertido: ${file}`);
  }
});

console.log('✅ Conversión completada');
