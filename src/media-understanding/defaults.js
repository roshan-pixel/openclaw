"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MEDIA_CONCURRENCY = exports.CLI_OUTPUT_MAX_BUFFER = exports.DEFAULT_AUDIO_MODELS = exports.DEFAULT_VIDEO_MAX_BASE64_BYTES = exports.DEFAULT_PROMPT = exports.DEFAULT_TIMEOUT_SECONDS = exports.DEFAULT_MAX_BYTES = exports.DEFAULT_MAX_CHARS_BY_CAPABILITY = exports.DEFAULT_MAX_CHARS = void 0;
var MB = 1024 * 1024;
exports.DEFAULT_MAX_CHARS = 500;
exports.DEFAULT_MAX_CHARS_BY_CAPABILITY = {
    image: exports.DEFAULT_MAX_CHARS,
    audio: undefined,
    video: exports.DEFAULT_MAX_CHARS,
};
exports.DEFAULT_MAX_BYTES = {
    image: 10 * MB,
    audio: 20 * MB,
    video: 50 * MB,
};
exports.DEFAULT_TIMEOUT_SECONDS = {
    image: 60,
    audio: 60,
    video: 120,
};
exports.DEFAULT_PROMPT = {
    image: "Describe the image.",
    audio: "Transcribe the audio.",
    video: "Describe the video.",
};
exports.DEFAULT_VIDEO_MAX_BASE64_BYTES = 70 * MB;
exports.DEFAULT_AUDIO_MODELS = {
    groq: "whisper-large-v3-turbo",
    openai: "gpt-4o-mini-transcribe",
    deepgram: "nova-3",
};
exports.CLI_OUTPUT_MAX_BUFFER = 5 * MB;
exports.DEFAULT_MEDIA_CONCURRENCY = 2;
