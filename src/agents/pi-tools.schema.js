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
exports.normalizeToolParameters = normalizeToolParameters;
exports.cleanToolSchemaForGemini = cleanToolSchemaForGemini;
var clean_for_gemini_js_1 = require("./schema/clean-for-gemini.js");
function extractEnumValues(schema) {
  if (!schema || typeof schema !== "object") {
    return undefined;
  }
  var record = schema;
  if (Array.isArray(record.enum)) {
    return record.enum;
  }
  if ("const" in record) {
    return [record.const];
  }
  var variants = Array.isArray(record.anyOf)
    ? record.anyOf
    : Array.isArray(record.oneOf)
      ? record.oneOf
      : null;
  if (variants) {
    var values = variants.flatMap(function (variant) {
      var extracted = extractEnumValues(variant);
      return extracted !== null && extracted !== void 0 ? extracted : [];
    });
    return values.length > 0 ? values : undefined;
  }
  return undefined;
}
function mergePropertySchemas(existing, incoming) {
  if (!existing) {
    return incoming;
  }
  if (!incoming) {
    return existing;
  }
  var existingEnum = extractEnumValues(existing);
  var incomingEnum = extractEnumValues(incoming);
  if (existingEnum || incomingEnum) {
    var values = Array.from(
      new Set(
        __spreadArray(
          __spreadArray(
            [],
            existingEnum !== null && existingEnum !== void 0 ? existingEnum : [],
            true,
          ),
          incomingEnum !== null && incomingEnum !== void 0 ? incomingEnum : [],
          true,
        ),
      ),
    );
    var merged = {};
    for (var _i = 0, _a = [existing, incoming]; _i < _a.length; _i++) {
      var source = _a[_i];
      if (!source || typeof source !== "object") {
        continue;
      }
      var record = source;
      for (var _b = 0, _c = ["title", "description", "default"]; _b < _c.length; _b++) {
        var key = _c[_b];
        if (!(key in merged) && key in record) {
          merged[key] = record[key];
        }
      }
    }
    var types = new Set(
      values.map(function (value) {
        return typeof value;
      }),
    );
    if (types.size === 1) {
      merged.type = Array.from(types)[0];
    }
    merged.enum = values;
    return merged;
  }
  return existing;
}
function normalizeToolParameters(tool) {
  var _a, _b;
  var schema = tool.parameters && typeof tool.parameters === "object" ? tool.parameters : undefined;
  if (!schema) {
    return tool;
  }
  // Provider quirks:
  // - Gemini rejects several JSON Schema keywords, so we scrub those.
  // - OpenAI rejects function tool schemas unless the *top-level* is `type: "object"`.
  //   (TypeBox root unions compile to `{ anyOf: [...] }` without `type`).
  //
  // Normalize once here so callers can always pass `tools` through unchanged.
  // If schema already has type + properties (no top-level anyOf to merge),
  // still clean it for Gemini compatibility
  if ("type" in schema && "properties" in schema && !Array.isArray(schema.anyOf)) {
    return __assign(__assign({}, tool), {
      parameters: (0, clean_for_gemini_js_1.cleanSchemaForGemini)(schema),
    });
  }
  // Some tool schemas (esp. unions) may omit `type` at the top-level. If we see
  // object-ish fields, force `type: "object"` so OpenAI accepts the schema.
  if (
    !("type" in schema) &&
    (typeof schema.properties === "object" || Array.isArray(schema.required)) &&
    !Array.isArray(schema.anyOf) &&
    !Array.isArray(schema.oneOf)
  ) {
    return __assign(__assign({}, tool), {
      parameters: (0, clean_for_gemini_js_1.cleanSchemaForGemini)(
        __assign(__assign({}, schema), { type: "object" }),
      ),
    });
  }
  var variantKey = Array.isArray(schema.anyOf)
    ? "anyOf"
    : Array.isArray(schema.oneOf)
      ? "oneOf"
      : null;
  if (!variantKey) {
    return tool;
  }
  var variants = schema[variantKey];
  var mergedProperties = {};
  var requiredCounts = new Map();
  var objectVariants = 0;
  for (var _i = 0, variants_1 = variants; _i < variants_1.length; _i++) {
    var entry = variants_1[_i];
    if (!entry || typeof entry !== "object") {
      continue;
    }
    var props = entry.properties;
    if (!props || typeof props !== "object") {
      continue;
    }
    objectVariants += 1;
    for (var _c = 0, _d = Object.entries(props); _c < _d.length; _c++) {
      var _e = _d[_c],
        key = _e[0],
        value = _e[1];
      if (!(key in mergedProperties)) {
        mergedProperties[key] = value;
        continue;
      }
      mergedProperties[key] = mergePropertySchemas(mergedProperties[key], value);
    }
    var required = Array.isArray(entry.required) ? entry.required : [];
    for (var _f = 0, required_1 = required; _f < required_1.length; _f++) {
      var key = required_1[_f];
      if (typeof key !== "string") {
        continue;
      }
      requiredCounts.set(
        key,
        ((_a = requiredCounts.get(key)) !== null && _a !== void 0 ? _a : 0) + 1,
      );
    }
  }
  var baseRequired = Array.isArray(schema.required)
    ? schema.required.filter(function (key) {
        return typeof key === "string";
      })
    : undefined;
  var mergedRequired =
    baseRequired && baseRequired.length > 0
      ? baseRequired
      : objectVariants > 0
        ? Array.from(requiredCounts.entries())
            .filter(function (_a) {
              var count = _a[1];
              return count === objectVariants;
            })
            .map(function (_a) {
              var key = _a[0];
              return key;
            })
        : undefined;
  var nextSchema = __assign({}, schema);
  return __assign(__assign({}, tool), {
    // Flatten union schemas into a single object schema:
    // - Gemini doesn't allow top-level `type` together with `anyOf`.
    // - OpenAI rejects schemas without top-level `type: "object"`.
    // Merging properties preserves useful enums like `action` while keeping schemas portable.
    parameters: (0, clean_for_gemini_js_1.cleanSchemaForGemini)(
      __assign(
        __assign(
          __assign(
            __assign(
              __assign(
                { type: "object" },
                typeof nextSchema.title === "string" ? { title: nextSchema.title } : {},
              ),
              typeof nextSchema.description === "string"
                ? { description: nextSchema.description }
                : {},
            ),
            {
              properties:
                Object.keys(mergedProperties).length > 0
                  ? mergedProperties
                  : (_b = schema.properties) !== null && _b !== void 0
                    ? _b
                    : {},
            },
          ),
          mergedRequired && mergedRequired.length > 0 ? { required: mergedRequired } : {},
        ),
        {
          additionalProperties:
            "additionalProperties" in schema ? schema.additionalProperties : true,
        },
      ),
    ),
  });
}
function cleanToolSchemaForGemini(schema) {
  return (0, clean_for_gemini_js_1.cleanSchemaForGemini)(schema);
}
