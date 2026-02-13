const { VALID_RESPONSE_TYPES } = require("./config");

const TEXT_FORMATS = [
  VALID_RESPONSE_TYPES.TXT,
  VALID_RESPONSE_TYPES.XML,
  VALID_RESPONSE_TYPES.CSV,
  VALID_RESPONSE_TYPES.TSV,
];

const request = async (url, format) => {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`BuiltWith API error ${res.status}: ${body}`);
  }
  return TEXT_FORMATS.includes(format) ? res.text() : res.json();
};

const requestSafe = async (url, format) => {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`BuiltWith API error ${res.status}: ${body}`);
  }
  if (TEXT_FORMATS.includes(format)) {
    return res.text();
  }
  const parsed = await res.text();
  try {
    return JSON.parse(parsed);
  } catch (e) {
    console.warn(
      "BuiltWith sent an invalid JSON payload. Falling back to text parsing.",
    );
    return parsed;
  }
};

module.exports = { request, requestSafe };
