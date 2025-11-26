const fs = require('fs');
const path = require('path');
console.log('=== vercel-debug START ===');
console.log('Node version:', process.version);
try {
  const npmVersion = require('child_process').execSync('npm -v').toString().trim();
  console.log('npm version:', npmVersion);
} catch (e) {
  console.log('npm version: (error reading)', e && e.message);
}
console.log('cwd:', process.cwd());
console.log('__dirname:', __dirname);
console.log('Listing cwd files:');
try { console.log(fs.readdirSync(process.cwd())); } catch (e) { console.log('readdir error', e && e.message); }
console.log('Looking for index.html in cwd:');
const maybeIndex = path.resolve(process.cwd(), 'index.html');
console.log('resolved index path:', maybeIndex);
console.log('index exists?', fs.existsSync(maybeIndex));
console.log('Content preview (first 200 chars) if exists:');
if (fs.existsSync(maybeIndex)) {
  try { console.log(fs.readFileSync(maybeIndex, 'utf8').slice(0,200)); } catch (e) { console.log('read error', e && e.message); }
}
console.log('=== vercel-debug END ===');

