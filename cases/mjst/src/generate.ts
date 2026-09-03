import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { buildSchema } from '@amritk/generate-parsers';
import { buildValidatorSchema } from '@amritk/generate-validators';

// `mjst` (https://github.com/amritk/mjst) generates its checkers ahead of time
// from a JSON Schema (Draft 2020-12) — there is no schema DSL and no runtime
// schema object: the two generators below emit plain TypeScript source, which
// this repo then bundles (see `compile:mjst`) and benchmarks.
//
// Two packages cover the four benchmark modes, each used for what it is built
// for:
//
//   - `@amritk/generate-parsers`    -> `parseSafe` / `parseStrict`
//     Emits a `parseX` that validates and returns a value built from the
//     declared properties.
//   - `@amritk/generate-validators` -> `assertLoose` / `assertStrict`
//     Emits the cheaper predicate `isX`, which only answers "does this match?"
//     without constructing anything.

type Schema = Parameters<typeof buildSchema>[0];

/**
 * The benchmark shape as a JSON Schema. `closed` adds
 * `additionalProperties: false` at both levels, which is what makes the
 * generated code reject unknown keys (the `*Strict` variants).
 */
const schema = (closed: boolean): Schema =>
  ({
    type: 'object',
    properties: {
      number: { type: 'number' },
      negNumber: { type: 'number' },
      maxNumber: { type: 'number' },
      string: { type: 'string' },
      longString: { type: 'string' },
      boolean: { type: 'boolean' },
      deeplyNested: {
        type: 'object',
        properties: {
          foo: { type: 'string' },
          num: { type: 'number' },
          bool: { type: 'boolean' },
        },
        required: ['foo', 'num', 'bool'],
        ...(closed ? { additionalProperties: false } : {}),
      },
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
    ...(closed ? { additionalProperties: false } : {}),
  }) as Schema;

const outDir = join(process.cwd(), 'cases', 'mjst', 'src', 'generated');

// Every generation emits its own `index.ts` (and, for the parsers, its own
// embedded `_helpers/`), so each one gets its own directory rather than being
// merged into a single namespace.
function write(dir: string, files: { filename: string; content: string }[]) {
  for (const file of files) {
    const target = join(outDir, dir, file.filename);

    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, file.content);
  }
}

async function main() {
  rmSync(outDir, { recursive: true, force: true });

  // `buildSchema`'s options are positional; named here in comments:
  //   extensions, typesOnly, logWarnings, strict, helpersMode,
  //   helpersImportPrefix, readonly, stripUnknown
  //
  // `strict` makes the parser throw on a missing property or a wrong type
  // instead of coercing it to a default, which is what all four benchmark
  // modes expect. `helpersMode: 'embedded'` emits the handful of runtime
  // helpers next to the output instead of importing `@amritk/helpers`, so the
  // benchmarked module is self-contained.

  // parseSafe: unknown keys are dropped, not rejected — the schema stays open
  // and `stripUnknown` builds every result from the declared properties only.
  write(
    'parse-safe',
    await buildSchema(
      schema(false),
      'ParseSafe',
      undefined,
      false,
      false,
      true,
      'embedded',
      './',
      false,
      true,
    ),
  );

  // parseStrict: `additionalProperties: false` makes an undeclared key throw,
  // at both levels, so there is nothing left to strip.
  write(
    'parse-strict',
    await buildSchema(
      schema(true),
      'ParseStrict',
      undefined,
      false,
      false,
      true,
      'embedded',
      './',
      false,
      false,
    ),
  );

  // The validators take no options: the schema alone decides whether unknown
  // keys are part of the verdict.
  write('assert-loose', await buildValidatorSchema(schema(false), 'AssertLoose'));
  write('assert-strict', await buildValidatorSchema(schema(true), 'AssertStrict'));
}

main().catch(e => {
  throw e;
});
