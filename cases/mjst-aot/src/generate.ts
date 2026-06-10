import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildValidatorSchema } from '@amritk/generate-validators';

// Ahead-of-time counterpart to the runtime `cases/mjst` case: mjst's
// `@amritk/generate-validators` emits standalone TypeScript validator source
// from a JSON Schema at build time.
//
// The nested object lives in `$defs` and is referenced via `$ref` so the
// generator emits a real recursive check for it (inline nested objects are
// only shallowly checked). The generator does not enforce
// `additionalProperties: false` yet, so only the loose validator is generated
// and only `assertLoose` is benchmarked.
const looseSchema = {
  type: 'object',
  properties: {
    number: { type: 'number' },
    negNumber: { type: 'number' },
    maxNumber: { type: 'number' },
    string: { type: 'string' },
    longString: { type: 'string' },
    boolean: { type: 'boolean' },
    deeplyNested: { $ref: '#/$defs/DeeplyNested' },
  },
  required: [
    'number',
    'negNumber',
    'maxNumber',
    'string',
    'longString',
    'boolean',
    'deeplyNested',
  ],
  $defs: {
    DeeplyNested: {
      type: 'object',
      properties: {
        foo: { type: 'string' },
        num: { type: 'number' },
        bool: { type: 'boolean' },
      },
      required: ['foo', 'num', 'bool'],
    },
  },
};

async function main() {
  const files = await buildValidatorSchema(looseSchema, 'DataType');

  // bundled to `build/generate.cjs` before running, hence the `../src`
  const outDir = join(__dirname, '..', 'src', 'generated');

  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });

  for (const file of files) {
    writeFileSync(join(outDir, file.filename), file.content);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
