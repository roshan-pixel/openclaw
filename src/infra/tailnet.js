"use strict";
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
exports.listTailnetAddresses = listTailnetAddresses;
exports.pickPrimaryTailnetIPv4 = pickPrimaryTailnetIPv4;
exports.pickPrimaryTailnetIPv6 = pickPrimaryTailnetIPv6;
var node_os_1 = require("node:os");
function isTailnetIPv4(address) {
  var parts = address.split(".");
  if (parts.length !== 4) {
    return false;
  }
  var octets = parts.map(function (p) {
    return Number.parseInt(p, 10);
  });
  if (
    octets.some(function (n) {
      return !Number.isFinite(n) || n < 0 || n > 255;
    })
  ) {
    return false;
  }
  // Tailscale IPv4 range: 100.64.0.0/10
  // https://tailscale.com/kb/1015/100.x-addresses
  var a = octets[0],
    b = octets[1];
  return a === 100 && b >= 64 && b <= 127;
}
function isTailnetIPv6(address) {
  // Tailscale IPv6 ULA prefix: fd7a:115c:a1e0::/48
  // (stable across tailnets; nodes get per-device suffixes)
  var normalized = address.trim().toLowerCase();
  return normalized.startsWith("fd7a:115c:a1e0:");
}
function listTailnetAddresses() {
  var _a;
  var ipv4 = [];
  var ipv6 = [];
  var ifaces = node_os_1.default.networkInterfaces();
  for (var _i = 0, _b = Object.values(ifaces); _i < _b.length; _i++) {
    var entries = _b[_i];
    if (!entries) {
      continue;
    }
    for (var _c = 0, entries_1 = entries; _c < entries_1.length; _c++) {
      var e = entries_1[_c];
      if (!e || e.internal) {
        continue;
      }
      var address = (_a = e.address) === null || _a === void 0 ? void 0 : _a.trim();
      if (!address) {
        continue;
      }
      if (isTailnetIPv4(address)) {
        ipv4.push(address);
      }
      if (isTailnetIPv6(address)) {
        ipv6.push(address);
      }
    }
  }
  return {
    ipv4: __spreadArray([], new Set(ipv4), true),
    ipv6: __spreadArray([], new Set(ipv6), true),
  };
}
function pickPrimaryTailnetIPv4() {
  return listTailnetAddresses().ipv4[0];
}
function pickPrimaryTailnetIPv6() {
  return listTailnetAddresses().ipv6[0];
}
