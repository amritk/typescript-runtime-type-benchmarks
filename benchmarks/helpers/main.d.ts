/**
 * Run all registered benchmarks and append the results to a file.
 */
export declare function runAllBenchmarks(): Promise<void>;
/**
 * Remove the results json file.
 */
export declare function deleteResults(): void;
/**
 * Generate the preview svg shown in the readme.
 */
export declare function createPreviewGraph(): Promise<void>;
