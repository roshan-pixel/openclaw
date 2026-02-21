"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSessionSlug = createSessionSlug;
var SLUG_ADJECTIVES = [
  "amber",
  "briny",
  "brisk",
  "calm",
  "clear",
  "cool",
  "crisp",
  "dawn",
  "delta",
  "ember",
  "faint",
  "fast",
  "fresh",
  "gentle",
  "glow",
  "good",
  "grand",
  "keen",
  "kind",
  "lucky",
  "marine",
  "mellow",
  "mild",
  "neat",
  "nimble",
  "nova",
  "oceanic",
  "plaid",
  "quick",
  "quiet",
  "rapid",
  "salty",
  "sharp",
  "swift",
  "tender",
  "tidal",
  "tidy",
  "tide",
  "vivid",
  "warm",
  "wild",
  "young",
];
var SLUG_NOUNS = [
  "atlas",
  "basil",
  "bison",
  "bloom",
  "breeze",
  "canyon",
  "cedar",
  "claw",
  "cloud",
  "comet",
  "coral",
  "cove",
  "crest",
  "crustacean",
  "daisy",
  "dune",
  "ember",
  "falcon",
  "fjord",
  "forest",
  "glade",
  "gulf",
  "harbor",
  "haven",
  "kelp",
  "lagoon",
  "lobster",
  "meadow",
  "mist",
  "nudibranch",
  "nexus",
  "ocean",
  "orbit",
  "otter",
  "pine",
  "prairie",
  "reef",
  "ridge",
  "river",
  "rook",
  "sable",
  "sage",
  "seaslug",
  "shell",
  "shoal",
  "shore",
  "slug",
  "summit",
  "tidepool",
  "trail",
  "valley",
  "wharf",
  "willow",
  "zephyr",
];
function randomChoice(values, fallback) {
  var _a;
  return (_a = values[Math.floor(Math.random() * values.length)]) !== null && _a !== void 0
    ? _a
    : fallback;
}
function createSlugBase(words) {
  if (words === void 0) {
    words = 2;
  }
  var parts = [randomChoice(SLUG_ADJECTIVES, "steady"), randomChoice(SLUG_NOUNS, "harbor")];
  if (words > 2) {
    parts.push(randomChoice(SLUG_NOUNS, "reef"));
  }
  return parts.join("-");
}
function createSessionSlug(isTaken) {
  var isIdTaken =
    isTaken !== null && isTaken !== void 0
      ? isTaken
      : function () {
          return false;
        };
  for (var attempt = 0; attempt < 12; attempt += 1) {
    var base = createSlugBase(2);
    if (!isIdTaken(base)) {
      return base;
    }
    for (var i = 2; i <= 12; i += 1) {
      var candidate = "".concat(base, "-").concat(i);
      if (!isIdTaken(candidate)) {
        return candidate;
      }
    }
  }
  for (var attempt = 0; attempt < 12; attempt += 1) {
    var base = createSlugBase(3);
    if (!isIdTaken(base)) {
      return base;
    }
    for (var i = 2; i <= 12; i += 1) {
      var candidate = "".concat(base, "-").concat(i);
      if (!isIdTaken(candidate)) {
        return candidate;
      }
    }
  }
  var fallback = "".concat(createSlugBase(3), "-").concat(Math.random().toString(36).slice(2, 5));
  return isIdTaken(fallback) ? "".concat(fallback, "-").concat(Date.now().toString(36)) : fallback;
}
