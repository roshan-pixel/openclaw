"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WizardSession = void 0;
var node_crypto_1 = require("node:crypto");
var prompts_js_1 = require("./prompts.js");
function createDeferred() {
  var resolve;
  var reject;
  var promise = new Promise(function (res, rej) {
    resolve = res;
    reject = rej;
  });
  return { promise: promise, resolve: resolve, reject: reject };
}
var WizardSessionPrompter = /** @class */ (function () {
  function WizardSessionPrompter(session) {
    this.session = session;
  }
  WizardSessionPrompter.prototype.intro = function (title) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.prompt({
                type: "note",
                title: title,
                message: "",
                executor: "client",
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  WizardSessionPrompter.prototype.outro = function (message) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.prompt({
                type: "note",
                title: "Done",
                message: message,
                executor: "client",
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  WizardSessionPrompter.prototype.note = function (message, title) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.prompt({ type: "note", title: title, message: message, executor: "client" }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  WizardSessionPrompter.prototype.select = function (params) {
    return __awaiter(this, void 0, void 0, function () {
      var res;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.prompt({
                type: "select",
                message: params.message,
                options: params.options.map(function (opt) {
                  return {
                    value: opt.value,
                    label: opt.label,
                    hint: opt.hint,
                  };
                }),
                initialValue: params.initialValue,
                executor: "client",
              }),
            ];
          case 1:
            res = _a.sent();
            return [2 /*return*/, res];
        }
      });
    });
  };
  WizardSessionPrompter.prototype.multiselect = function (params) {
    return __awaiter(this, void 0, void 0, function () {
      var res;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.prompt({
                type: "multiselect",
                message: params.message,
                options: params.options.map(function (opt) {
                  return {
                    value: opt.value,
                    label: opt.label,
                    hint: opt.hint,
                  };
                }),
                initialValue: params.initialValues,
                executor: "client",
              }),
            ];
          case 1:
            res = _a.sent();
            return [2 /*return*/, Array.isArray(res) ? res : []];
        }
      });
    });
  };
  WizardSessionPrompter.prototype.text = function (params) {
    return __awaiter(this, void 0, void 0, function () {
      var res, value, error;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [
              4 /*yield*/,
              this.prompt({
                type: "text",
                message: params.message,
                initialValue: params.initialValue,
                placeholder: params.placeholder,
                executor: "client",
              }),
            ];
          case 1:
            res = _b.sent();
            value =
              res === null || res === undefined
                ? ""
                : typeof res === "string"
                  ? res
                  : typeof res === "number" || typeof res === "boolean" || typeof res === "bigint"
                    ? String(res)
                    : "";
            error =
              (_a = params.validate) === null || _a === void 0 ? void 0 : _a.call(params, value);
            if (error) {
              throw new Error(error);
            }
            return [2 /*return*/, value];
        }
      });
    });
  };
  WizardSessionPrompter.prototype.confirm = function (params) {
    return __awaiter(this, void 0, void 0, function () {
      var res;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.prompt({
                type: "confirm",
                message: params.message,
                initialValue: params.initialValue,
                executor: "client",
              }),
            ];
          case 1:
            res = _a.sent();
            return [2 /*return*/, Boolean(res)];
        }
      });
    });
  };
  WizardSessionPrompter.prototype.progress = function (_label) {
    return {
      update: function (_message) {},
      stop: function (_message) {},
    };
  };
  WizardSessionPrompter.prototype.prompt = function (step) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              this.session.awaitAnswer(
                __assign(__assign({}, step), { id: (0, node_crypto_1.randomUUID)() }),
              ),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  return WizardSessionPrompter;
})();
var WizardSession = /** @class */ (function () {
  function WizardSession(runner) {
    this.runner = runner;
    this.currentStep = null;
    this.stepDeferred = null;
    this.answerDeferred = new Map();
    this.status = "running";
    var prompter = new WizardSessionPrompter(this);
    void this.run(prompter);
  }
  WizardSession.prototype.next = function () {
    return __awaiter(this, void 0, void 0, function () {
      var step;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (this.currentStep) {
              return [2 /*return*/, { done: false, step: this.currentStep, status: this.status }];
            }
            if (this.status !== "running") {
              return [2 /*return*/, { done: true, status: this.status, error: this.error }];
            }
            if (!this.stepDeferred) {
              this.stepDeferred = createDeferred();
            }
            return [4 /*yield*/, this.stepDeferred.promise];
          case 1:
            step = _a.sent();
            if (step) {
              return [2 /*return*/, { done: false, step: step, status: this.status }];
            }
            return [2 /*return*/, { done: true, status: this.status, error: this.error }];
        }
      });
    });
  };
  WizardSession.prototype.answer = function (stepId, value) {
    return __awaiter(this, void 0, void 0, function () {
      var deferred;
      return __generator(this, function (_a) {
        deferred = this.answerDeferred.get(stepId);
        if (!deferred) {
          throw new Error("wizard: no pending step");
        }
        this.answerDeferred.delete(stepId);
        this.currentStep = null;
        deferred.resolve(value);
        return [2 /*return*/];
      });
    });
  };
  WizardSession.prototype.cancel = function () {
    if (this.status !== "running") {
      return;
    }
    this.status = "cancelled";
    this.error = "cancelled";
    this.currentStep = null;
    for (var _i = 0, _a = this.answerDeferred; _i < _a.length; _i++) {
      var _b = _a[_i],
        deferred = _b[1];
      deferred.reject(new prompts_js_1.WizardCancelledError());
    }
    this.answerDeferred.clear();
    this.resolveStep(null);
  };
  WizardSession.prototype.pushStep = function (step) {
    this.currentStep = step;
    this.resolveStep(step);
  };
  WizardSession.prototype.run = function (prompter) {
    return __awaiter(this, void 0, void 0, function () {
      var err_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, 3, 4]);
            return [4 /*yield*/, this.runner(prompter)];
          case 1:
            _a.sent();
            this.status = "done";
            return [3 /*break*/, 4];
          case 2:
            err_1 = _a.sent();
            if (err_1 instanceof prompts_js_1.WizardCancelledError) {
              this.status = "cancelled";
              this.error = err_1.message;
            } else {
              this.status = "error";
              this.error = String(err_1);
            }
            return [3 /*break*/, 4];
          case 3:
            this.resolveStep(null);
            return [7 /*endfinally*/];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  WizardSession.prototype.awaitAnswer = function (step) {
    return __awaiter(this, void 0, void 0, function () {
      var deferred;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (this.status !== "running") {
              throw new Error("wizard: session not running");
            }
            this.pushStep(step);
            deferred = createDeferred();
            this.answerDeferred.set(step.id, deferred);
            return [4 /*yield*/, deferred.promise];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  WizardSession.prototype.resolveStep = function (step) {
    if (!this.stepDeferred) {
      return;
    }
    var deferred = this.stepDeferred;
    this.stepDeferred = null;
    deferred.resolve(step);
  };
  WizardSession.prototype.getStatus = function () {
    return this.status;
  };
  WizardSession.prototype.getError = function () {
    return this.error;
  };
  return WizardSession;
})();
exports.WizardSession = WizardSession;
