import { validateDataTypeLoose, validateDataTypeStrict } from './build';
import { addCase } from '../../benchmarks';

// Ahead-of-time compiled counterpart to the runtime `mjst` case. The
// validator source is generated from the same schemas by
// `@amritk/generate-validators` (see `src/generate.ts`), so this measures the
// generated straight-line validator against the runtime schema interpreter.
//
// No `parseSafe` benchmark: validators check the input in place and don't
// strip unknown keys (same as ajv).

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
