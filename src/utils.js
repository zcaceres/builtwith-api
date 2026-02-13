const { VALID_RESPONSE_TYPES } = require("./config");

const TEXT_FORMATS = [
  VALID_RESPONSE_TYPES.TXT,
  VALID_RESPONSE_TYPES.XML,
  VALID_RESPONSE_TYPES.CSV,
  VALID_RESPONSE_TYPES.TSV,
];

module.exports = {
  makeStandardRequest: async function (url, responseFormat) {
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`BuiltWith API error ${res.status}: ${body}`);
    }
    if (TEXT_FORMATS.includes(responseFormat)) {
      return res.text();
    } else {
      return res.json();
    }
  },

  makeBulletProofRequest: async function (url, responseFormat) {
    const res = await fetch(url);
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`BuiltWith API error ${res.status}: ${body}`);
    }
    if (TEXT_FORMATS.includes(responseFormat)) {
      return res.text();
    } else {
      let parsed = await res.text();
      try {
        return JSON.parse(parsed);
      } catch (e) {
        console.warn(
          "BuiltWith sent an invalid JSON payload. Falling back to text parsing.",
        );
        return parsed;
      }
    }
  },

  /**
   * Convert a parameters object into a query string, joined by the `&` char
   * { paramOne: 'hello', paramTwo: 'goodbye' } => 'paramOne=hello&paramTwo=goodbye'
   * @param {Object} params
   */
  paramsObjToQueryString: function (params) {
    return Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(value).replace(/%2C/gi, ",")}`)
      .join("&");
  },
};
