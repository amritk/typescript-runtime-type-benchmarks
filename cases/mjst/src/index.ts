// mjst generates the parsers and validators ahead of time from the JSON
// Schemas in `cases/mjst/schema` (see the `compile:mjst` npm script), so this
// module only re-exports them for the benchmark cases.
//
// These are deliberately re-exported as `const` bindings rather than with
// `export { … } from`. TypeScript lowers a CJS re-export to an accessor
// property (`Object.defineProperty(exports, …, { get })`), so re-exporting
// through mjst's own generated barrels would put two chained getters on every
// call and dominate the measurement — the same functions are ~3x slower
// reached that way than through a plain binding.
import { parseLoose as parseLooseFn } from './generated/loose/index.js';
import { parseStrict as parseStrictFn } from './generated/strict/index.js';
import { isLoose as isLooseFn } from './generated/validators/loose/index.js';
import { isStrict as isStrictFn } from './generated/validators/strict/index.js';

export const parseLoose = parseLooseFn;
export const parseStrict = parseStrictFn;
export const isLoose = isLooseFn;
export const isStrict = isStrictFn;
