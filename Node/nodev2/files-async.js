// =====================================================================
// files-async.js - STEP 3 of the rewrite: async/await. The goal state.
// Run it with:  npm run async
//
// Same job again, but it now reads top to bottom like normal
// synchronous code, while still being fully non-blocking.
// =====================================================================

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const FILE = path.join(DATA_DIR, 'notes-async.txt');

// ---------------------------------------------------------------------
// RULES OF async/await
// 1. "async" before a function makes it ALWAYS return a Promise.
// 2. "await" can only be used inside an async function (or at the top
//    level of an ES module).
// 3. "await somePromise" pauses THIS function until the promise settles,
//    then gives you the fulfilled value (or throws the rejection error).
// 4. The pause does NOT block Node. The event loop keeps serving other
//    work. Only this one function waits.
// It is just nicer syntax on top of Promises. Nothing new underneath.
// ---------------------------------------------------------------------

async function writeAndReadNotes() {
  // try/catch is how you handle errors with await. A rejected promise
  // becomes a normal thrown exception, caught right here.
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    console.log('1. Folder ready');

    await fs.writeFile(FILE, 'Line 1: written with async/await.\n', 'utf8');
    console.log('2. File written');

    await fs.appendFile(FILE, 'Line 2: appended with async/await.\n', 'utf8');
    console.log('3. Line appended');

    // The fulfilled value comes back as a normal return value. No
    // callback, no .then. Just assign it to a variable.
    const text = await fs.readFile(FILE, 'utf8');
    console.log('4. File contents:\n' + text);
  } catch (error) {
    // Any await above that rejects jumps straight here, skipping the rest.
    console.error('A step failed:', error.message);
  } finally {
    // Runs on success AND failure, like .finally() on a promise.
    console.log('5. Done (finally always runs)');
  }
}

// ---------------------------------------------------------------------
// SEQUENTIAL vs PARALLEL: the most common async mistake.
// Awaiting in a row makes each wait for the previous one. If the tasks
// don't depend on each other, start them all and await together.
// ---------------------------------------------------------------------

// A fake slow task: resolves with `label` after `ms` milliseconds.
// new Promise((resolve) => ...) is how you wrap old callback-style code
// (like setTimeout) into a Promise. resolve(value) = "I'm done".
function slowTask(label, ms) {
  return new Promise((resolve) => setTimeout(() => resolve(label), ms));
}

async function sequentialVsParallel() {
  // SEQUENTIAL: 300 + 300 + 300 = about 900ms total.
  let start = Date.now();
  await slowTask('a', 300);
  await slowTask('b', 300);
  await slowTask('c', 300);
  console.log(`6. Sequential took ~${Date.now() - start}ms`);

  // PARALLEL: all three start at once, so total = the slowest = ~300ms.
  // Promise.all takes an array of promises and fulfills with an array of
  // their results, in the same order. If ANY one rejects, Promise.all
  // rejects immediately (fail-fast).
  start = Date.now();
  const results = await Promise.all([
    slowTask('a', 300),
    slowTask('b', 300),
    slowTask('c', 300),
  ]);
  console.log(`7. Parallel took ~${Date.now() - start}ms, results:`, results);

  // Promise.allSettled waits for ALL to finish and never rejects. Each
  // result says { status: 'fulfilled', value } or { status: 'rejected',
  // reason }. Use it when one failure shouldn't cancel the others.
  const settled = await Promise.allSettled([
    fs.readFile(FILE, 'utf8'),
    fs.readFile(path.join(DATA_DIR, 'missing.txt'), 'utf8'), // will reject
  ]);
  console.log('8. allSettled statuses:', settled.map((s) => s.status));
}

// ---------------------------------------------------------------------
// TOP-LEVEL await: in an ES module you can await directly at the top of
// the file, no wrapper function needed. Run the two demos in order.
// ---------------------------------------------------------------------
await writeAndReadNotes();
await sequentialVsParallel();