"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOpenClawVersion = parseOpenClawVersion;
exports.compareOpenClawVersions = compareOpenClawVersions;
var VERSION_RE = /^v?(\d+)\.(\d+)\.(\d+)(?:-(\d+))?/;
function parseOpenClawVersion(raw) {
  if (!raw) {
    return null;
  }
  var match = raw.trim().match(VERSION_RE);
  if (!match) {
    return null;
  }
  var major = match[1],
    minor = match[2],
    patch = match[3],
    revision = match[4];
  return {
    major: Number.parseInt(major, 10),
    minor: Number.parseInt(minor, 10),
    patch: Number.parseInt(patch, 10),
    revision: revision ? Number.parseInt(revision, 10) : 0,
  };
}
function compareOpenClawVersions(a, b) {
  var parsedA = parseOpenClawVersion(a);
  var parsedB = parseOpenClawVersion(b);
  if (!parsedA || !parsedB) {
    return null;
  }
  if (parsedA.major !== parsedB.major) {
    return parsedA.major < parsedB.major ? -1 : 1;
  }
  if (parsedA.minor !== parsedB.minor) {
    return parsedA.minor < parsedB.minor ? -1 : 1;
  }
  if (parsedA.patch !== parsedB.patch) {
    return parsedA.patch < parsedB.patch ? -1 : 1;
  }
  if (parsedA.revision !== parsedB.revision) {
    return parsedA.revision < parsedB.revision ? -1 : 1;
  }
  return 0;
}
