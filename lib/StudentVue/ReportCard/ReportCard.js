(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../Client/Client.helpers", "../File/File"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../Client/Client.helpers"), require("../File/File"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Client, global.File);
    global.ReportCard = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _Client, _File) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _File = _interopRequireDefault(_File);
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  /**
   * ReportCard class
   * @class
   * @extends {File<ReportCardFile>}
   */
  class ReportCard extends _File.default {
    parseXMLObject(xmlObject) {
      if ('DocumentData' in xmlObject) {
        return {
          document: {
            name: xmlObject.DocumentData[0]['@_DocFileName'][0],
            type: xmlObject.DocumentData[0]['@_DocType'][0]
          },
          name: xmlObject.DocumentData[0]['@_FileName'][0],
          base64: xmlObject.DocumentData[0].Base64Code[0]
        };
      }
      return undefined;
    }
    constructor(xmlObj, credentials) {
      super(credentials, xmlObj['@_DocumentGU'][0], 'GetReportCardDocumentData');
      /**
       * The date of the report card
       * @public
       * @readonly
       * @type {Date}
       */
      this.date = (0, _Client.parseDateString)(xmlObj['@_EndDate'][0]);
      /**
       * The time period of the report card
       * @public
       * @readonly
       * @type {string}
       */
      this.periodName = xmlObj['@_ReportingPeriodName'][0];
    }
  }
  _exports.default = ReportCard;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZXBvcnRDYXJkIiwiRmlsZSIsInBhcnNlWE1MT2JqZWN0IiwieG1sT2JqZWN0IiwiZG9jdW1lbnQiLCJuYW1lIiwiRG9jdW1lbnREYXRhIiwidHlwZSIsImJhc2U2NCIsIkJhc2U2NENvZGUiLCJ1bmRlZmluZWQiLCJjb25zdHJ1Y3RvciIsInhtbE9iaiIsImNyZWRlbnRpYWxzIiwiZGF0ZSIsInBhcnNlRGF0ZVN0cmluZyIsInBlcmlvZE5hbWUiXSwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvU3R1ZGVudFZ1ZS9SZXBvcnRDYXJkL1JlcG9ydENhcmQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9naW5DcmVkZW50aWFscyB9IGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcbmltcG9ydCB7IHBhcnNlRGF0ZVN0cmluZyB9IGZyb20gJy4uL0NsaWVudC9DbGllbnQuaGVscGVycyc7XG5pbXBvcnQgRmlsZSBmcm9tICcuLi9GaWxlL0ZpbGUnO1xuaW1wb3J0IHsgUmVwb3J0Q2FyZEZpbGUgfSBmcm9tICcuL1JlcG9ydENhcmQuaW50ZXJmYWNlcyc7XG5pbXBvcnQge1xuICBSZXBvcnRDYXJkQmFzZTY0WE1MT2JqZWN0LFxuICBSZXBvcnRDYXJkc1hNTE9iamVjdCxcbn0gZnJvbSAnLi9SZXBvcnRDYXJkLnhtbCc7XG5cbi8qKlxuICogUmVwb3J0Q2FyZCBjbGFzc1xuICogQGNsYXNzXG4gKiBAZXh0ZW5kcyB7RmlsZTxSZXBvcnRDYXJkRmlsZT59XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlcG9ydENhcmQgZXh0ZW5kcyBGaWxlPFJlcG9ydENhcmRGaWxlIHwgdW5kZWZpbmVkPiB7XG4gIHB1YmxpYyByZWFkb25seSBkYXRlOiBEYXRlO1xuXG4gIHB1YmxpYyByZWFkb25seSBwZXJpb2ROYW1lOiBzdHJpbmc7XG5cbiAgcHJvdGVjdGVkIHBhcnNlWE1MT2JqZWN0KFxuICAgIHhtbE9iamVjdDogUmVwb3J0Q2FyZEJhc2U2NFhNTE9iamVjdFxuICApOiBSZXBvcnRDYXJkRmlsZSB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKCdEb2N1bWVudERhdGEnIGluIHhtbE9iamVjdClcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGRvY3VtZW50OiB7XG4gICAgICAgICAgbmFtZTogeG1sT2JqZWN0LkRvY3VtZW50RGF0YVswXVsnQF9Eb2NGaWxlTmFtZSddWzBdLFxuICAgICAgICAgIHR5cGU6IHhtbE9iamVjdC5Eb2N1bWVudERhdGFbMF1bJ0BfRG9jVHlwZSddWzBdLFxuICAgICAgICB9LFxuICAgICAgICBuYW1lOiB4bWxPYmplY3QuRG9jdW1lbnREYXRhWzBdWydAX0ZpbGVOYW1lJ11bMF0sXG4gICAgICAgIGJhc2U2NDogeG1sT2JqZWN0LkRvY3VtZW50RGF0YVswXS5CYXNlNjRDb2RlWzBdLFxuICAgICAgfTtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICB4bWxPYmo6IFJlcG9ydENhcmRzWE1MT2JqZWN0WydSQ1JlcG9ydGluZ1BlcmlvZERhdGEnXVswXVsnUkNSZXBvcnRpbmdQZXJpb2RzJ11bMF1bJ1JDUmVwb3J0aW5nUGVyaW9kJ11bMF0sXG4gICAgY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHNcbiAgKSB7XG4gICAgc3VwZXIoY3JlZGVudGlhbHMsIHhtbE9ialsnQF9Eb2N1bWVudEdVJ11bMF0sICdHZXRSZXBvcnRDYXJkRG9jdW1lbnREYXRhJyk7XG4gICAgLyoqXG4gICAgICogVGhlIGRhdGUgb2YgdGhlIHJlcG9ydCBjYXJkXG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtEYXRlfVxuICAgICAqL1xuICAgIHRoaXMuZGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyh4bWxPYmpbJ0BfRW5kRGF0ZSddWzBdKTtcbiAgICAvKipcbiAgICAgKiBUaGUgdGltZSBwZXJpb2Qgb2YgdGhlIHJlcG9ydCBjYXJkXG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5wZXJpb2ROYW1lID0geG1sT2JqWydAX1JlcG9ydGluZ1BlcmlvZE5hbWUnXVswXTtcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0VBQ2UsTUFBTUEsVUFBVSxTQUFTQyxhQUFJLENBQTZCO0lBSzdEQyxjQUFjLENBQ3RCQyxTQUFvQyxFQUNSO01BQzVCLElBQUksY0FBYyxJQUFJQSxTQUFTO1FBQzdCLE9BQU87VUFDTEMsUUFBUSxFQUFFO1lBQ1JDLElBQUksRUFBRUYsU0FBUyxDQUFDRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25EQyxJQUFJLEVBQUVKLFNBQVMsQ0FBQ0csWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7VUFDaEQsQ0FBQztVQUNERCxJQUFJLEVBQUVGLFNBQVMsQ0FBQ0csWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztVQUNoREUsTUFBTSxFQUFFTCxTQUFTLENBQUNHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQ0csVUFBVSxDQUFDLENBQUM7UUFDaEQsQ0FBQztNQUFDO01BQ0osT0FBT0MsU0FBUztJQUNsQjtJQUNPQyxXQUFXLENBQ2hCQyxNQUF5RyxFQUN6R0MsV0FBNkIsRUFDN0I7TUFDQSxLQUFLLENBQUNBLFdBQVcsRUFBRUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLDJCQUEyQixDQUFDO01BQzFFO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtNQUNJLElBQUksQ0FBQ0UsSUFBSSxHQUFHLElBQUFDLHVCQUFlLEVBQUNILE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNuRDtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7TUFDSSxJQUFJLENBQUNJLFVBQVUsR0FBR0osTUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3REO0VBQ0Y7RUFBQztBQUFBIn0=