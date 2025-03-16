const fs = require('fs');
const path = require('path');

// Path to the build directory
const outDir = path.join(__dirname, '..', 'out');

// Ensure the .nojekyll file exists
fs.writeFileSync(path.join(outDir, '.nojekyll'), '');

// Copy the custom 404.html file if it doesn't exist in the build
if (!fs.existsSync(path.join(outDir, '404.html'))) {
  const custom404 = fs.readFileSync(path.join(__dirname, '..', 'public', '404.html'));
  fs.writeFileSync(path.join(outDir, '404.html'), custom404);
}

// Check if there's an index.html in the out directory
if (!fs.existsSync(path.join(outDir, 'index.html'))) {
  console.error('Error: index.html not found in the build directory');
  process.exit(1);
}

console.log('GitHub Pages preparation complete!');
console.log('- Added .nojekyll file');
console.log('- Ensured 404.html exists');
console.log('- Verified index.html exists');

// Next, you would use gh-pages to deploy the build directory 