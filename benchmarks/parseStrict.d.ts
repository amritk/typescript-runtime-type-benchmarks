import { Benchmark } from './helpers/types';
import { validateData } from './parseSafe';
import type { ExpectStatic, SuiteAPI, TestAPI } from 'vitest';
type Fn = (data: unknown) => typeof validateData;
/**
 * Like parseSafe but throw on unknown (extra) keys in objects.
 */
export declare class ParseStrict extends Benchmark<Fn> {
    run(): void;
    test(describe: SuiteAPI, expect: ExpectStatic, test: TestAPI): void;
}
export {};
