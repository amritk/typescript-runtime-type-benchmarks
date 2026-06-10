import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { buildSchema } from '@amritk/generate-parsers';
import { buildValidatorSchema } from '@amritk/generate-validators';

// Ahead-of-time counterpart to the runtime `cases/mjst` case, generated from
// the same schemas (inline nested object, loose vs. strict via
// `additionalProperties: false`):
//
// - `@amritk/generate-validators` emits the loose/strict validators used by
//   the assert benchmarks and parseStrict.
// - `@amritk/generate-parsers` emits a strict, stripUnknown parser for
//   parseSafe: it throws on wrong types / missing required properties and
//   builds its result from declared properties only, so unknown keys are
//   removed at every nesting level.
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

// bundled to `build/generate.cjs` before running, hence the `../src`
const outDir = join(__dirname, '..', 'src', 'generated');

function writeFiles(dir: string, files: { filename: string; content: string }[]) {
  for (const file of files) {
    const target = join(dir, file.filename);

    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, file.content);
  }
}

async function main() {
  rmSync(outDir, { recursive: true, force: true });

  for (const [name, schema] of [
    ['loose', looseSchema],
    ['strict', strictSchema],
  ] as const) {
    writeFiles(join(outDir, name), await buildValidatorSchema(schema, 'DataType'));
  }

  // strict (throw on type/shape mismatches) + stripUnknown (drop undeclared
  // keys from the result) — the parseSafe semantics. Helpers stay imports from
  // @amritk/helpers ('package' mode): the embedded mode reads helper sources
  // via import.meta.url, which this script loses when esbuild bundles it to
  // CJS, and the case bundle inlines the imports anyway.
  const parserFiles = await buildSchema(
    looseSchema,
    'DataType',
    undefined,
    undefined,
    undefined,
    true, // strict
    'package',
    './',
    false,
    true, // stripUnknown
  );

  writeFiles(join(outDir, 'parse'), parserFiles);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
