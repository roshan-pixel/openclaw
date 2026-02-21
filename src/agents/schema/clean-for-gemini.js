"use strict";
// Cloud Code Assist API rejects a subset of JSON Schema keywords.
// This module scrubs/normalizes tool schemas to keep Gemini happy.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS = void 0;
exports.cleanSchemaForGemini = cleanSchemaForGemini;
// Keywords that Cloud Code Assist API rejects (not compliant with their JSON Schema subset)
exports.GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS = new Set([
  "patternProperties",
  "additionalProperties",
  "$schema",
  "$id",
  "$ref",
  "$defs",
  "definitions",
  // Non-standard (OpenAPI) keyword; Claude validators reject it.
  "examples",
  // Cloud Code Assist appears to validate tool schemas more strictly/quirkily than
  // draft 2020-12 in practice; these constraints frequently trigger 400s.
  "minLength",
  "maxLength",
  "minimum",
  "maximum",
  "multipleOf",
  "pattern",
  "format",
  "minItems",
  "maxItems",
  "uniqueItems",
  "minProperties",
  "maxProperties",
]);
// Check if an anyOf/oneOf array contains only literal values that can be flattened.
// TypeBox Type.Literal generates { const: "value", type: "string" }.
// Some schemas may use { enum: ["value"], type: "string" }.
// Both patterns are flattened to { type: "string", enum: ["a", "b", ...] }.
function tryFlattenLiteralAnyOf(variants) {
  if (variants.length === 0) {
    return null;
  }
  var allValues = [];
  var commonType = null;
  for (var _i = 0, variants_1 = variants; _i < variants_1.length; _i++) {
    var variant = variants_1[_i];
    if (!variant || typeof variant !== "object") {
      return null;
    }
    var v = variant;
    var literalValue = void 0;
    if ("const" in v) {
      literalValue = v.const;
    } else if (Array.isArray(v.enum) && v.enum.length === 1) {
      literalValue = v.enum[0];
    } else {
      return null;
    }
    var variantType = typeof v.type === "string" ? v.type : null;
    if (!variantType) {
      return null;
    }
    if (commonType === null) {
      commonType = variantType;
    } else if (commonType !== variantType) {
      return null;
    }
    allValues.push(literalValue);
  }
  if (commonType && allValues.length > 0) {
    return { type: commonType, enum: allValues };
  }
  return null;
}
function isNullSchema(variant) {
  if (!variant || typeof variant !== "object" || Array.isArray(variant)) {
    return false;
  }
  var record = variant;
  if ("const" in record && record.const === null) {
    return true;
  }
  if (Array.isArray(record.enum) && record.enum.length === 1) {
    return record.enum[0] === null;
  }
  var typeValue = record.type;
  if (typeValue === "null") {
    return true;
  }
  if (Array.isArray(typeValue) && typeValue.length === 1 && typeValue[0] === "null") {
    return true;
  }
  return false;
}
function stripNullVariants(variants) {
  if (variants.length === 0) {
    return { variants: variants, stripped: false };
  }
  var nonNull = variants.filter(function (variant) {
    return !isNullSchema(variant);
  });
  return {
    variants: nonNull,
    stripped: nonNull.length !== variants.length,
  };
}
function extendSchemaDefs(defs, schema) {
  var defsEntry =
    schema.$defs && typeof schema.$defs === "object" && !Array.isArray(schema.$defs)
      ? schema.$defs
      : undefined;
  var legacyDefsEntry =
    schema.definitions &&
    typeof schema.definitions === "object" &&
    !Array.isArray(schema.definitions)
      ? schema.definitions
      : undefined;
  if (!defsEntry && !legacyDefsEntry) {
    return defs;
  }
  var next = defs ? new Map(defs) : new Map();
  if (defsEntry) {
    for (var _i = 0, _a = Object.entries(defsEntry); _i < _a.length; _i++) {
      var _b = _a[_i],
        key = _b[0],
        value = _b[1];
      next.set(key, value);
    }
  }
  if (legacyDefsEntry) {
    for (var _c = 0, _d = Object.entries(legacyDefsEntry); _c < _d.length; _c++) {
      var _e = _d[_c],
        key = _e[0],
        value = _e[1];
      next.set(key, value);
    }
  }
  return next;
}
function decodeJsonPointerSegment(segment) {
  return segment.replaceAll("~1", "/").replaceAll("~0", "~");
}
function tryResolveLocalRef(ref, defs) {
  var _a;
  if (!defs) {
    return undefined;
  }
  var match = ref.match(/^#\/(?:\$defs|definitions)\/(.+)$/);
  if (!match) {
    return undefined;
  }
  var name = decodeJsonPointerSegment((_a = match[1]) !== null && _a !== void 0 ? _a : "");
  if (!name) {
    return undefined;
  }
  return defs.get(name);
}
function cleanSchemaForGeminiWithDefs(schema, defs, refStack) {
  if (!schema || typeof schema !== "object") {
    return schema;
  }
  if (Array.isArray(schema)) {
    return schema.map(function (item) {
      return cleanSchemaForGeminiWithDefs(item, defs, refStack);
    });
  }
  var obj = schema;
  var nextDefs = extendSchemaDefs(defs, obj);
  var refValue = typeof obj.$ref === "string" ? obj.$ref : undefined;
  if (refValue) {
    if (refStack === null || refStack === void 0 ? void 0 : refStack.has(refValue)) {
      return {};
    }
    var resolved = tryResolveLocalRef(refValue, nextDefs);
    if (resolved) {
      var nextRefStack = refStack ? new Set(refStack) : new Set();
      nextRefStack.add(refValue);
      var cleaned_1 = cleanSchemaForGeminiWithDefs(resolved, nextDefs, nextRefStack);
      if (!cleaned_1 || typeof cleaned_1 !== "object" || Array.isArray(cleaned_1)) {
        return cleaned_1;
      }
      var result_1 = __assign({}, cleaned_1);
      for (var _i = 0, _a = ["description", "title", "default"]; _i < _a.length; _i++) {
        var key = _a[_i];
        if (key in obj && obj[key] !== undefined) {
          result_1[key] = obj[key];
        }
      }
      return result_1;
    }
    var result = {};
    for (var _b = 0, _c = ["description", "title", "default"]; _b < _c.length; _b++) {
      var key = _c[_b];
      if (key in obj && obj[key] !== undefined) {
        result[key] = obj[key];
      }
    }
    return result;
  }
  var hasAnyOf = "anyOf" in obj && Array.isArray(obj.anyOf);
  var hasOneOf = "oneOf" in obj && Array.isArray(obj.oneOf);
  var cleanedAnyOf = hasAnyOf
    ? obj.anyOf.map(function (variant) {
        return cleanSchemaForGeminiWithDefs(variant, nextDefs, refStack);
      })
    : undefined;
  var cleanedOneOf = hasOneOf
    ? obj.oneOf.map(function (variant) {
        return cleanSchemaForGeminiWithDefs(variant, nextDefs, refStack);
      })
    : undefined;
  if (hasAnyOf) {
    var _d = stripNullVariants(
        cleanedAnyOf !== null && cleanedAnyOf !== void 0 ? cleanedAnyOf : [],
      ),
      nonNullVariants = _d.variants,
      stripped = _d.stripped;
    if (stripped) {
      cleanedAnyOf = nonNullVariants;
    }
    var flattened = tryFlattenLiteralAnyOf(nonNullVariants);
    if (flattened) {
      var result = {
        type: flattened.type,
        enum: flattened.enum,
      };
      for (var _e = 0, _f = ["description", "title", "default"]; _e < _f.length; _e++) {
        var key = _f[_e];
        if (key in obj && obj[key] !== undefined) {
          result[key] = obj[key];
        }
      }
      return result;
    }
    if (stripped && nonNullVariants.length === 1) {
      var lone = nonNullVariants[0];
      if (lone && typeof lone === "object" && !Array.isArray(lone)) {
        var result = __assign({}, lone);
        for (var _g = 0, _h = ["description", "title", "default"]; _g < _h.length; _g++) {
          var key = _h[_g];
          if (key in obj && obj[key] !== undefined) {
            result[key] = obj[key];
          }
        }
        return result;
      }
      return lone;
    }
  }
  if (hasOneOf) {
    var _j = stripNullVariants(
        cleanedOneOf !== null && cleanedOneOf !== void 0 ? cleanedOneOf : [],
      ),
      nonNullVariants = _j.variants,
      stripped = _j.stripped;
    if (stripped) {
      cleanedOneOf = nonNullVariants;
    }
    var flattened = tryFlattenLiteralAnyOf(nonNullVariants);
    if (flattened) {
      var result = {
        type: flattened.type,
        enum: flattened.enum,
      };
      for (var _k = 0, _l = ["description", "title", "default"]; _k < _l.length; _k++) {
        var key = _l[_k];
        if (key in obj && obj[key] !== undefined) {
          result[key] = obj[key];
        }
      }
      return result;
    }
    if (stripped && nonNullVariants.length === 1) {
      var lone = nonNullVariants[0];
      if (lone && typeof lone === "object" && !Array.isArray(lone)) {
        var result = __assign({}, lone);
        for (var _m = 0, _o = ["description", "title", "default"]; _m < _o.length; _m++) {
          var key = _o[_m];
          if (key in obj && obj[key] !== undefined) {
            result[key] = obj[key];
          }
        }
        return result;
      }
      return lone;
    }
  }
  var cleaned = {};
  for (var _p = 0, _q = Object.entries(obj); _p < _q.length; _p++) {
    var _r = _q[_p],
      key = _r[0],
      value = _r[1];
    if (exports.GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS.has(key)) {
      continue;
    }
    if (key === "const") {
      cleaned.enum = [value];
      continue;
    }
    if (key === "type" && (hasAnyOf || hasOneOf)) {
      continue;
    }
    if (
      key === "type" &&
      Array.isArray(value) &&
      value.every(function (entry) {
        return typeof entry === "string";
      })
    ) {
      var types = value.filter(function (entry) {
        return entry !== "null";
      });
      cleaned.type = types.length === 1 ? types[0] : types;
      continue;
    }
    if (key === "properties" && value && typeof value === "object") {
      var props = value;
      cleaned[key] = Object.fromEntries(
        Object.entries(props).map(function (_a) {
          var k = _a[0],
            v = _a[1];
          return [k, cleanSchemaForGeminiWithDefs(v, nextDefs, refStack)];
        }),
      );
    } else if (key === "items" && value) {
      if (Array.isArray(value)) {
        cleaned[key] = value.map(function (entry) {
          return cleanSchemaForGeminiWithDefs(entry, nextDefs, refStack);
        });
      } else if (typeof value === "object") {
        cleaned[key] = cleanSchemaForGeminiWithDefs(value, nextDefs, refStack);
      } else {
        cleaned[key] = value;
      }
    } else if (key === "anyOf" && Array.isArray(value)) {
      cleaned[key] =
        cleanedAnyOf !== null && cleanedAnyOf !== void 0
          ? cleanedAnyOf
          : value.map(function (variant) {
              return cleanSchemaForGeminiWithDefs(variant, nextDefs, refStack);
            });
    } else if (key === "oneOf" && Array.isArray(value)) {
      cleaned[key] =
        cleanedOneOf !== null && cleanedOneOf !== void 0
          ? cleanedOneOf
          : value.map(function (variant) {
              return cleanSchemaForGeminiWithDefs(variant, nextDefs, refStack);
            });
    } else if (key === "allOf" && Array.isArray(value)) {
      cleaned[key] = value.map(function (variant) {
        return cleanSchemaForGeminiWithDefs(variant, nextDefs, refStack);
      });
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}
function cleanSchemaForGemini(schema) {
  if (!schema || typeof schema !== "object") {
    return schema;
  }
  if (Array.isArray(schema)) {
    return schema.map(cleanSchemaForGemini);
  }
  var defs = extendSchemaDefs(undefined, schema);
  return cleanSchemaForGeminiWithDefs(schema, defs, undefined);
}
