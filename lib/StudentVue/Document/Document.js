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
    global.Document = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _Client, _File) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _File = _interopRequireDefault(_File);
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  class Document extends _File.default {
    parseXMLObject(xmlObject) {
      var _a = xmlObject.StudentAttachedDocumentData[0].DocumentDatas[0].DocumentData;
      var _f = document => {
        return {
          file: {
            name: document['@_FileName'][0],
            type: document['@_DocType'][0],
            date: (0, _Client.parseDateString)(document['@_DocDate'][0])
          },
          category: document['@_Category'][0],
          notes: document['@_Notes'][0],
          base64: document.Base64Code[0]
        };
      };
      var _r = [];
      for (var _i = 0; _i < _a.length; _i++) {
        _r.push(_f(_a[_i], _i, _a));
      }
      return _r;
    }
    constructor(xmlObj, credentials) {
      super(credentials, xmlObj['@_DocumentGU'][0], 'GetContentOfAttachedDoc');

      /**
       * The properties of the file
       * @public
       * @readonly
       * @property {string} name The name of the file
       * @property {string} type The file type
       * @property {Date} date The date the file was created
       */
      this.file = {
        name: xmlObj['@_DocumentFileName'][0],
        type: xmlObj['@_DocumentType'][0],
        date: (0, _Client.parseDateString)(xmlObj['@_DocumentDate'][0])
      };

      /**
       * The comment included in the document
       * @public
       * @readonly
       * @type {string}
       */
      this.comment = xmlObj['@_DocumentComment'][0];
    }
  }
  _exports.default = Document;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJEb2N1bWVudCIsIkZpbGUiLCJwYXJzZVhNTE9iamVjdCIsInhtbE9iamVjdCIsIlN0dWRlbnRBdHRhY2hlZERvY3VtZW50RGF0YSIsIkRvY3VtZW50RGF0YXMiLCJEb2N1bWVudERhdGEiLCJkb2N1bWVudCIsImZpbGUiLCJuYW1lIiwidHlwZSIsImRhdGUiLCJwYXJzZURhdGVTdHJpbmciLCJjYXRlZ29yeSIsIm5vdGVzIiwiYmFzZTY0IiwiQmFzZTY0Q29kZSIsImNvbnN0cnVjdG9yIiwieG1sT2JqIiwiY3JlZGVudGlhbHMiLCJjb21tZW50Il0sInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL1N0dWRlbnRWdWUvRG9jdW1lbnQvRG9jdW1lbnQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTG9naW5DcmVkZW50aWFscyB9IGZyb20gJy4uLy4uL3V0aWxzL3NvYXAvQ2xpZW50L0NsaWVudC5pbnRlcmZhY2VzJztcbmltcG9ydCB7IHBhcnNlRGF0ZVN0cmluZyB9IGZyb20gJy4uL0NsaWVudC9DbGllbnQuaGVscGVycyc7XG5pbXBvcnQgRmlsZSBmcm9tICcuLi9GaWxlL0ZpbGUnO1xuaW1wb3J0IHsgRG9jdW1lbnRGaWxlIH0gZnJvbSAnLi9Eb2N1bWVudC5pbnRlcmZhY2VzJztcbmltcG9ydCB7IERvY3VtZW50RmlsZVhNTE9iamVjdCwgRG9jdW1lbnRYTUxPYmplY3QgfSBmcm9tICcuL0RvY3VtZW50LnhtbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvY3VtZW50IGV4dGVuZHMgRmlsZTxEb2N1bWVudEZpbGVbXT4ge1xuICBwdWJsaWMgcmVhZG9ubHkgZmlsZToge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBkYXRlOiBEYXRlO1xuICAgIHR5cGU6IHN0cmluZztcbiAgfTtcblxuICBwdWJsaWMgcmVhZG9ubHkgY29tbWVudDogc3RyaW5nO1xuICBwcm90ZWN0ZWQgcGFyc2VYTUxPYmplY3QoeG1sT2JqZWN0OiBEb2N1bWVudEZpbGVYTUxPYmplY3QpIHtcbiAgICByZXR1cm4geG1sT2JqZWN0LlN0dWRlbnRBdHRhY2hlZERvY3VtZW50RGF0YVswXS5Eb2N1bWVudERhdGFzWzBdLkRvY3VtZW50RGF0YS5tYXAoXG4gICAgICAoZG9jdW1lbnQpID0+ICh7XG4gICAgICAgIGZpbGU6IHtcbiAgICAgICAgICBuYW1lOiBkb2N1bWVudFsnQF9GaWxlTmFtZSddWzBdLFxuICAgICAgICAgIHR5cGU6IGRvY3VtZW50WydAX0RvY1R5cGUnXVswXSxcbiAgICAgICAgICBkYXRlOiBwYXJzZURhdGVTdHJpbmcoZG9jdW1lbnRbJ0BfRG9jRGF0ZSddWzBdKSxcbiAgICAgICAgfSxcbiAgICAgICAgY2F0ZWdvcnk6IGRvY3VtZW50WydAX0NhdGVnb3J5J11bMF0sXG4gICAgICAgIG5vdGVzOiBkb2N1bWVudFsnQF9Ob3RlcyddWzBdLFxuICAgICAgICBiYXNlNjQ6IGRvY3VtZW50LkJhc2U2NENvZGVbMF0sXG4gICAgICB9KVxuICAgICk7XG4gIH1cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIHhtbE9iajogRG9jdW1lbnRYTUxPYmplY3RbJ1N0dWRlbnREb2N1bWVudHMnXVswXVsnU3R1ZGVudERvY3VtZW50RGF0YXMnXVswXVsnU3R1ZGVudERvY3VtZW50RGF0YSddWzBdLFxuICAgIGNyZWRlbnRpYWxzOiBMb2dpbkNyZWRlbnRpYWxzXG4gICkge1xuICAgIHN1cGVyKGNyZWRlbnRpYWxzLCB4bWxPYmpbJ0BfRG9jdW1lbnRHVSddWzBdLCAnR2V0Q29udGVudE9mQXR0YWNoZWREb2MnKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBwcm9wZXJ0aWVzIG9mIHRoZSBmaWxlXG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBmaWxlXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHR5cGUgVGhlIGZpbGUgdHlwZVxuICAgICAqIEBwcm9wZXJ0eSB7RGF0ZX0gZGF0ZSBUaGUgZGF0ZSB0aGUgZmlsZSB3YXMgY3JlYXRlZFxuICAgICAqL1xuICAgIHRoaXMuZmlsZSA9IHtcbiAgICAgIG5hbWU6IHhtbE9ialsnQF9Eb2N1bWVudEZpbGVOYW1lJ11bMF0sXG4gICAgICB0eXBlOiB4bWxPYmpbJ0BfRG9jdW1lbnRUeXBlJ11bMF0sXG4gICAgICBkYXRlOiBwYXJzZURhdGVTdHJpbmcoeG1sT2JqWydAX0RvY3VtZW50RGF0ZSddWzBdKSxcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVGhlIGNvbW1lbnQgaW5jbHVkZWQgaW4gdGhlIGRvY3VtZW50XG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5jb21tZW50ID0geG1sT2JqWydAX0RvY3VtZW50Q29tbWVudCddWzBdO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQU1lLE1BQU1BLFFBQVEsU0FBU0MsYUFBSSxDQUFpQjtJQVEvQ0MsY0FBYyxDQUFDQyxTQUFnQyxFQUFFO01BQUEsU0FDbERBLFNBQVMsQ0FBQ0MsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLENBQUNDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsWUFBWTtNQUFBLFNBQzFFQyxRQUFRO1FBQUEsT0FBTTtVQUNiQyxJQUFJLEVBQUU7WUFDSkMsSUFBSSxFQUFFRixRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9CRyxJQUFJLEVBQUVILFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUJJLElBQUksRUFBRSxJQUFBQyx1QkFBZSxFQUFDTCxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1VBQ2hELENBQUM7VUFDRE0sUUFBUSxFQUFFTixRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1VBQ25DTyxLQUFLLEVBQUVQLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7VUFDN0JRLE1BQU0sRUFBRVIsUUFBUSxDQUFDUyxVQUFVLENBQUMsQ0FBQztRQUMvQixDQUFDO01BQUEsQ0FBQztNQUFBO01BQUE7UUFBQTtNQUFBO01BVko7SUFZRjtJQUNPQyxXQUFXLENBQ2hCQyxNQUFxRyxFQUNyR0MsV0FBNkIsRUFDN0I7TUFDQSxLQUFLLENBQUNBLFdBQVcsRUFBRUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLHlCQUF5QixDQUFDOztNQUV4RTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO01BQ0ksSUFBSSxDQUFDVixJQUFJLEdBQUc7UUFDVkMsSUFBSSxFQUFFUyxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckNSLElBQUksRUFBRVEsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDUCxJQUFJLEVBQUUsSUFBQUMsdUJBQWUsRUFBQ00sTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ25ELENBQUM7O01BRUQ7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO01BQ0ksSUFBSSxDQUFDRSxPQUFPLEdBQUdGLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMvQztFQUNGO0VBQUM7QUFBQSJ9