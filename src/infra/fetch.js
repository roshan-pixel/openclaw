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
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapFetchWithAbortSignal = wrapFetchWithAbortSignal;
exports.resolveFetch = resolveFetch;
function withDuplex(init, input) {
  var hasInitBody = (init === null || init === void 0 ? void 0 : init.body) != null;
  var hasRequestBody =
    !hasInitBody &&
    typeof Request !== "undefined" &&
    input instanceof Request &&
    input.body != null;
  if (!hasInitBody && !hasRequestBody) {
    return init;
  }
  if (init && "duplex" in init) {
    return init;
  }
  return init ? __assign(__assign({}, init), { duplex: "half" }) : { duplex: "half" };
}
function wrapFetchWithAbortSignal(fetchImpl) {
  var wrapped = function (input, init) {
    var patchedInit = withDuplex(init, input);
    var signal = patchedInit === null || patchedInit === void 0 ? void 0 : patchedInit.signal;
    if (!signal) {
      return fetchImpl(input, patchedInit);
    }
    if (typeof AbortSignal !== "undefined" && signal instanceof AbortSignal) {
      return fetchImpl(input, patchedInit);
    }
    if (typeof AbortController === "undefined") {
      return fetchImpl(input, patchedInit);
    }
    if (typeof signal.addEventListener !== "function") {
      return fetchImpl(input, patchedInit);
    }
    var controller = new AbortController();
    var onAbort = function () {
      return controller.abort();
    };
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener("abort", onAbort, { once: true });
    }
    var response = fetchImpl(
      input,
      __assign(__assign({}, patchedInit), { signal: controller.signal }),
    );
    if (typeof signal.removeEventListener === "function") {
      void response.finally(function () {
        signal.removeEventListener("abort", onAbort);
      });
    }
    return response;
  };
  var fetchWithPreconnect = fetchImpl;
  wrapped.preconnect =
    typeof fetchWithPreconnect.preconnect === "function"
      ? fetchWithPreconnect.preconnect.bind(fetchWithPreconnect)
      : function () {};
  return Object.assign(wrapped, fetchImpl);
}
function resolveFetch(fetchImpl) {
  var resolved = fetchImpl !== null && fetchImpl !== void 0 ? fetchImpl : globalThis.fetch;
  if (!resolved) {
    return undefined;
  }
  return wrapFetchWithAbortSignal(resolved);
}
