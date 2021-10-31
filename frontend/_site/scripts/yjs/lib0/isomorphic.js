/**
 * Isomorphic library exports from isomorphic.js.
 *
 * @module isomorphic
 */

 const perf = typeof performance === 'undefined' ? null : performance;

 const isoCrypto = typeof crypto === 'undefined' ? null : crypto;

 /**
  * @type {function(number):ArrayBuffer}
  */
 const cryptoRandomBuffer = isoCrypto !== null
   ? len => {
     // browser
     const buf = new ArrayBuffer(len);
     const arr = new Uint8Array(buf);
     isoCrypto.getRandomValues(arr);
     return buf
   }
   : len => {
     // polyfill
     const buf = new ArrayBuffer(len);
     const arr = new Uint8Array(buf);
     for (let i = 0; i < len; i++) {
       arr[i] = Math.ceil((Math.random() * 0xFFFFFFFF) >>> 0);
     }
     return buf
   };

 var performance_1 = perf;
 var cryptoRandomBuffer_1 = cryptoRandomBuffer;

 const isoBrowser = {
   performance: performance_1,
   cryptoRandomBuffer: cryptoRandomBuffer_1
 };

 /**
  * Isomorphic library exports from isomorphic.js.
  *
  * @module isomorphic
  */
 const cryptoRandomBuffer$1 = /** @type {any} */ (isoBrowser.cryptoRandomBuffer);

 const rand = Math.random;

 /* istanbul ignore next */
 const uint32 = () => new Uint32Array(cryptoRandomBuffer$1(4))[0];

 // @ts-ignore
 const uuidv4Template = [1e7] + -1e3 + -4e3 + -8e3 + -1e11;
 const uuidv4 = () => uuidv4Template.replace(/[018]/g, /** @param {number} c */ c =>
   (c ^ uint32() & 15 >> c / 4).toString(16)
 );

export { perf as performance, cryptoRandomBuffer };