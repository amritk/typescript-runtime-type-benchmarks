import { AssertLoose } from '../assertLoose';
import { AssertStrict } from '../assertStrict';
import { ParseSafe } from '../parseSafe';
import { ParseStrict } from '../parseStrict';
import type { BenchmarkCase } from './types';
/**
 * Map of all benchmarks.
 */
export declare const availableBenchmarks: {
    parseSafe: typeof ParseSafe;
    parseStrict: typeof ParseStrict;
    assertLoose: typeof AssertLoose;
    assertStrict: typeof AssertStrict;
};
type AvailableBenchmarks = typeof availableBenchmarks;
export type AvailableBenchmarksIds = keyof AvailableBenchmarks;
/**
 * Return the list of all registered benchmarks.
 */
export declare function getRegisteredBenchmarks(): [
    keyof AvailableBenchmarks,
    BenchmarkCase[]
][];
/**
 * Add a specific benchmark implementation for a given library.
 */
export declare function addCase<K extends keyof AvailableBenchmarks, I = AvailableBenchmarks[K]['prototype']['fn']>(moduleName: string, benchmarkId: K, implementation: I, options?: {
    disabled?: boolean;
}): void;
export declare function createCase<K extends keyof AvailableBenchmarks, I = AvailableBenchmarks[K]['prototype']['fn']>(moduleName: string, benchmarkId: K, builder: () => I, options?: {
    disabled?: boolean;
}): void;
export {};
