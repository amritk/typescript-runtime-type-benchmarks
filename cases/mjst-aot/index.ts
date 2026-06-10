import {
  parseDataType,
  validateDataTypeLoose,
  validateDataTypeStrict,
} from './build';
import { addCase } from '../../benchmarks';

// Ahead-of-time compiled counterpart to the runtime `mjst` case. The
// validators and the parser are generated from the same schemas (see
// `src/generate.ts`): `@amritk/generate-validators` for the assert benchmarks
// and parseStrict, `@amritk/generate-parsers` (strict + stripUnknown) for
// parseSafe, which throws on invalid input and removes unknown keys from the
// result at every nesting level.

addCase('mjst-(ahead-of-time)', 'parseSafe', data => {
  return parseDataType(data);
});

addCase('mjst-(ahead-of-time)', 'parseStrict', data => {
  if (validateDataTypeStrict(data) !== true) {
    throw new Error('validation failure');
  }

  return data;
});

addCase('mjst-(ahead-of-time)', 'assertLoose', data => {
  if (validateDataTypeLoose(data) !== true) {
    throw new Error('validation failure');
  }

  return true;
});

addCase('mjst-(ahead-of-time)', 'assertStrict', data => {
  if (validateDataTypeStrict(data) !== true) {
    throw new Error('validation failure');
  }

  return true;
});
