// Point the benchmark's `@amritk/*` dependencies at a local mjst checkout so
// the `mjst` / `mjst-(ahead-of-time)` cases run against working-tree source
// instead of the published npm releases. This lets you optimize mjst and
// benchmark the result without a publish round-trip.
//
// How it works:
//   - We symlink node_modules/@amritk/<pkg> -> <mjst>/packages/<pkg> for the
//     packages the benchmark imports at build time.
//   - The compile:mjst / compile:mjst-aot esbuild steps pass
//     `--conditions=development`, which mjst's package.json maps to its
//     TypeScript source (`./src/*.ts`). So edits to mjst source are picked up
//     on the next `npm run compile:mjst{,-aot}` with no rebuild.
//   - The standalone `tsc` declaration step has no `development` condition, so
//     it resolves the built `dist/*.d.ts` instead. That only types the tiny,
//     locally-annotated case files, so a one-time `bun run build` in mjst is
//     enough; public API changes need a rebuild, perf tweaks do not.
//
// The published `@amritk/*` releases have the `development` condition stripped,
// so `--conditions=development` is a no-op for them. Run `npm run unlink:mjst`
// (i.e. `bun install`) to restore the published versions.
//
// Override the checkout location with MJST_DIR; defaults to the sibling
// directory `../mjst`.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, symlinkSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Packages the benchmark imports directly while building the mjst cases.
// Transitive mjst deps (e.g. generate-markdown) resolve through mjst's own
// per-package node_modules as esbuild follows the source.
const PACKAGES = [
  'runtime-validators',
  'generate-parsers',
  'generate-validators',
  'helpers',
];

const benchmarkRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mjstDir = resolve(
  benchmarkRoot,
  process.env.MJST_DIR ?? join('..', 'mjst'),
);

if (!existsSync(join(mjstDir, 'package.json'))) {
  console.error(
    `Could not find an mjst checkout at ${mjstDir}.\n` +
      'Clone it next to this repo or set MJST_DIR to its path.',
  );
  process.exit(1);
}

const run = (cmd, args, cwd) => {
  const result = spawnSync(cmd, args, { cwd, stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`\n\`${cmd} ${args.join(' ')}\` failed in ${cwd}`);
    process.exit(result.status ?? 1);
  }
};

// Make sure mjst is installed and built: esbuild reads its source, but the
// declaration step reads dist/*.d.ts.
if (!existsSync(join(mjstDir, 'node_modules'))) {
  console.log(`Installing mjst dependencies in ${mjstDir}...`);
  run('bun', ['install'], mjstDir);
}
if (!existsSync(join(mjstDir, 'packages', 'runtime-validators', 'dist'))) {
  console.log(`Building mjst in ${mjstDir}...`);
  run('bun', ['run', 'build'], mjstDir);
}

const scope = join(benchmarkRoot, 'node_modules', '@amritk');
mkdirSync(scope, { recursive: true });

for (const pkg of PACKAGES) {
  const linkPath = join(scope, pkg);
  const target = join(mjstDir, 'packages', pkg);
  rmSync(linkPath, { recursive: true, force: true });
  // Relative target keeps the link valid if the repos move together.
  symlinkSync(relative(scope, target), linkPath, 'dir');
  console.log(`linked @amritk/${pkg} -> ${relative(benchmarkRoot, target)}`);
}

console.log(
  '\nLinked the mjst cases to local source. Rebuild them with:\n' +
    '  npm run compile:mjst && npm run compile:mjst-aot\n' +
    'Restore the published releases with: npm run unlink:mjst',
);
