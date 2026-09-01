import buffer from 'node:buffer';

/**
 * Restore the `buffer.SlowBuffer` export that was removed in Node.js 25.
 *
 * `buffer-equal-constant-time` reads `require('buffer').SlowBuffer.prototype`
 * at import time and is unmaintained (last release 1.0.1, 2014). It is pulled
 * in by `@mondrian-framework/model` through `jsonwebtoken -> jws -> jwa`, so
 * without this shim that benchmark case throws while being imported on Node.js
 * >= 25 and can neither be benchmarked nor tested there.
 *
 * Import this module *before* the offending package. Node.js builtins expose
 * their `module.exports` object as the ESM default export, so assigning to it
 * is visible to later `require('buffer')` calls in both CJS and ESM.
 *
 * Remove this once `jwa` no longer depends on `buffer-equal-constant-time`.
 *
 * @see https://nodejs.org/api/deprecations.html#DEP0030
 */
const bufferModule: { SlowBuffer?: unknown } = buffer;

if (bufferModule.SlowBuffer === undefined) {
  const SlowBuffer = function SlowBuffer(size: number) {
    return Buffer.allocUnsafeSlow(size);
  };

  SlowBuffer.prototype = Object.create(Buffer.prototype);

  bufferModule.SlowBuffer = SlowBuffer;
}
