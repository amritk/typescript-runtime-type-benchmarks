import { parseLoose, parseStrict, isLoose, isStrict } from './build';
import { addCase } from '../../benchmarks';

// mjst is a code generator: the parsers and type guards below are compiled
// ahead of time from the JSON Schemas in `./schema` (see `compile:mjst`).
// The loose schema leaves `additionalProperties` open, the strict one sets it
// to `false` on every object.

addCase('mjst', 'parseSafe', data => {
  // generated with `--strip-unknown`, so undeclared keys are dropped
  return parseLoose(data);
});

addCase('mjst', 'parseStrict', data => {
  return parseStrict(data);
});

addCase('mjst', 'assertLoose', data => {
  if (!isLoose(data)) throw new Error('wrong type.');

  return true;
});

addCase('mjst', 'assertStrict', data => {
  if (!isStrict(data)) throw new Error('wrong type.');

  return true;
});
