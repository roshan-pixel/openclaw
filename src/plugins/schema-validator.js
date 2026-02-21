"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateJsonSchemaValue = validateJsonSchemaValue;
var ajv_1 = require("ajv");
var ajv = new ajv_1.default({
  allErrors: true,
  strict: false,
  removeAdditional: false,
});
var schemaCache = new Map();
function formatAjvErrors(errors) {
  if (!errors || errors.length === 0) {
    return ["invalid config"];
  }
  return errors.map(function (error) {
    var _a, _b;
    var path =
      ((_a = error.instancePath) === null || _a === void 0
        ? void 0
        : _a.replace(/^\//, "").replace(/\//g, ".")) || "<root>";
    var message = (_b = error.message) !== null && _b !== void 0 ? _b : "invalid";
    return "".concat(path, ": ").concat(message);
  });
}
function validateJsonSchemaValue(params) {
  var cached = schemaCache.get(params.cacheKey);
  if (!cached || cached.schema !== params.schema) {
    var validate = ajv.compile(params.schema);
    cached = { validate: validate, schema: params.schema };
    schemaCache.set(params.cacheKey, cached);
  }
  var ok = cached.validate(params.value);
  if (ok) {
    return { ok: true };
  }
  return { ok: false, errors: formatAjvErrors(cached.validate.errors) };
}
