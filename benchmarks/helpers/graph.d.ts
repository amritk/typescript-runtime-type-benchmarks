import type { BenchmarkResult } from './types';
interface PreviewGraphParams {
    values: BenchmarkResult[];
    filename: string;
}
export declare function writePreviewGraph(params: PreviewGraphParams): Promise<void>;
export {};
