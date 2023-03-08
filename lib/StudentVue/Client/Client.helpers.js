(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "tiny-async-pool"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("tiny-async-pool"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.tinyAsyncPool);
    global.ClientHelpers = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _tinyAsyncPool) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.asyncPoolAll = asyncPoolAll;
  _exports.optional = optional;
  _tinyAsyncPool = _interopRequireDefault(_tinyAsyncPool);
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  /**
   * Use concurrency limits to fulfill promises
   * @param poolLimit The concurrency limit
   * @param array An array of Promises
   * @param iteratorFn A map function
   * @returns Returns the results of each promise.
   */
  async function asyncPoolAll(poolLimit, array, iteratorFn) {
    const results = [];
    for await (const result of (0, _tinyAsyncPool.default)(poolLimit, array, iteratorFn)) {
      results.push(result);
    }
    return results;
  }

  /**
   * A short and simplified version of the single-line if-else statement.
   * @param xmlArr The input is a value parsed from the XML parser library. It will be an array
   * @returns Returns undefined or the value of the XML
   */
  function optional(xmlArr) {
    return xmlArr ? xmlArr[0] : undefined;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3luY1Bvb2xBbGwiLCJwb29sTGltaXQiLCJhcnJheSIsIml0ZXJhdG9yRm4iLCJyZXN1bHRzIiwicmVzdWx0IiwiYXN5bmNQb29sIiwicHVzaCIsIm9wdGlvbmFsIiwieG1sQXJyIiwidW5kZWZpbmVkIl0sInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL1N0dWRlbnRWdWUvQ2xpZW50L0NsaWVudC5oZWxwZXJzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBhc3luY1Bvb2wgZnJvbSAndGlueS1hc3luYy1wb29sJztcblxuLyoqXG4gKiBVc2UgY29uY3VycmVuY3kgbGltaXRzIHRvIGZ1bGZpbGwgcHJvbWlzZXNcbiAqIEBwYXJhbSBwb29sTGltaXQgVGhlIGNvbmN1cnJlbmN5IGxpbWl0XG4gKiBAcGFyYW0gYXJyYXkgQW4gYXJyYXkgb2YgUHJvbWlzZXNcbiAqIEBwYXJhbSBpdGVyYXRvckZuIEEgbWFwIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyBSZXR1cm5zIHRoZSByZXN1bHRzIG9mIGVhY2ggcHJvbWlzZS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFzeW5jUG9vbEFsbDxJTiwgT1VUPihcbiAgcG9vbExpbWl0OiBudW1iZXIsXG4gIGFycmF5OiByZWFkb25seSBJTltdLFxuICBpdGVyYXRvckZuOiAoZ2VuZXJhdG9yOiBJTikgPT4gUHJvbWlzZTxPVVQ+XG4pIHtcbiAgY29uc3QgcmVzdWx0czogQXdhaXRlZDxPVVQ+W10gPSBbXTtcbiAgZm9yIGF3YWl0IChjb25zdCByZXN1bHQgb2YgYXN5bmNQb29sKHBvb2xMaW1pdCwgYXJyYXksIGl0ZXJhdG9yRm4pKSB7XG4gICAgcmVzdWx0cy5wdXNoKHJlc3VsdCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbi8qKlxuICogQSBzaG9ydCBhbmQgc2ltcGxpZmllZCB2ZXJzaW9uIG9mIHRoZSBzaW5nbGUtbGluZSBpZi1lbHNlIHN0YXRlbWVudC5cbiAqIEBwYXJhbSB4bWxBcnIgVGhlIGlucHV0IGlzIGEgdmFsdWUgcGFyc2VkIGZyb20gdGhlIFhNTCBwYXJzZXIgbGlicmFyeS4gSXQgd2lsbCBiZSBhbiBhcnJheVxuICogQHJldHVybnMgUmV0dXJucyB1bmRlZmluZWQgb3IgdGhlIHZhbHVlIG9mIHRoZSBYTUxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9wdGlvbmFsPFQ+KHhtbEFycj86IFRbXSk6IFQgfCB1bmRlZmluZWQge1xuICByZXR1cm4geG1sQXJyID8geG1sQXJyWzBdIDogdW5kZWZpbmVkO1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDTyxlQUFlQSxZQUFZLENBQ2hDQyxTQUFpQixFQUNqQkMsS0FBb0IsRUFDcEJDLFVBQTJDLEVBQzNDO0lBQ0EsTUFBTUMsT0FBdUIsR0FBRyxFQUFFO0lBQ2xDLFdBQVcsTUFBTUMsTUFBTSxJQUFJLElBQUFDLHNCQUFTLEVBQUNMLFNBQVMsRUFBRUMsS0FBSyxFQUFFQyxVQUFVLENBQUMsRUFBRTtNQUNsRUMsT0FBTyxDQUFDRyxJQUFJLENBQUNGLE1BQU0sQ0FBQztJQUN0QjtJQUNBLE9BQU9ELE9BQU87RUFDaEI7O0VBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNPLFNBQVNJLFFBQVEsQ0FBSUMsTUFBWSxFQUFpQjtJQUN2RCxPQUFPQSxNQUFNLEdBQUdBLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBR0MsU0FBUztFQUN2QztBQUFDIn0=