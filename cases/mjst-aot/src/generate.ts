import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildValidatorSchema } from '@amritk/generate-validators';

// Ahead-of-time counterpart to the runtime `cases/mjst` case: mjst's
// `@amritk/generate-validators` emits standalone TypeScript validator source
// from a JSON Schema at build time. The schemas mirror the runtime case
// exactly (inline nested object, loose vs. strict via
// `additionalProperties: false`), so the two cases measure the generated
// straight-line validator against the runtime schema interpreter over the
// same shapes.
const properties = {
  number: { type: 'number' },
  negNumber: { type: 'number' },
  maxNumber: { type: 'number' },
  string: { type: 'string' },
  longString: { type: 'string' },
  boolean: { type: 'boolean' },
};

const required = [
  'number',
  'negNumber',
  'maxNumber',
  'string',
  'longString',
  'boolean',
  'deeplyNested',
];

const nestedProperties = {
  foo: { type: 'string' },
  num: { type: 'number' },
  bool: { type: 'boolean' },
};

const nestedRequired = ['foo', 'num', 'bool'];

const looseSchema = {
  type: 'object',
  properties: {
    ...properties,
    deeplyNested: {
      type: 'object',
      properties: nestedProperties,
      required: nestedRequired,
    },
  },
  required,
};

const strictSchema = {
  type: 'object',
  properties: {
    ...properties,
    deeplyNested: {
      type: 'object',
      properties: nestedProperties,
      required: nestedRequired,
      additionalProperties: false,
    },
  },
  required,
  additionalProperties: false,
};

async function main() {
  // bundled to `build/generate.cjs` before running, hence the `../src`
  const outDir = join(__dirname, '..', 'src', 'generated');

  rmSync(outDir, { recursive: true, force: true });

  for (const [name, schema] of [
    ['loose', looseSchema],
    ['strict', strictSchema],
  ] as const) {
    const files = await buildValidatorSchema(schema, 'DataType');
    const dir = join(outDir, name);

    mkdirSync(dir, { recursive: true });

    for (const file of files) {
      writeFileSync(join(dir, file.filename), file.content);
    }
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
