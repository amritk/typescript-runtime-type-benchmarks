import { checkLoose, checkStrict } from './build';
import { addCase } from '../../benchmarks';

// mjst's `@amritk/runtime-validators`: an eval-free JSON Schema interpreter
// for schemas only known at runtime. The package is ESM-only, so it is
// pre-bundled to CJS with esbuild (see the `compile:mjst` npm script) the same
// way the `paseri` case is.
//
// No `parseSafe` benchmark: validators check the input in place and don't
// strip unknown keys (same as ajv).

addCase('mjst', 'parseStrict', data => {
  if (!checkStrict(data)) {
    throw new Error('validation failure');
  }

  return data;
});

addCase('mjst', 'assertLoose', data => {
  if (!checkLoose(data)) {
    throw new Error('validation failure');
  }

  return true;
});

addCase('mjst', 'assertStrict', data => {
  if (!checkStrict(data)) {
    throw new Error('validation failure');
  }

  return true;
});
