# Day 2: Async JavaScript in Node

## Run

```bash
npm install                # installs dotenv
npm run callbacks          # step 1: old callback style (see the pyramid)
npm run promises           # step 2: .then chain
npm run async              # step 3: async/await (the goal)
npm run env                # process.env + dotenv
npm run fetch              # fetch a public API, save to data/posts.json
```

## The three styles, same job

| | Callbacks | Promises | async/await |
|---|---|---|---|
| Result | passed to a function | `.then(value => ...)` | `const value = await ...` |
| Errors | `if (err)` at every level | one `.catch()` | `try/catch` |
| Shape | nested pyramid | flat chain | reads top to bottom |
| File | files-callbacks.js | files-promises.js | files-async.js |

## Cheat sheet

- `async` function **always returns a Promise**.
- `await` pauses only that function, never Node.
- `await` in a row = sequential. `Promise.all([...])` = parallel.
- `Promise.allSettled` when one failure must not cancel the rest.
- `fetch` rejects only on network failure. **Always check `response.ok`.**
- `process.env` values are always **strings**. Convert with `Number()`.
- Never commit `.env`. Commit `.env.example`.

## Checklist

- [ ] Can explain callback hell and how promises flatten it
- [ ] Can rewrite a callback function as async/await from memory
- [ ] Know when to use `Promise.all` vs awaiting in a row
- [ ] `npm run fetch` creates `data/posts.json`
- [ ] `.env` is in `.gitignore`