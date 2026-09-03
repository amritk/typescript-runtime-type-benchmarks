import { Benchmark } from './helpers/types';
import type { ExpectStatic, SuiteAPI, TestAPI } from 'vitest';
type Fn = (data: unknown) => boolean;
/**
 * Check that an object conforms to the schema.
 *
 * Raise errors if any extra keys not present in the schema are found.
 */
export declare class AssertStrict extends Benchmark<Fn> {
    run(): void;
    test(describe: SuiteAPI, expect: ExpectStatic, test: TestAPI): void;
}
export {};
