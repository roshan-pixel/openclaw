"use strict";
/**
 * Hook system for OpenClaw agent events
 *
 * Provides an extensible event-driven hook system for agent events
 * like command processing, session lifecycle, etc.
 */
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) {
            throw t[1];
          }
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) {
        throw new TypeError("Generator is already executing.");
      }
      while ((g && ((g = 0), op[0] && (_ = 0)), _)) {
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      }
      if (op[0] & 5) {
        throw op[1];
      }
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerInternalHook = registerInternalHook;
exports.unregisterInternalHook = unregisterInternalHook;
exports.clearInternalHooks = clearInternalHooks;
exports.getRegisteredEventKeys = getRegisteredEventKeys;
exports.triggerInternalHook = triggerInternalHook;
exports.createInternalHookEvent = createInternalHookEvent;
exports.isAgentBootstrapEvent = isAgentBootstrapEvent;
/** Registry of hook handlers by event key */
var handlers = new Map();
/**
 * Register a hook handler for a specific event type or event:action combination
 *
 * @param eventKey - Event type (e.g., 'command') or specific action (e.g., 'command:new')
 * @param handler - Function to call when the event is triggered
 *
 * @example
 * ```ts
 * // Listen to all command events
 * registerInternalHook('command', async (event) => {
 *   console.log('Command:', event.action);
 * });
 *
 * // Listen only to /new commands
 * registerInternalHook('command:new', async (event) => {
 *   await saveSessionToMemory(event);
 * });
 * ```
 */
function registerInternalHook(eventKey, handler) {
  if (!handlers.has(eventKey)) {
    handlers.set(eventKey, []);
  }
  handlers.get(eventKey).push(handler);
}
/**
 * Unregister a specific hook handler
 *
 * @param eventKey - Event key the handler was registered for
 * @param handler - The handler function to remove
 */
function unregisterInternalHook(eventKey, handler) {
  var eventHandlers = handlers.get(eventKey);
  if (!eventHandlers) {
    return;
  }
  var index = eventHandlers.indexOf(handler);
  if (index !== -1) {
    eventHandlers.splice(index, 1);
  }
  // Clean up empty handler arrays
  if (eventHandlers.length === 0) {
    handlers.delete(eventKey);
  }
}
/**
 * Clear all registered hooks (useful for testing)
 */
function clearInternalHooks() {
  handlers.clear();
}
/**
 * Get all registered event keys (useful for debugging)
 */
function getRegisteredEventKeys() {
  return Array.from(handlers.keys());
}
/**
 * Trigger a hook event
 *
 * Calls all handlers registered for:
 * 1. The general event type (e.g., 'command')
 * 2. The specific event:action combination (e.g., 'command:new')
 *
 * Handlers are called in registration order. Errors are caught and logged
 * but don't prevent other handlers from running.
 *
 * @param event - The event to trigger
 */
function triggerInternalHook(event) {
  return __awaiter(this, void 0, void 0, function () {
    var typeHandlers, specificHandlers, allHandlers, _i, allHandlers_1, handler, err_1;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          typeHandlers = (_a = handlers.get(event.type)) !== null && _a !== void 0 ? _a : [];
          specificHandlers =
            (_b = handlers.get("".concat(event.type, ":").concat(event.action))) !== null &&
            _b !== void 0
              ? _b
              : [];
          allHandlers = __spreadArray(
            __spreadArray([], typeHandlers, true),
            specificHandlers,
            true,
          );
          if (allHandlers.length === 0) {
            return [2 /*return*/];
          }
          ((_i = 0), (allHandlers_1 = allHandlers));
          _c.label = 1;
        case 1:
          if (!(_i < allHandlers_1.length)) {
            return [3 /*break*/, 6];
          }
          handler = allHandlers_1[_i];
          _c.label = 2;
        case 2:
          _c.trys.push([2, 4, , 5]);
          return [4 /*yield*/, handler(event)];
        case 3:
          _c.sent();
          return [3 /*break*/, 5];
        case 4:
          err_1 = _c.sent();
          console.error(
            "Hook error [".concat(event.type, ":").concat(event.action, "]:"),
            err_1 instanceof Error ? err_1.message : String(err_1),
          );
          return [3 /*break*/, 5];
        case 5:
          _i++;
          return [3 /*break*/, 1];
        case 6:
          return [2 /*return*/];
      }
    });
  });
}
/**
 * Create a hook event with common fields filled in
 *
 * @param type - The event type
 * @param action - The action within that type
 * @param sessionKey - The session key
 * @param context - Additional context
 */
function createInternalHookEvent(type, action, sessionKey, context) {
  if (context === void 0) {
    context = {};
  }
  return {
    type: type,
    action: action,
    sessionKey: sessionKey,
    context: context,
    timestamp: new Date(),
    messages: [],
  };
}
function isAgentBootstrapEvent(event) {
  if (event.type !== "agent" || event.action !== "bootstrap") {
    return false;
  }
  var context = event.context;
  if (!context || typeof context !== "object") {
    return false;
  }
  if (typeof context.workspaceDir !== "string") {
    return false;
  }
  return Array.isArray(context.bootstrapFiles);
}
