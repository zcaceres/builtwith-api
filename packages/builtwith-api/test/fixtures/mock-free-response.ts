/**
 * Bun preload script that replaces fetch with a mock BuiltWith free response.
 * Used by CLI integration tests to verify output formatting without hitting the real API.
 * Only affects the subprocess it's loaded into — not the test runner itself.
 */
const mockResponse = {
  domain: "example.com",
  first: 1199404800000,
  last: 1710288000000,
  groups: [
    {
      name: "Analytics",
      live: 2,
      dead: 1,
      latest: 1710288000000,
      oldest: 1199404800000,
      categories: [
        { name: "Tracking", live: 1, dead: 0, latest: 1710288000000, oldest: 1199404800000 },
        { name: "Ads", live: 1, dead: 1, latest: 1710288000000, oldest: 1199404800000 },
      ],
    },
    {
      name: "Widgets",
      live: 1,
      dead: 0,
      latest: 1710288000000,
      oldest: 1400000000000,
      categories: [{ name: "Live Chat", live: 1, dead: 0, latest: 1710288000000, oldest: 1400000000000 }],
    },
  ],
};

globalThis.fetch = (() => Promise.resolve(new Response(JSON.stringify(mockResponse), { status: 200 }))) as typeof fetch;
