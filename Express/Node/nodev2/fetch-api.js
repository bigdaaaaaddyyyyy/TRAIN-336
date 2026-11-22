// =====================================================================
// fetch-api.js - Fetch a public API and save the result to a JSON file.
// Run it with:  npm run fetch
// =====================================================================

// Load .env into process.env first (see env-demo.js).
import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration comes from the environment, with safe defaults.
const API_URL = process.env.API_URL || 'https://jsonplaceholder.typicode.com/posts';
const LIMIT = Number(process.env.POST_LIMIT) || 5; // string -> number
// path.resolve turns the relative OUTPUT_FILE into an absolute path.
const OUTPUT_FILE = path.resolve(__dirname, process.env.OUTPUT_FILE || 'data/posts.json');

// ---------------------------------------------------------------------
// fetchJson: a reusable helper that wraps fetch() with the safety
// checks fetch() does NOT do for you.
// ---------------------------------------------------------------------
async function fetchJson(url) {
  // fetch() is built into Node 18+ (no package needed). It returns a
  // Promise that resolves to a Response object.
  //
  // AbortSignal.timeout(5000) cancels the request after 5 seconds.
  // Without a timeout, a stuck server could make your app wait forever.
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(5000),
  });

  // GOTCHA: fetch only REJECTS on network failure (no connection, DNS
  // error, timeout). A 404 or 500 still RESOLVES normally! You must
  // check response.ok (true for status 200-299) yourself.
  if (!response.ok) {
    throw new Error(`Request failed: HTTP ${response.status} ${response.statusText}`);
  }

  // response.json() reads the body and parses it. It is ALSO async,
  // because the body streams in, so it needs its own await.
  return response.json();
}

// ---------------------------------------------------------------------
// main: fetch, trim, and save.
// ---------------------------------------------------------------------
async function main() {
  console.log('1. Fetching:', API_URL);
  const data = await fetchJson(API_URL);
  console.log(`2. Received ${data.length} items`);

  // Keep only the first LIMIT items, and only the fields we care about.
  // map() builds a new array of smaller objects.
  const posts = data.slice(0, LIMIT).map((post) => ({
    id: post.id,
    title: post.title,
    body: post.body,
  }));

  // Wrap in an object with metadata so the file explains itself.
  const output = {
    source: API_URL,
    fetchedAt: new Date().toISOString(),
    count: posts.length,
    posts,
  };

  // Make sure the target folder exists, then write the JSON.
  // path.dirname(OUTPUT_FILE) = the folder part of the path.
  await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
  await fs.writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2), 'utf8');
  console.log('3. Saved to:', OUTPUT_FILE);

  // Read it back and parse to prove the file is valid JSON.
  const saved = JSON.parse(await fs.readFile(OUTPUT_FILE, 'utf8'));
  console.log(`4. Verified: file contains ${saved.count} posts`);
  console.log('   First title:', saved.posts[0]?.title); // ?. = safe if empty
}

// ---------------------------------------------------------------------
// Top-level error handling. Different failures deserve different
// messages, so we look at error.name.
// ---------------------------------------------------------------------
try {
  await main();
} catch (error) {
  if (error.name === 'TimeoutError') {
    // Thrown by AbortSignal.timeout when the 5 seconds run out.
    console.error('Request timed out after 5s.');
  } else if (error.name === 'TypeError') {
    // fetch() throws TypeError for network failures (offline, bad DNS).
    // error.cause usually holds the low-level reason.
    console.error('Network error:', error.cause?.code || error.message);
  } else {
    console.error('Failed:', error.message);
  }
  // Exit code 1 tells shells, CI and schedulers that this run FAILED.
  process.exitCode = 1;
}