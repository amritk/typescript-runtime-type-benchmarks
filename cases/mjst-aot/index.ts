import { validateDataType } from './build';
import { addCase } from '../../benchmarks';

// Ahead-of-time compiled counterpart to the runtime `mjst` case. The
// validator source is generated from the same shape by
// `@amritk/generate-validators` (see `src/generate.ts`), so this measures the
// generated straight-line validator against the runtime schema interpreter.
//
// Only `assertLoose` is registered: the generated validators don't enforce
// `additionalProperties: false` (no strict mode) and don't strip unknown keys
// (no parse modes).

addCase('mjst-(ahead-of-time)', 'assertLoose', data => {
  if (validateDataType(data) !== true) {
    throw new Error('validation failure');
  }

  return true;
});
