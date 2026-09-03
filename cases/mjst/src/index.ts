// Single entry point for the four generated modules, compiled by
// `compile:mjst` into `../build`. Each generation lives in its own directory
// because each one emits its own `index.ts` (and the parsers their own
// embedded helpers).
//
// Deliberately `import` + `export const` rather than `export { x } from`:
// TypeScript compiles a re-export to an accessor on `exports` (a getter call
// on every use), whereas this form emits a plain data property, which V8 can
// treat as a constant at the call site — the same shape the other
// compile-to-JS cases (typia, spectypes) present to the benchmark.
import { parseParseSafe as parseSafe } from './generated/parse-safe/index.js';
import { parseParseStrict as parseStrict } from './generated/parse-strict/index.js';
import { isAssertLoose as assertLoose } from './generated/assert-loose/index.js';
import { isAssertStrict as assertStrict } from './generated/assert-strict/index.js';

export const parseParseSafe = parseSafe;
export const parseParseStrict = parseStrict;
export const isAssertLoose = assertLoose;
export const isAssertStrict = assertStrict;
