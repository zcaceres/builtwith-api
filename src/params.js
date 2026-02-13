const toQueryString = (params) =>
  Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%2C/gi, ",")}`)
    .join("&");

const booleanFlag = (value) => (value ? "yes" : undefined);

const booleanParams = (params, mapping) =>
  Object.fromEntries(
    Object.entries(mapping).map(([jsKey, apiKey]) => [
      apiKey,
      booleanFlag(params?.[jsKey]),
    ])
  );

const cleanWords = (words) =>
  words ? words.split(",").map((w) => w.trim()).join(",") : undefined;

const buildURL = (apiKey, format, path, params, subdomain = "api") => {
  const base = `https://${subdomain}.builtwith.com/${path}/api.${format}?KEY=${apiKey}`;
  const qs = toQueryString(params);
  return qs ? `${base}&${qs}` : base;
};

const validateLookup = (url, { multi = false } = {}) => {
  if (!Array.isArray(url)) return;
  if (!multi) throw new Error("API does not allow for multi-domain LOOKUP");
  if (url.length > 16) throw new Error("Domain LOOKUP size too big (16 max)");
};

module.exports = {
  toQueryString,
  booleanParams,
  cleanWords,
  buildURL,
  validateLookup,
};
