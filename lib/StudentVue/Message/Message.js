(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../utils/soap/soap", "../Attachment/Attachment", "../Icon/Icon", "../Client/Client.helpers"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../utils/soap/soap"), require("../Attachment/Attachment"), require("../Icon/Icon"), require("../Client/Client.helpers"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.soap, global.Attachment, global.Icon, global.Client);
    global.Message = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _soap, _Attachment, _Icon, _Client) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _soap = _interopRequireDefault(_soap);
  _Attachment = _interopRequireDefault(_Attachment);
  _Icon = _interopRequireDefault(_Icon);
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  /**
   * Message class
   * This is only returned as an array in `Client.messages()` method
   * @constructor
   * @extends {soap.Client}
   */
  class Message extends _soap.default.Client {
    constructor(xmlObject, credentials, hostUrl) {
      super(credentials);
      /**
       * The URL to create POST fetch requests to synergy servers
       * @type {string}
       * @private
       * @readonly
       */
      this.hostUrl = hostUrl;
      /**
       * The message icon
       * @type {Icon}
       * @public
       * @readonly
       */
      this.icon = new _Icon.default(xmlObject['@_IconURL'][0], this.hostUrl);
      /**
       * The ID of the message
       * @type {string}
       * @public
       * @readonly
       */
      this.id = xmlObject['@_ID'][0];
      /**
       * The type of the message
       * @type {string}
       * @public
       * @readonly
       */
      this.type = xmlObject['@_Type'][0];
      /**
       * The date when the message was first posted
       * @type {Date}
       * @public
       * @readonly
       */
      this.beginDate = (0, _Client.parseDateString)(xmlObject['@_BeginDate'][0]);
      /**
       * The HTML content of the message
       * @type {string}
       * @public
       * @readonly
       */
      this.htmlContent = unescape(xmlObject['@_Content'][0]);
      /**
       * Whether the message has been read or not
       * @type {boolean}
       * @private
       */
      this.read = JSON.parse(xmlObject['@_Read'][0]);
      /**
       * Whether the message is deletable or not
       * @type {boolean}
       * @private
       */
      this.deletable = JSON.parse(xmlObject['@_Deletable'][0]);
      /**
       * The sender of the message
       * @public
       * @readonly
       * @type {object}
       * @property {string} name - The name of the sender
       * @property {string} staffGu - the staffGu of the sender
       * @property {string} email - The email of the sender
       * @property {string} smMsgPersonGu - The smMsgPersonGu of the sender. Don't know if this property has a real usage or not
       */
      this.from = {
        name: xmlObject['@_From'][0],
        staffGu: xmlObject['@_StaffGU'][0],
        smMsgPersonGu: xmlObject['@_SMMsgPersonGU'][0],
        email: xmlObject['@_Email'][0]
      };
      /**
       * The module of the sender
       * @type {string}
       * @public
       * @readonly
       */
      this.module = xmlObject['@_Module'][0];
      /**
       * The subject of the message
       * @public
       * @readonly
       * @type {object}
       * @property {string} html - The subject of the message with HTML
       * @property {string} raw - The subject of the message without HTML and formatting
       */
      this.subject = {
        html: xmlObject['@_Subject'][0],
        raw: xmlObject['@_SubjectNoHTML'][0]
      };
      /**
       * The attachments included in the message, if there are any.
       * @type {Attachment[]}
       * @public
       * @readonly
       */
      this.attachments = typeof xmlObject.AttachmentDatas[0] !== 'string' ? xmlObject.AttachmentDatas[0].AttachmentData.map(data => {
        return new _Attachment.default(data['@_AttachmentName'][0], data['@_SmAttachmentGU'][0], credentials);
      }) : [];
    }

    /**
     * Check if a message has been read
     * @returns {boolean} Returns a boolean declaring whether or not the message has been previously read
     */
    isRead() {
      return this.read;
    }

    /**
     * Check if a message is deletable
     * @returns {boolean} Returns a boolean declaring whether or not the message is deletable
     */
    isDeletable() {
      return this.deletable;
    }
    setRead(read) {
      this.read = read;
    }
    setDeletable(deletable) {
      this.deletable = deletable;
    }

    /**
     * Marks the message as read
     * @returns {true} Returns true to show that it has been marked as read
     * @description
     * ```js
     * const messages = await client.messages();
     * messages.every((msg) => msg.isRead()) // -> false
     * messages.forEach(async (msg) => !msg.isRead() && await msg.markAsRead());
     * messages.every((msg) => msg.isRead()) // -> true
     * const refetchedMessages = await client.messages(); // See if it updated on the server
     * messages.every((msg) => msg.isRead()) // -> true
     * ```
     * @description
     * ```tsx
     * // In a React project...
     * import React from 'react';
     *
     * const Message = (props) => {
     *  const { message } = props;
     *
     *  async function handleOnClick() {
     *    await message.markAsRead();
     *  }
     *
     *  return (
     *    <button onClick={handleOnClick} style={{ color: message.isRead() ? undefined : 'red' }}>
     *      <p>{message.subject.raw}</p>
     *    </button>
     *  )
     * }
     *
     * export default Message;
     * ```
     */
    markAsRead() {
      return new Promise((res, rej) => {
        if (this.read) {
          return res(true);
        }
        super.processRequest({
          methodName: 'UpdatePXPMessage',
          paramStr: {
            childIntId: 0,
            MessageListing: {
              '@_xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
              '@_xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
              '@_ID': this.id,
              '@_Type': this.type,
              '@_MarkAsRead': 'true'
            }
          }
        }).then(() => {
          this.setRead(true);
          res(true);
        }).catch(rej);
      });
    }
  }
  _exports.default = Message;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJNZXNzYWdlIiwic29hcCIsIkNsaWVudCIsImNvbnN0cnVjdG9yIiwieG1sT2JqZWN0IiwiY3JlZGVudGlhbHMiLCJob3N0VXJsIiwiaWNvbiIsIkljb24iLCJpZCIsInR5cGUiLCJiZWdpbkRhdGUiLCJwYXJzZURhdGVTdHJpbmciLCJodG1sQ29udGVudCIsInVuZXNjYXBlIiwicmVhZCIsIkpTT04iLCJwYXJzZSIsImRlbGV0YWJsZSIsImZyb20iLCJuYW1lIiwic3RhZmZHdSIsInNtTXNnUGVyc29uR3UiLCJlbWFpbCIsIm1vZHVsZSIsInN1YmplY3QiLCJodG1sIiwicmF3IiwiYXR0YWNobWVudHMiLCJBdHRhY2htZW50RGF0YXMiLCJBdHRhY2htZW50RGF0YSIsIm1hcCIsImRhdGEiLCJBdHRhY2htZW50IiwiaXNSZWFkIiwiaXNEZWxldGFibGUiLCJzZXRSZWFkIiwic2V0RGVsZXRhYmxlIiwibWFya0FzUmVhZCIsIlByb21pc2UiLCJyZXMiLCJyZWoiLCJwcm9jZXNzUmVxdWVzdCIsIm1ldGhvZE5hbWUiLCJwYXJhbVN0ciIsImNoaWxkSW50SWQiLCJNZXNzYWdlTGlzdGluZyIsInRoZW4iLCJjYXRjaCJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9TdHVkZW50VnVlL01lc3NhZ2UvTWVzc2FnZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBMb2dpbkNyZWRlbnRpYWxzIH0gZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9DbGllbnQvQ2xpZW50LmludGVyZmFjZXMnO1xuaW1wb3J0IHNvYXAgZnJvbSAnLi4vLi4vdXRpbHMvc29hcC9zb2FwJztcbmltcG9ydCBBdHRhY2htZW50IGZyb20gJy4uL0F0dGFjaG1lbnQvQXR0YWNobWVudCc7XG5pbXBvcnQgeyBNZXNzYWdlWE1MT2JqZWN0IH0gZnJvbSAnLi9NZXNzYWdlLnhtbCc7XG5pbXBvcnQgSWNvbiBmcm9tICcuLi9JY29uL0ljb24nO1xuaW1wb3J0IHsgcGFyc2VEYXRlU3RyaW5nIH0gZnJvbSAnLi4vQ2xpZW50L0NsaWVudC5oZWxwZXJzJztcblxuLyoqXG4gKiBNZXNzYWdlIGNsYXNzXG4gKiBUaGlzIGlzIG9ubHkgcmV0dXJuZWQgYXMgYW4gYXJyYXkgaW4gYENsaWVudC5tZXNzYWdlcygpYCBtZXRob2RcbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMge3NvYXAuQ2xpZW50fVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZXNzYWdlIGV4dGVuZHMgc29hcC5DbGllbnQge1xuICBwcml2YXRlIHJlYWRvbmx5IGhvc3RVcmw6IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgaWNvbjogSWNvbjtcblxuICBwdWJsaWMgcmVhZG9ubHkgaWQ6IHN0cmluZztcblxuICBwdWJsaWMgcmVhZG9ubHkgYmVnaW5EYXRlOiBEYXRlO1xuXG4gIHB1YmxpYyByZWFkb25seSB0eXBlOiBzdHJpbmc7XG5cbiAgcHVibGljIHJlYWRvbmx5IGh0bWxDb250ZW50OiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSByZWFkOiBib29sZWFuO1xuXG4gIHByaXZhdGUgZGVsZXRhYmxlOiBib29sZWFuO1xuXG4gIHB1YmxpYyByZWFkb25seSBmcm9tOiB7XG4gICAgbmFtZTogc3RyaW5nO1xuICAgIHN0YWZmR3U6IHN0cmluZztcbiAgICBlbWFpbDogc3RyaW5nO1xuICAgIHNtTXNnUGVyc29uR3U6IHN0cmluZztcbiAgfTtcblxuICBwdWJsaWMgcmVhZG9ubHkgbW9kdWxlOiBzdHJpbmc7XG5cbiAgcHVibGljIHJlYWRvbmx5IHN1YmplY3Q6IHtcbiAgICBodG1sOiBzdHJpbmc7XG4gICAgcmF3OiBzdHJpbmc7XG4gIH07XG5cbiAgcHVibGljIHJlYWRvbmx5IGF0dGFjaG1lbnRzOiBBdHRhY2htZW50W107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgeG1sT2JqZWN0OiBNZXNzYWdlWE1MT2JqZWN0WydQWFBNZXNzYWdlc0RhdGEnXVswXVsnTWVzc2FnZUxpc3RpbmdzJ11bMF1bJ01lc3NhZ2VMaXN0aW5nJ11bMF0sXG4gICAgY3JlZGVudGlhbHM6IExvZ2luQ3JlZGVudGlhbHMsXG4gICAgaG9zdFVybDogc3RyaW5nXG4gICkge1xuICAgIHN1cGVyKGNyZWRlbnRpYWxzKTtcbiAgICAvKipcbiAgICAgKiBUaGUgVVJMIHRvIGNyZWF0ZSBQT1NUIGZldGNoIHJlcXVlc3RzIHRvIHN5bmVyZ3kgc2VydmVyc1xuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLmhvc3RVcmwgPSBob3N0VXJsO1xuICAgIC8qKlxuICAgICAqIFRoZSBtZXNzYWdlIGljb25cbiAgICAgKiBAdHlwZSB7SWNvbn1cbiAgICAgKiBAcHVibGljXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdGhpcy5pY29uID0gbmV3IEljb24oeG1sT2JqZWN0WydAX0ljb25VUkwnXVswXSwgdGhpcy5ob3N0VXJsKTtcbiAgICAvKipcbiAgICAgKiBUaGUgSUQgb2YgdGhlIG1lc3NhZ2VcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLmlkID0geG1sT2JqZWN0WydAX0lEJ11bMF07XG4gICAgLyoqXG4gICAgICogVGhlIHR5cGUgb2YgdGhlIG1lc3NhZ2VcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLnR5cGUgPSB4bWxPYmplY3RbJ0BfVHlwZSddWzBdO1xuICAgIC8qKlxuICAgICAqIFRoZSBkYXRlIHdoZW4gdGhlIG1lc3NhZ2Ugd2FzIGZpcnN0IHBvc3RlZFxuICAgICAqIEB0eXBlIHtEYXRlfVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLmJlZ2luRGF0ZSA9IHBhcnNlRGF0ZVN0cmluZyh4bWxPYmplY3RbJ0BfQmVnaW5EYXRlJ11bMF0pO1xuICAgIC8qKlxuICAgICAqIFRoZSBIVE1MIGNvbnRlbnQgb2YgdGhlIG1lc3NhZ2VcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLmh0bWxDb250ZW50ID0gdW5lc2NhcGUoeG1sT2JqZWN0WydAX0NvbnRlbnQnXVswXSk7XG4gICAgLyoqXG4gICAgICogV2hldGhlciB0aGUgbWVzc2FnZSBoYXMgYmVlbiByZWFkIG9yIG5vdFxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5yZWFkID0gSlNPTi5wYXJzZSh4bWxPYmplY3RbJ0BfUmVhZCddWzBdKTtcbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRoZSBtZXNzYWdlIGlzIGRlbGV0YWJsZSBvciBub3RcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZGVsZXRhYmxlID0gSlNPTi5wYXJzZSh4bWxPYmplY3RbJ0BfRGVsZXRhYmxlJ11bMF0pO1xuICAgIC8qKlxuICAgICAqIFRoZSBzZW5kZXIgb2YgdGhlIG1lc3NhZ2VcbiAgICAgKiBAcHVibGljXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBzZW5kZXJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gc3RhZmZHdSAtIHRoZSBzdGFmZkd1IG9mIHRoZSBzZW5kZXJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gZW1haWwgLSBUaGUgZW1haWwgb2YgdGhlIHNlbmRlclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzbU1zZ1BlcnNvbkd1IC0gVGhlIHNtTXNnUGVyc29uR3Ugb2YgdGhlIHNlbmRlci4gRG9uJ3Qga25vdyBpZiB0aGlzIHByb3BlcnR5IGhhcyBhIHJlYWwgdXNhZ2Ugb3Igbm90XG4gICAgICovXG4gICAgdGhpcy5mcm9tID0ge1xuICAgICAgbmFtZTogeG1sT2JqZWN0WydAX0Zyb20nXVswXSxcbiAgICAgIHN0YWZmR3U6IHhtbE9iamVjdFsnQF9TdGFmZkdVJ11bMF0sXG4gICAgICBzbU1zZ1BlcnNvbkd1OiB4bWxPYmplY3RbJ0BfU01Nc2dQZXJzb25HVSddWzBdLFxuICAgICAgZW1haWw6IHhtbE9iamVjdFsnQF9FbWFpbCddWzBdLFxuICAgIH07XG4gICAgLyoqXG4gICAgICogVGhlIG1vZHVsZSBvZiB0aGUgc2VuZGVyXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAcHVibGljXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdGhpcy5tb2R1bGUgPSB4bWxPYmplY3RbJ0BfTW9kdWxlJ11bMF07XG4gICAgLyoqXG4gICAgICogVGhlIHN1YmplY3Qgb2YgdGhlIG1lc3NhZ2VcbiAgICAgKiBAcHVibGljXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gaHRtbCAtIFRoZSBzdWJqZWN0IG9mIHRoZSBtZXNzYWdlIHdpdGggSFRNTFxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSByYXcgLSBUaGUgc3ViamVjdCBvZiB0aGUgbWVzc2FnZSB3aXRob3V0IEhUTUwgYW5kIGZvcm1hdHRpbmdcbiAgICAgKi9cbiAgICB0aGlzLnN1YmplY3QgPSB7XG4gICAgICBodG1sOiB4bWxPYmplY3RbJ0BfU3ViamVjdCddWzBdLFxuICAgICAgcmF3OiB4bWxPYmplY3RbJ0BfU3ViamVjdE5vSFRNTCddWzBdLFxuICAgIH07XG4gICAgLyoqXG4gICAgICogVGhlIGF0dGFjaG1lbnRzIGluY2x1ZGVkIGluIHRoZSBtZXNzYWdlLCBpZiB0aGVyZSBhcmUgYW55LlxuICAgICAqIEB0eXBlIHtBdHRhY2htZW50W119XG4gICAgICogQHB1YmxpY1xuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMuYXR0YWNobWVudHMgPVxuICAgICAgdHlwZW9mIHhtbE9iamVjdC5BdHRhY2htZW50RGF0YXNbMF0gIT09ICdzdHJpbmcnXG4gICAgICAgID8geG1sT2JqZWN0LkF0dGFjaG1lbnREYXRhc1swXS5BdHRhY2htZW50RGF0YS5tYXAoXG4gICAgICAgICAgICAoZGF0YSkgPT5cbiAgICAgICAgICAgICAgbmV3IEF0dGFjaG1lbnQoXG4gICAgICAgICAgICAgICAgZGF0YVsnQF9BdHRhY2htZW50TmFtZSddWzBdLFxuICAgICAgICAgICAgICAgIGRhdGFbJ0BfU21BdHRhY2htZW50R1UnXVswXSxcbiAgICAgICAgICAgICAgICBjcmVkZW50aWFsc1xuICAgICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICA6IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGEgbWVzc2FnZSBoYXMgYmVlbiByZWFkXG4gICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGEgYm9vbGVhbiBkZWNsYXJpbmcgd2hldGhlciBvciBub3QgdGhlIG1lc3NhZ2UgaGFzIGJlZW4gcHJldmlvdXNseSByZWFkXG4gICAqL1xuICBwdWJsaWMgaXNSZWFkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLnJlYWQ7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYSBtZXNzYWdlIGlzIGRlbGV0YWJsZVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBhIGJvb2xlYW4gZGVjbGFyaW5nIHdoZXRoZXIgb3Igbm90IHRoZSBtZXNzYWdlIGlzIGRlbGV0YWJsZVxuICAgKi9cbiAgcHVibGljIGlzRGVsZXRhYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmRlbGV0YWJsZTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0UmVhZChyZWFkOiBib29sZWFuKSB7XG4gICAgdGhpcy5yZWFkID0gcmVhZDtcbiAgfVxuXG4gIHByaXZhdGUgc2V0RGVsZXRhYmxlKGRlbGV0YWJsZTogYm9vbGVhbikge1xuICAgIHRoaXMuZGVsZXRhYmxlID0gZGVsZXRhYmxlO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoZSBtZXNzYWdlIGFzIHJlYWRcbiAgICogQHJldHVybnMge3RydWV9IFJldHVybnMgdHJ1ZSB0byBzaG93IHRoYXQgaXQgaGFzIGJlZW4gbWFya2VkIGFzIHJlYWRcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIGBgYGpzXG4gICAqIGNvbnN0IG1lc3NhZ2VzID0gYXdhaXQgY2xpZW50Lm1lc3NhZ2VzKCk7XG4gICAqIG1lc3NhZ2VzLmV2ZXJ5KChtc2cpID0+IG1zZy5pc1JlYWQoKSkgLy8gLT4gZmFsc2VcbiAgICogbWVzc2FnZXMuZm9yRWFjaChhc3luYyAobXNnKSA9PiAhbXNnLmlzUmVhZCgpICYmIGF3YWl0IG1zZy5tYXJrQXNSZWFkKCkpO1xuICAgKiBtZXNzYWdlcy5ldmVyeSgobXNnKSA9PiBtc2cuaXNSZWFkKCkpIC8vIC0+IHRydWVcbiAgICogY29uc3QgcmVmZXRjaGVkTWVzc2FnZXMgPSBhd2FpdCBjbGllbnQubWVzc2FnZXMoKTsgLy8gU2VlIGlmIGl0IHVwZGF0ZWQgb24gdGhlIHNlcnZlclxuICAgKiBtZXNzYWdlcy5ldmVyeSgobXNnKSA9PiBtc2cuaXNSZWFkKCkpIC8vIC0+IHRydWVcbiAgICogYGBgXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBgYGB0c3hcbiAgICogLy8gSW4gYSBSZWFjdCBwcm9qZWN0Li4uXG4gICAqIGltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG4gICAqXG4gICAqIGNvbnN0IE1lc3NhZ2UgPSAocHJvcHMpID0+IHtcbiAgICogIGNvbnN0IHsgbWVzc2FnZSB9ID0gcHJvcHM7XG4gICAqXG4gICAqICBhc3luYyBmdW5jdGlvbiBoYW5kbGVPbkNsaWNrKCkge1xuICAgKiAgICBhd2FpdCBtZXNzYWdlLm1hcmtBc1JlYWQoKTtcbiAgICogIH1cbiAgICpcbiAgICogIHJldHVybiAoXG4gICAqICAgIDxidXR0b24gb25DbGljaz17aGFuZGxlT25DbGlja30gc3R5bGU9e3sgY29sb3I6IG1lc3NhZ2UuaXNSZWFkKCkgPyB1bmRlZmluZWQgOiAncmVkJyB9fT5cbiAgICogICAgICA8cD57bWVzc2FnZS5zdWJqZWN0LnJhd308L3A+XG4gICAqICAgIDwvYnV0dG9uPlxuICAgKiAgKVxuICAgKiB9XG4gICAqXG4gICAqIGV4cG9ydCBkZWZhdWx0IE1lc3NhZ2U7XG4gICAqIGBgYFxuICAgKi9cbiAgcHVibGljIG1hcmtBc1JlYWQoKTogUHJvbWlzZTx0cnVlPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHRydWU+KChyZXMsIHJlaikgPT4ge1xuICAgICAgaWYgKHRoaXMucmVhZCkgcmV0dXJuIHJlcyh0cnVlKTtcbiAgICAgIHN1cGVyXG4gICAgICAgIC5wcm9jZXNzUmVxdWVzdCh7XG4gICAgICAgICAgbWV0aG9kTmFtZTogJ1VwZGF0ZVBYUE1lc3NhZ2UnLFxuICAgICAgICAgIHBhcmFtU3RyOiB7XG4gICAgICAgICAgICBjaGlsZEludElkOiAwLFxuICAgICAgICAgICAgTWVzc2FnZUxpc3Rpbmc6IHtcbiAgICAgICAgICAgICAgJ0BfeG1sbnM6eHNpJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlJyxcbiAgICAgICAgICAgICAgJ0BfeG1sbnM6eHNkJzogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hJyxcbiAgICAgICAgICAgICAgJ0BfSUQnOiB0aGlzLmlkLFxuICAgICAgICAgICAgICAnQF9UeXBlJzogdGhpcy50eXBlLFxuICAgICAgICAgICAgICAnQF9NYXJrQXNSZWFkJzogJ3RydWUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRSZWFkKHRydWUpO1xuICAgICAgICAgIHJlcyh0cnVlKTtcbiAgICAgICAgfSlcbiAg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