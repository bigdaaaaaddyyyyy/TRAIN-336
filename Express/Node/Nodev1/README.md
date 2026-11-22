# Day 1: Node.js Fundamentals

## Run

```bash
npm start                    # raw http server on http://localhost:3000
npm run files                # fs/promises read/write demo
node event-loop-demo.js      # event loop ordering demo
```

Try the server:

```bash
curl http://localhost:3000/
curl "http://localhost:3000/hello?name=Jamil"
curl http://localhost:3000/info
curl http://localhost:3000/nope     # 404
```

## Explain the event loop (the 60-second version)

- **Node = V8 + libuv.** V8 runs your JavaScript. libuv provides the event loop and a thread pool for slow work (file system, DNS, crypto).
- **JavaScript is single-threaded.** One call stack, one thing at a time.
- **Non-blocking I/O.** When you call `readFile` or accept a request, Node hands the work to the OS or thread pool and keeps going. When the work finishes, a callback is queued.
- **The event loop** repeatedly checks queues and runs callbacks when the call stack is empty. Phases, in order: **timers** -> pending callbacks -> **poll** (I/O) -> **check** (`setImmediate`) -> close callbacks.
- **Between phases** Node drains `process.nextTick` and promise microtasks. In CommonJS, `nextTick` goes first. In an ES module (like this project), promises go first, because the module body itself runs inside a promise job.
- **Rule:** never block the loop (heavy sync loops, `readFileSync` in a server). While blocked, no other request gets served.

## CommonJS vs ES modules

| | CommonJS | ES modules |
|---|---|---|
| Import | `const fs = require('fs')` | `import fs from 'node:fs'` |
| Export | `module.exports = x` | `export default x` |
| Enabled by | default | `"type": "module"` in package.json or `.mjs` |
| `__dirname` | available | not available (use `import.meta.url`) |

## Checklist

- [ ] Server runs, all 3 routes respond
- [ ] `files.js` creates `data/` and prints 7 steps
- [ ] `event-loop-demo.js` output matches your prediction
- [ ] Can explain the event loop without notes