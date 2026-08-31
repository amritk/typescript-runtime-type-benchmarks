import { DataTypeStrip } from './generated/strip';
import { DataTypeStrict } from './generated/strict';
import { DataTypePassthrough } from './generated/passthrough';

// `@paseri/compiler` emits one schema object per module now, with the compiled
// parser hanging off `.parse`. Those are plain top-level function declarations
// that never touch `this`, so pulling them off the schema keeps the benchmark
// calling the compiled parser directly, as it did when `toSource` exported the
// bare functions.
export const parseDataTypeStrip = DataTypeStrip.parse;
export const parseDataTypeStrict = DataTypeStrict.parse;
export const parseDataTypePassthrough = DataTypePassthrough.parse;
