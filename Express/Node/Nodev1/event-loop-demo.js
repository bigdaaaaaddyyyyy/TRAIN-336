// =====================================================================
// event-loop-demo.js - See the event loop's ordering with your own eyes.
// Run it with:  node event-loop-demo.js
// =====================================================================

import { readFile } from 'node:fs';

// Each console.log below is tagged with a number. The comment above it
// says WHICH queue it belongs to. Predict the output order first, then
// run it and compare.

console.log('1. Synchronous: runs first, straight down the call stack');

// setTimeout: goes to the TIMERS phase. Even with 0ms it can't run
// until the current synchronous code AND microtasks finish.
setTimeout(() => console.log('5. setTimeout 0ms (timers phase)'), 0);

// setImmediate: runs in the CHECK phase, right after I/O callbacks.
setImmediate(() => console.log('6. setImmediate (check phase)'));

// Promise .then: a MICROTASK. Microtasks run right after the current
// operation finishes, BEFORE the event loop moves to its next phase.
Promise.resolve().then(() => console.log('3. Promise.then (microtask)'));

// process.nextTick: Node's own high-priority queue, drained between phases.
// Overusing it can starve the event loop.
// NOTE: in a CommonJS file nextTick runs BEFORE promise microtasks. But
// this is an ES module ("type": "module"), and an ES module body itself
// runs inside a promise job, so the microtask queue is drained first and
// nextTick fires right after. We verified this by running the file.
process.nextTick(() => console.log('4. process.nextTick (after promises in ESM)'));

// File read: handed off to the OS / thread pool (libuv). Node doesn't
// wait. The callback fires later in the POLL phase, when the read is done.
readFile(import.meta.filename, () => console.log('7. fs.readFile callback (poll phase)'));

console.log('2. Synchronous: still the same call stack, still before everything async');

// EXPECTED ORDER:
// 1, 2  -> synchronous code
// 3     -> promise microtask   (ESM: promises first; in CommonJS, nextTick is first)
// 4     -> process.nextTick
// 5     -> setTimeout (timers)   [5 and 6 can swap in some cases]
// 6     -> setImmediate (check)
// 7     -> file read callback