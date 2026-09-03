import type { SuiteAPI, ExpectStatic, TestAPI } from 'vitest';
export interface BenchmarkCase {
    readonly moduleName: string;
    run(): void;
    test(describe: SuiteAPI, expect: ExpectStatic, test: TestAPI): void;
}
export declare abstract class Benchmark<Fn> implements BenchmarkCase {
    readonly moduleName: string;
    readonly fn: Fn;
    constructor(moduleName: string, fn: Fn);
    abstract run(): void;
    abstract test(describe: SuiteAPI, expect: ExpectStatic, test: TestAPI): void;
}
export type UnknownData = any;
export interface BenchmarkResult {
    name: string;
    benchmark: string;
    runtime: string;
    runtimeVersion: string;
    ops: number;
    margin: number;
}
