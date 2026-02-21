"use strict";
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
exports.htmlToMarkdown = htmlToMarkdown;
exports.markdownToText = markdownToText;
exports.truncateText = truncateText;
exports.extractReadableContent = extractReadableContent;
function decodeEntities(value) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#x([0-9a-f]+);/gi, function (_, hex) {
      return String.fromCharCode(Number.parseInt(hex, 16));
    })
    .replace(/&#(\d+);/gi, function (_, dec) {
      return String.fromCharCode(Number.parseInt(dec, 10));
    });
}
function stripTags(value) {
  return decodeEntities(value.replace(/<[^>]+>/g, ""));
}
function normalizeWhitespace(value) {
  return value
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}
function htmlToMarkdown(html) {
  var titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  var title = titleMatch ? normalizeWhitespace(stripTags(titleMatch[1])) : undefined;
  var text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "");
  text = text.replace(
    /<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    function (_, href, body) {
      var label = normalizeWhitespace(stripTags(body));
      if (!label) {
        return href;
      }
      return "[".concat(label, "](").concat(href, ")");
    },
  );
  text = text.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, function (_, level, body) {
    var prefix = "#".repeat(Math.max(1, Math.min(6, Number.parseInt(level, 10))));
    var label = normalizeWhitespace(stripTags(body));
    return "\n".concat(prefix, " ").concat(label, "\n");
  });
  text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, function (_, body) {
    var label = normalizeWhitespace(stripTags(body));
    return label ? "\n- ".concat(label) : "";
  });
  text = text
    .replace(/<(br|hr)\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|section|article|header|footer|table|tr|ul|ol)>/gi, "\n");
  text = stripTags(text);
  text = normalizeWhitespace(text);
  return { text: text, title: title };
}
function markdownToText(markdown) {
  var text = markdown;
  text = text.replace(/!\[[^\]]*]\([^)]+\)/g, "");
  text = text.replace(/\[([^\]]+)]\([^)]+\)/g, "$1");
  text = text.replace(/```[\s\S]*?```/g, function (block) {
    return block.replace(/```[^\n]*\n?/g, "").replace(/```/g, "");
  });
  text = text.replace(/`([^`]+)`/g, "$1");
  text = text.replace(/^#{1,6}\s+/gm, "");
  text = text.replace(/^\s*[-*+]\s+/gm, "");
  text = text.replace(/^\s*\d+\.\s+/gm, "");
  return normalizeWhitespace(text);
}
function truncateText(value, maxChars) {
  if (value.length <= maxChars) {
    return { text: value, truncated: false };
  }
  return { text: value.slice(0, maxChars), truncated: true };
}
function extractReadableContent(params) {
  return __awaiter(this, void 0, void 0, function () {
    var fallback, _a, Readability, parseHTML, document_1, reader, parsed, title, text, rendered, _b;
    var _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          fallback = function () {
            var rendered = htmlToMarkdown(params.html);
            if (params.extractMode === "text") {
              var text =
                markdownToText(rendered.text) || normalizeWhitespace(stripTags(params.html));
              return { text: text, title: rendered.title };
            }
            return rendered;
          };
          _d.label = 1;
        case 1:
          _d.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            Promise.all([
              Promise.resolve().then(function () {
                return require("@mozilla/readability");
              }),
              Promise.resolve().then(function () {
                return require("linkedom");
              }),
            ]),
          ];
        case 2:
          ((_a = _d.sent()), (Readability = _a[0].Readability), (parseHTML = _a[1].parseHTML));
          document_1 = parseHTML(params.html).document;
          try {
            document_1.baseURI = params.url;
          } catch (_e) {
            // Best-effort base URI for relative links.
          }
          reader = new Readability(document_1, { charThreshold: 0 });
          parsed = reader.parse();
          if (!(parsed === null || parsed === void 0 ? void 0 : parsed.content)) {
            return [2 /*return*/, fallback()];
          }
          title = parsed.title || undefined;
          if (params.extractMode === "text") {
            text = normalizeWhitespace(
              (_c = parsed.textContent) !== null && _c !== void 0 ? _c : "",
            );
            return [2 /*return*/, text ? { text: text, title: title } : fallback()];
          }
          rendered = htmlToMarkdown(parsed.content);
          return [
            2 /*return*/,
            {
              text: rendered.text,
              title: title !== null && title !== void 0 ? title : rendered.title,
            },
          ];
        case 3:
          _b = _d.sent();
          return [2 /*return*/, fallback()];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
