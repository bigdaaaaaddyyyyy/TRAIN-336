// =====================================================================
// env-demo.js - Environment variables with process.env and dotenv.
// Run it with:  npm run env
// =====================================================================

// WHAT ARE ENVIRONMENT VARIABLES?
// Key/value settings that live OUTSIDE your code: ports, API URLs,
// passwords, API keys. They let the same code run in development and
// production with different config, and keep secrets out of git.

// "dotenv/config" is a side-effect import: the moment it loads, it reads
// the .env file in the current folder and copies each KEY=value into
// process.env. It must run BEFORE any code that reads process.env.
// (Node 20.6+ can also do this without a package:  node --env-file=.env app.js)
import 'dotenv/config';

// process.env is a plain object holding every environment variable.
// The OS provides some (HOME, PATH...) and dotenv adds yours.
// IMPORTANT: every value is a STRING, or undefined if it isn't set.
console.log('1. APP_NAME:', process.env.APP_NAME);

// ---------------------------------------------------------------------
// DEFAULTS: use || (or ??) so the app still works if a variable is unset.
// ---------------------------------------------------------------------
const port = process.env.PORT || 3000;
console.log('2. PORT (not in .env, so it uses the default):', port);

// ---------------------------------------------------------------------
// TYPE CONVERSION: "5" is a string, not a number. Math and comparisons
// can silently misbehave ("5" + 1 gives "51"). Convert on purpose.
// ---------------------------------------------------------------------
const limit = Number(process.env.POST_LIMIT) || 10;
console.log('3. POST_LIMIT as a number:', limit, '| typeof:', typeof limit);

// ---------------------------------------------------------------------
// REQUIRED VARIABLES: fail FAST at startup if something essential is
// missing, with a clear message. Better than a confusing crash later.
// ---------------------------------------------------------------------
function requireEnv(name) {
  const value = process.env[name]; // bracket notation = dynamic key
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const apiKey = requireEnv('API_KEY');

// NEVER print secrets in full to logs. Mask all but the last 3 chars.
console.log('4. API_KEY (masked):', '*'.repeat(apiKey.length - 3) + apiKey.slice(-3));

// ---------------------------------------------------------------------
// Demonstrate the fail-fast error. try/catch so the demo keeps going.
// ---------------------------------------------------------------------
try {
  requireEnv('DOES_NOT_EXIST');
} catch (error) {
  console.log('5. Caught expected error:', error.message);
}

// ---------------------------------------------------------------------
// OVERRIDE FROM THE SHELL: a variable set in the terminal wins over the
// .env file (dotenv does NOT overwrite existing variables by default).
// Try:   APP_NAME=from-shell npm run env
// ---------------------------------------------------------------------
console.log('6. Shell variables beat .env. Try: APP_NAME=from-shell npm run env');