import {
  parseParseSafe,
  parseParseStrict,
  isAssertLoose,
  isAssertStrict,
  // Import the built module explicitly (not the `./build` directory): the
  // directory also contains `index.d.ts`, which some resolvers (e.g. Vitest's)
  // pick ahead of `index.js`, yielding a types-only module with no runtime.
} from './build/index.js';
import { addCase } from '../../benchmarks';

// `mjst` generates its checkers from a JSON Schema ahead of time — see
// `src/generate.ts` for the schema and the generator options behind each mode.
// The parsers (`@amritk/generate-parsers`) serve the parse modes; the cheaper
// predicates (`@amritk/generate-validators`) serve the assert modes.

addCase('mjst', 'parseSafe', data => {
  return parseParseSafe(data);
});

addCase('mjst', 'parseStrict', data => {
  return parseParseStrict(data);
});

addCase('mjst', 'assertLoose', data => {
  if (!isAssertLoose(data)) throw new Error('wrong type.');

  return true;
});

addCase('mjst', 'assertStrict', data => {
  if (!isAssertStrict(data)) throw new Error('wrong type.');

  return true;
});
