import { validateGuard } from '@amritk/runtime-validators';

export interface DataType {
  number: number;
  negNumber: number;
  maxNumber: number;
  string: string;
  longString: string;
  boolean: boolean;
  deeplyNested: {
    foo: string;
    num: number;
    bool: boolean;
  };
}

// `@amritk/runtime-validators` interprets plain JSON Schema (Draft 2020-12)
// directly, eval-free and without a compile step. The loose schema ignores
// unknown keys, the strict one rejects them via `additionalProperties: false`.
const looseSchema = {
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
} as const;

const strictSchema = {
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
      additionalProperties: false,
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
  additionalProperties: false,
} as const;

// annotate the exports with local types so the emitted declarations don't
// reference `@amritk/runtime-validators` (which the root CJS tsconfig cannot
// resolve, see the esbuild bundling in the `compile:mjst` npm script)
export const checkLoose: (data: unknown) => data is DataType =
  validateGuard<DataType>(looseSchema);

export const checkStrict: (data: unknown) => data is DataType =
  validateGuard<DataType>(strictSchema);
