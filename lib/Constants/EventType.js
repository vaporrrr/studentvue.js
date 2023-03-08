(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {},
    };
    factory(mod.exports);
    global.EventType = mod.exports;
  }
})(
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof self !== "undefined"
    ? self
    : this,
  function (_exports) {
    "use strict";

    Object.defineProperty(_exports, "__esModule", {
      value: true,
    });
    _exports.default = void 0;
    /**
     * The event type of a calendar day.
     * @enum
     */
    var EventType;
    (function (EventType) {
      EventType["ASSIGNMENT"] = "Assignment";
      EventType["REGULAR"] = "Regular";
      EventType["HOLIDAY"] = "Holiday";
    })(EventType || (EventType = {}));
    var _default = EventType;
    _exports.default = _default;
  }
);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJFdmVudFR5cGUiLCJfZGVmYXVsdCIsIl9leHBvcnRzIiwiZGVmYXVsdCJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Db25zdGFudHMvRXZlbnRUeXBlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIGV2ZW50IHR5cGUgb2YgYSBjYWxlbmRhciBkYXkuXG4gKiBAZW51bVxuICovXG5lbnVtIEV2ZW50VHlwZSB7XG4gIEFTU0lHTk1FTlQgPSAnQXNzaWdubWVudCcsXG4gIFJFR1VMQVIgPSAnUmVndWxhcicsXG4gIEhPTElEQVkgPSAnSG9saWRheScsXG59XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50VHlwZTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQUFBO0FBQ0E7QUFDQTtBQUNBO0VBSEEsSUFJS0EsU0FBUztFQUFBLFdBQVRBLFNBQVM7SUFBVEEsU0FBUztJQUFUQSxTQUFTO0lBQVRBLFNBQVM7RUFBQSxHQUFUQSxTQUFTLEtBQVRBLFNBQVM7RUFBQSxJQUFBQyxRQUFBLEdBTUNELFNBQVM7RUFBQUUsUUFBQSxDQUFBQyxPQUFBLEdBQUFGLFFBQUE7QUFBQSJ9
