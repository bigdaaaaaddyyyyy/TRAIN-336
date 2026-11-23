// =====================================================================
// files-promises.js - STEP 2 of the rewrite: Promises with .then chains.
// Run it with:  npm run promises
//
// Same job as files-callbacks.js. The staircase is gone: steps are now a
// flat chain, and ONE .catch handles an error from ANY step.
// =====================================================================

// 'node:fs/promises' = the same functions, but they RETURN a Promise
// instead of taking a callback.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const FILE = path.join(DATA_DIR, 'notes-promises.txt');

// ---------------------------------------------------------------------
// WHAT IS A PROMISE?
// An object that stands for a value that isn't ready yet. It is always
// in one of three states:
//   pending   - work still running
//   fulfilled - finished OK, has a value   -> .then(value => ...)
//   rejected  - failed, has an error       -> .catch(error => ...)
// ---------------------------------------------------------------------

fs.mkdir(DATA_DIR, { recursive: true })
  // .then runs when the previous promise fulfills. Whatever we RETURN
  // from it (here, another promise) becomes the input of the next .then.
  // That "return" is what flattens the pyramid. Forget it and the next
  // step runs too early with undefined.
  .then(() => {
    console.log('1. Folder ready');
    return fs.writeFile(FILE, 'Line 1: written with promises.\n', 'utf8');
  })
  .then(() => {
    console.log('2. File written');
    return fs.appendFile(FILE, 'Line 2: appended with promises.\n', 'utf8');
  })
  .then(() => {
    console.log('3. Line appended');
    return fs.readFile(FILE, 'utf8');
  })
  // The readFile promise fulfills with the file text, so it arrives here.
  .then((text) => {
    console.log('4. File contents:\n' + text);
  })
  // ONE .catch at the end catches a rejection from ANY step above.
  // Compare with the callbacks version, which needed 4 separate checks.
  .catch((error) => {
    console.error('A step failed:', error.message);
  })
  // .finally runs whether it worked or failed. Good for cleanup, like
  // closing a connection or stopping a loading spinner.
  .finally(() => {
    console.log('5. Done (finally always runs)');
  });

console.log('0. Started (this still prints first: promises are async too)');