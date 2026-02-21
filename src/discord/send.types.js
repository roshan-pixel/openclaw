"use strict";
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) {
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
          }
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== "function" && b !== null) {
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      }
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DISCORD_MAX_STICKER_BYTES =
  exports.DISCORD_MAX_EMOJI_BYTES =
  exports.DiscordSendError =
    void 0;
var DiscordSendError = /** @class */ (function (_super) {
  __extends(DiscordSendError, _super);
  function DiscordSendError(message, opts) {
    var _this = _super.call(this, message) || this;
    _this.name = "DiscordSendError";
    if (opts) {
      Object.assign(_this, opts);
    }
    return _this;
  }
  DiscordSendError.prototype.toString = function () {
    return this.message;
  };
  return DiscordSendError;
})(Error);
exports.DiscordSendError = DiscordSendError;
exports.DISCORD_MAX_EMOJI_BYTES = 256 * 1024;
exports.DISCORD_MAX_STICKER_BYTES = 512 * 1024;
