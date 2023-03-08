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
  _exports.parseDateString = parseDateString;
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

  /**
   * Parsing a string to a Date
   * @param dateString The input is a date string
   * @returns Returns Date object
   */
  function parseDateString(dateString) {
    const m = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    return m ? new Date(parseInt(m[3]), parseInt(m[1]) - 1, parseInt(m[2])) : new Date(dateString);
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhc3luY1Bvb2xBbGwiLCJwb29sTGltaXQiLCJhcnJheSIsIml0ZXJhdG9yRm4iLCJyZXN1bHRzIiwicmVzdWx0IiwiYXN5bmNQb29sIiwicHVzaCIsIm9wdGlvbmFsIiwieG1sQXJyIiwidW5kZWZpbmVkIiwicGFyc2VEYXRlU3RyaW5nIiwiZGF0ZVN0cmluZyIsIm0iLCJtYXRjaCIsIkRhdGUiLCJwYXJzZUludCJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL0NsaWVudC9DbGllbnQuaGVscGVycy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYXN5bmNQb29sIGZyb20gJ3RpbnktYXN5bmMtcG9vbCc7XG5cbi8qKlxuICogVXNlIGNvbmN1cnJlbmN5IGxpbWl0cyB0byBmdWxmaWxsIHByb21pc2VzXG4gKiBAcGFyYW0gcG9vbExpbWl0IFRoZSBjb25jdXJyZW5jeSBsaW1pdFxuICogQHBhcmFtIGFycmF5IEFuIGFycmF5IG9mIFByb21pc2VzXG4gKiBAcGFyYW0gaXRlcmF0b3JGbiBBIG1hcCBmdW5jdGlvblxuICogQHJldHVybnMgUmV0dXJucyB0aGUgcmVzdWx0cyBvZiBlYWNoIHByb21pc2UuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhc3luY1Bvb2xBbGw8SU4sIE9VVD4oXG4gIHBvb2xMaW1pdDogbnVtYmVyLFxuICBhcnJheTogcmVhZG9ubHkgSU5bXSxcbiAgaXRlcmF0b3JGbjogKGdlbmVyYXRvcjogSU4pID0+IFByb21pc2U8T1VUPlxuKSB7XG4gIGNvbnN0IHJlc3VsdHM6IEF3YWl0ZWQ8T1VUPltdID0gW107XG4gIGZvciBhd2FpdCAoY29uc3QgcmVzdWx0IG9mIGFzeW5jUG9vbChwb29sTGltaXQsIGFycmF5LCBpdGVyYXRvckZuKSkge1xuICAgIHJlc3VsdHMucHVzaChyZXN1bHQpO1xuICB9XG4gIHJldHVybiByZXN1bHRzO1xufVxuXG4vKipcbiAqIEEgc2hvcnQgYW5kIHNpbXBsaWZpZWQgdmVyc2lvbiBvZiB0aGUgc2luZ2xlLWxpbmUgaWYtZWxzZSBzdGF0ZW1lbnQuXG4gKiBAcGFyYW0geG1sQXJyIFRoZSBpbnB1dCBpcyBhIHZhbHVlIHBhcnNlZCBmcm9tIHRoZSBYTUwgcGFyc2VyIGxpYnJhcnkuIEl0IHdpbGwgYmUgYW4gYXJyYXlcbiAqIEByZXR1cm5zIFJldHVybnMgdW5kZWZpbmVkIG9yIHRoZSB2YWx1ZSBvZiB0aGUgWE1MXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvcHRpb25hbDxUPih4bWxBcnI/OiBUW10pOiBUIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIHhtbEFyciA/IHhtbEFyclswXSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBQYXJzaW5nIGEgc3RyaW5nIHRvIGEgRGF0ZVxuICogQHBhcmFtIGRhdGVTdHJpbmcgVGhlIGlucHV0IGlzIGEgZGF0ZSBzdHJpbmdcbiAqIEByZXR1cm5zIFJldHVybnMgRGF0ZSBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRGF0ZVN0cmluZyhkYXRlU3RyaW5nOiBzdHJpbmcpIHtcbiAgY29uc3QgbSA9IGRhdGVTdHJpbmcubWF0Y2goL14oXFxkezEsMn0pXFwvKFxcZHsxLDJ9KVxcLyhcXGR7NH0pJC8pO1xuICByZXR1cm4gbVxuICAgID8gbmV3IERhdGUocGFyc2VJbnQobVszXSksIHBhcnNlSW50KG1bMV0pIC0gMSwgcGFyc2VJbnQobVsyXSkpXG4gICAgOiBuZXcgRGF0ZShkYXRlU3RyaW5nKTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtFQUNPLGVBQWVBLFlBQVksQ0FDaENDLFNBQWlCLEVBQ2pCQyxLQUFvQixFQUNwQkMsVUFBMkMsRUFDM0M7SUFDQSxNQUFNQyxPQUF1QixHQUFHLEVBQUU7SUFDbEMsV0FBVyxNQUFNQyxNQUFNLElBQUksSUFBQUMsc0JBQVMsRUFBQ0wsU0FBUyxFQUFFQyxLQUFLLEVBQUVDLFVBQVUsQ0FBQyxFQUFFO01BQ2xFQyxPQUFPLENBQUNHLElBQUksQ0FBQ0YsTUFBTSxDQUFDO0lBQ3RCO0lBQ0EsT0FBT0QsT0FBTztFQUNoQjs7RUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ08sU0FBU0ksUUFBUSxDQUFJQyxNQUFZLEVBQWlCO0lBQ3ZELE9BQU9BLE1BQU0sR0FBR0EsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHQyxTQUFTO0VBQ3ZDOztFQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7RUFDTyxTQUFTQyxlQUFlLENBQUNDLFVBQWtCLEVBQUU7SUFDbEQsTUFBTUMsQ0FBQyxHQUFHRCxVQUFVLENBQUNFLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQztJQUM3RCxPQUFPRCxDQUFDLEdBQ0osSUFBSUUsSUFBSSxDQUFDQyxRQUFRLENBQUNILENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFRyxRQUFRLENBQUNILENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRUcsUUFBUSxDQUFDSCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUM1RCxJQUFJRSxJQUFJLENBQUNILFVBQVUsQ0FBQztFQUMxQjtBQUFDIn0=