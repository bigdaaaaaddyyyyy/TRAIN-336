// =====================================================================
// files-callbacks.js - STEP 1 of the rewrite: the OLD callback style.
// Run it with:  npm run callbacks
//
// Same job as the Day 1 script (make folder, write, append, read), but
// written with callbacks so you can feel why people moved away from them.
// =====================================================================

// 'node:fs' (NOT fs/promises) is the callback-based file system API.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ES modules have no __dirname, so we rebuild it (same trick as Day 1).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const FILE = path.join(DATA_DIR, 'notes-callbacks.txt');

// ---------------------------------------------------------------------
// ERROR-FIRST CALLBACKS: the Node convention.
// Every callback receives (error, result). If something went wrong,
// "error" is an Error object and "result" is undefined. If it worked,
// "error" is null. You MUST check error first, every single time.
// ---------------------------------------------------------------------

// Step 1: make the folder.
fs.mkdir(DATA_DIR, { recursive: true }, (err) => {
  // If mkdir failed we stop here. "return" matters: without it the
  // code below would keep running even after the error.
  if (err) return console.error('mkdir failed:', err.message);
  console.log('1. Folder ready');

  // Step 2: write the file. This is INSIDE the mkdir callback because
  // it must only run AFTER the folder exists. Callbacks are how we
  // say "do this when that finishes".
  fs.writeFile(FILE, 'Line 1: written with callbacks.\n', 'utf8', (err) => {
    if (err) return console.error('write failed:', err.message);
    console.log('2. File written');

    // Step 3: append. Now we're nested two levels deep...
    fs.appendFile(FILE, 'Line 2: appended with callbacks.\n', 'utf8', (err) => {
      if (err) return console.error('append failed:', err.message);
      console.log('3. Line appended');

      // Step 4: read it back. ...three levels deep.
      fs.readFile(FILE, 'utf8', (err, text) => {
        if (err) return console.error('read failed:', err.message);
        console.log('4. File contents:\n' + text);

        // This staircase shape is CALLBACK HELL (the "pyramid of doom").
        // Each new step pushes the code further right, and every level
        // repeats its own error check. Hard to read, hard to change,
        // hard to reuse. Promises fix this - see files-promises.js.
      });
    });
  });
});

// This line runs IMMEDIATELY, before any of the steps above finish.
// The fs calls above only START the work and return. Their callbacks
// run later, when the event loop gets the result back from the OS.
// So "0." prints first even though it's written last.
console.log('0. Started (this prints BEFORE the file steps finish)');