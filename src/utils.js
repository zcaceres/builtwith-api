const { VALID_RESPONSE_TYPES } = require("./config");

module.exports = {
  makeStandardRequest: async function (url, responseFormat) {
    const res = await fetch(url);
    if (responseFormat === VALID_RESPONSE_TYPES.XML) {
      return res.text();
    } else {
      return res.json();
    }
  },

  makeBulletProofRequest: async function (url, responseFormat) {
    const res = await fetch(url);
    if (
      responseFormat === VALID_RESPONSE_TYPES.TXT ||
      responseFormat === VALID_RESPONSE_TYPES.XML
    ) {
      return res.text();
    } else {
      /**
       * BuiltWith sends invalid formats as errors, which break JSON parsing.
       */
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
   *  Convert a parameters object into a query string, joined by the `&` char
   * { paramOne: 'hello', paramTwo: 'goodbye' }
   * @param {Object} params
   */
  paramsObjToQueryString: function (params) {
    // '&paramOne=hello&paramTwo=goodbye
    return Object.entries(params) // [['paramOne', 'hello'], ['paramTwo', 'goodbye]]
      .filter(([, value]) => {
        if (value === undefined) return false;
        else return true;
      })
      .map(([key, value]) => {
        return `${key}=${value}`; // ['paramOne=hello', 'paramTwo=goodbye']
      })
      .join("&"); // 'paramOne=hello&paramTwo=goodBye'
  },
};
