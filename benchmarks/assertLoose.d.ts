import { Benchmark } from './helpers/types';
import type { ExpectStatic, SuiteAPI, TestAPI } from 'vitest';
type Fn = (data: unknown) => boolean;
/**
 * Check that an object conforms to the schema.
 *
 * Ignore any extra keys in input objects.
 *
 * Such a validation mode is highly unsafe when used on untrusted input.
 *
 * But not checking for unknown/extra keys in records may provide massive
 * speedups and may suffice in certain scenarios.
 */
export declare class AssertLoose extends Benchmark<Fn> {
    run(): void;
    test(describe: SuiteAPI, expect: ExpectStatic, test: TestAPI): void;
}
export {};
