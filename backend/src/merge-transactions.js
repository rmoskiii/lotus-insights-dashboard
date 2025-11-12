import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('backend', 'sandbox-data');
const ORIGINAL = path.join(DATA_DIR, 'transactions.json');
const GENERATED = path.join(DATA_DIR, 'transactions.generated.json');
const OUT = path.join(DATA_DIR, 'transactions.merged.json');

function loadJsonAllowComments(p){
  const s = fs.readFileSync(p, 'utf8');
  const stripped = s.replace(/^\s*\/\/.*$/mg, '');
  return JSON.parse(stripped);
}

function keyFor(item){
  return item.id || item._id || JSON.stringify(item);
}

try{
  if(!fs.existsSync(ORIGINAL)) throw new Error('missing '+ORIGINAL);
  if(!fs.existsSync(GENERATED)) throw new Error('missing '+GENERATED);

  const orig = loadJsonAllowComments(ORIGINAL);
  const gen = loadJsonAllowComments(GENERATED);

  const map = new Map();
  orig.forEach(it=>map.set(keyFor(it), it));

  gen.forEach(it=>{
    const k = keyFor(it);
    if(map.has(k)){
      // merge: keep original fields, but override/add with generated fields
      const existing = map.get(k);
      const merged = Object.assign({}, existing, it);
      map.set(k, merged);
    } else {
      map.set(k, it);
    }
  });

  const merged = Array.from(map.values()).sort((a,b)=> new Date(a.createdAt) - new Date(b.createdAt));
  fs.writeFileSync(OUT, JSON.stringify(merged, null, 2), 'utf8');

  console.log('WROTE', OUT);
  console.log('counts: original=', orig.length, 'generated=', gen.length, 'merged=', merged.length);
  console.log('\nSAMPLE_FIRST_8:');
  console.log(JSON.stringify(merged.slice(0,8), null, 2));
}catch(err){
  console.error('ERROR', err && err.message || err);
  process.exit(1);
}

