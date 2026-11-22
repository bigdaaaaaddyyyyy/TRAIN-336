// files.js - Read and write files with fs/promises.
// Run with: npm run files

// Promise-based fs: every function returns a Promise (use async/await).
import { readFile, writeFile, appendFile, readdir, stat, mkdir } from 'node:fs/promises';

// 'path' builds paths that work on every OS. Never join with "/" by hand.
import path from 'node:path';

// ES modules have no __dirname, so we rebuild it from import.meta.url.
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// All output goes in a "data" folder next to this script.
const DATA_DIR = path.join(__dirname, 'data');
const NOTES_FILE = path.join(DATA_DIR, 'notes.txt');
const JSON_FILE = path.join(DATA_DIR, 'profile.json');

// async so we can use await. await pauses THIS function only;
// Node's event loop keeps running other work. That is non-blocking I/O.
async function main() {
  // 1. Create folder. recursive: true = no error if it already exists.
  await mkdir(DATA_DIR, { recursive: true });
  console.log('1. Folder ready:', DATA_DIR);

  // 2. Write a file (overwrites if it exists). 'utf8' = treat as text.
  await writeFile(NOTES_FILE, 'Line 1: Node uses V8 to run JavaScript.\n', 'utf8');
  console.log('2. Wrote notes.txt');

  // 3. Append adds to the end instead of overwriting.
  await appendFile(NOTES_FILE, 'Line 2: The event loop handles async work.\n', 'utf8');
  await appendFile(NOTES_FILE, `Line 3: Written on ${os.platform()}.\n`, 'utf8');
  console.log('3. Appended two more lines');

  // 4. Read it back. Loads the whole file into memory: fine for small
  // files, use streams for big ones.
  const text = await readFile(NOTES_FILE, 'utf8');
  console.log('4. File contents:\n' + text);

  // 5. JSON: stringify to write, parse to read back into an object.
  const profile = { name: 'Jamil', learning: 'Node.js', day: 1 };
  await writeFile(JSON_FILE, JSON.stringify(profile, null, 2), 'utf8');
  const loaded = JSON.parse(await readFile(JSON_FILE, 'utf8'));
  console.log('5. Parsed JSON back into an object:', loaded);

  // 6. List the folder; stat gives size, timestamps, file vs folder.
  const entries = await readdir(DATA_DIR);
  console.log('6. Files in data/:');
  for (const name of entries) {
    const info = await stat(path.join(DATA_DIR, name));
    console.log(`   - ${name} (${info.size} bytes)`);
  }

  // 7. A missing file rejects the promise; catch it with try/catch.
  // error.code 'ENOENT' = Error NO ENTry (file not found).
  try {
    await readFile(path.join(DATA_DIR, 'does-not-exist.txt'), 'utf8');
  } catch (error) {
    console.log('7. Caught expected error:', error.code);
  }
}

// Catch anything that escapes main() so the process fails loudly.
main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});