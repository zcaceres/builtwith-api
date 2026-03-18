import { describe, expect, it } from "bun:test";
import {
  CompanyToUrlResponseSchema,
  DomainResponseSchema,
  FreeResponseSchema,
  KeywordsResponseSchema,
  ListsResponseSchema,
  ProductResponseSchema,
  RecommendationsResponseSchema,
  RedirectsResponseSchema,
  RelationshipsResponseSchema,
  TagsResponseSchema,
  TrendsResponseSchema,
  TrustResponseSchema,
} from "../src/schemas";

describe("FreeResponseSchema", () => {
  const valid = {
    domain: "example.com",
    first: 1609459200,
    last: 1704067200,
    groups: [
      {
        name: "Analytics",
        live: 3,
        dead: 1,
        latest: 1704067200,
        oldest: 1609459200,
        categories: [
          { live: 2, dead: 0, latest: 1704067200, oldest: 1609459200, name: "Widgets" },
          { live: 1, dead: 1, latest: 1700000000, oldest: 1609459200, name: "Stats" },
        ],
      },
    ],
  };

  it("parses valid response", () => {
    const result = FreeResponseSchema.parse(valid);
    expect(result.groups[0].categories[0].name).toBe("Widgets");
    expect(result.groups[0].categories[0].live).toBe(2);
  });

  it("rejects categories as plain strings", () => {
    const bad = {
      ...valid,
      groups: [{ ...valid.groups[0], categories: ["Widgets"] }],
    };
    expect(() => FreeResponseSchema.parse(bad)).toThrow();
  });

  it("rejects extra fields", () => {
    const extra = { ...valid, extraField: true };
    expect(() => FreeResponseSchema.parse(extra)).toThrow();
  });
});

describe("DomainResponseSchema", () => {
  const valid = {
    Results: [
      {
        Result: {
          SpendHistory: [{ D: 1609459200, S: 500 }],
          IsDB: "True",
          Spend: 1200,
          Paths: [
            {
              Technologies: [
                {
                  Name: "jQuery",
                  Description: "JS library",
                  Link: "https://jquery.com",
                  Tag: "javascript",
                  FirstDetected: 1609459200,
                  LastDetected: 1704067200,
                  IsPremium: "no",
                },
              ],
              FirstIndexed: 1609459200,
              LastIndexed: 1704067200,
              Domain: "example.com",
              Url: "https://example.com",
              SubDomain: "",
            },
          ],
        },
        Meta: {
          Majestic: 12345,
          Vertical: "Technology",
          Social: ["https://twitter.com/example"],
          CompanyName: "Example Inc",
          Telephones: ["+1-555-0100"],
          Emails: ["info@example.com"],
          City: "San Francisco",
          State: "CA",
          Postcode: "94105",
          Country: "US",
          Names: [{ Name: "John Doe", Type: 1, Level: "C", Email: "john@example.com" }],
          ARank: 500,
          QRank: 800,
        },
        Attributes: {
          MJRank: 100,
          MJTLDRank: 50,
          RefSN: 200,
          RefIP: 150,
          Sitemap: 1,
          GTMTags: 3,
          QubitTags: 0,
          TealiumTags: 0,
          AdobeTags: 1,
          CDimensions: 5,
          CGoals: 2,
          CMetrics: 3,
        },
        FirstIndexed: 1609459200,
        LastIndexed: 1704067200,
        Lookup: "example.com",
        SalesRevenue: 5000000,
      },
    ],
    Errors: [],
  };

  it("parses valid response", () => {
    const result = DomainResponseSchema.parse(valid);
    expect(result.Results[0].Result.Paths[0].Technologies[0].Name).toBe("jQuery");
    expect(result.Results[0].Meta.CompanyName).toBe("Example Inc");
    expect(result.Results[0].Attributes.GTMTags).toBe(3);
    expect(result.Results[0].Lookup).toBe("example.com");
  });

  it("rejects IsDB as boolean", () => {
    const bad = structuredClone(valid);
    // biome-ignore lint/suspicious/noExplicitAny: intentionally setting wrong type to test schema rejection
    (bad.Results[0].Result as any).IsDB = true;
    expect(() => DomainResponseSchema.parse(bad)).toThrow();
  });

  it("accepts Technology with optional Parent and Categories", () => {
    const withOptionals = structuredClone(valid);
    withOptionals.Results[0].Result.Paths[0].Technologies[0] = {
      ...withOptionals.Results[0].Result.Paths[0].Technologies[0],
      Parent: "UI Frameworks",
      Categories: ["JavaScript Libraries", "UI"],
    };
    const result = DomainResponseSchema.parse(withOptionals);
    expect(result.Results[0].Result.Paths[0].Technologies[0].Parent).toBe("UI Frameworks");
  });

  it("rejects Errors containing non-strings", () => {
    const bad = structuredClone(valid);
    // biome-ignore lint/suspicious/noExplicitAny: intentionally setting wrong type to test schema rejection
    (bad as any).Errors = [{ code: 1 }];
    expect(() => DomainResponseSchema.parse(bad)).toThrow();
  });
});

describe("ListsResponseSchema", () => {
  it("parses minimal result (D only)", () => {
    const minimal = { NextOffset: "abc123", Results: [{ D: "example.com" }] };
    const result = ListsResponseSchema.parse(minimal);
    expect(result.Results[0].D).toBe("example.com");
    expect(result.Results[0].FI).toBeUndefined();
  });

  it("parses full result with all fields", () => {
    const full = {
      NextOffset: "abc123",
      Results: [
        {
          D: "example.com",
          FI: 1609459200,
          LI: 1704067200,
          LOS: ["jQuery", "React"],
          Q: 100,
          A: 50,
          U: 25,
          M: 10,
          SKU: 5,
          F: 3,
          E: 1,
          FD: 1609459200,
          LD: 1704067200,
          S: 1000,
          R: 500,
          Country: "US",
        },
      ],
    };
    const result = ListsResponseSchema.parse(full);
    expect(result.Results[0].LOS).toEqual(["jQuery", "React"]);
    expect(result.Results[0].Country).toBe("US");
  });
});

describe("RelationshipsResponseSchema", () => {
  const valid = {
    Relationships: [
      {
        Domain: "example.com",
        Identifiers: [
          {
            Value: "UA-12345",
            Type: "GoogleAnalytics",
            First: 1609459200,
            Last: 1704067200,
            Matches: [{ Domain: "related.com", First: 1609459200, Last: 1704067200, Overlap: true }],
          },
        ],
      },
    ],
    Errors: [],
    results: 1,
    max_per_page: 50,
    next_skip: 0,
    more_results: false,
  };

  it("parses valid response with pagination", () => {
    const result = RelationshipsResponseSchema.parse(valid);
    expect(result.Relationships[0].Identifiers[0].First).toBe(1609459200);
    expect(result.Relationships[0].Identifiers[0].Matches[0].Overlap).toBe(true);
    expect(result.more_results).toBe(false);
    expect(result.max_per_page).toBe(50);
  });

  it("rejects Matches as plain objects without required fields", () => {
    const bad = structuredClone(valid);
    // biome-ignore lint/suspicious/noExplicitAny: intentionally setting wrong type to test schema rejection
    (bad.Relationships[0].Identifiers[0].Matches as any) = [{ Domain: "x.com" }];
    expect(() => RelationshipsResponseSchema.parse(bad)).toThrow();
  });
});

describe("KeywordsResponseSchema", () => {
  it("parses valid response", () => {
    const valid = {
      Keywords: [{ Domain: "example.com", Keywords: ["analytics", "tracking"] }],
    };
    const result = KeywordsResponseSchema.parse(valid);
    expect(result.Keywords[0].Keywords).toEqual(["analytics", "tracking"]);
  });
});

describe("TrendsResponseSchema", () => {
  const valid = {
    Tech: {
      icon: "https://d3c1mi4ekssrlm.cloudfront.net/icon.png",
      categories: ["Analytics"],
      tag: "analytics",
      is_premium: "yes",
      name: "Google Analytics",
      description: "Web analytics service",
      link: "https://analytics.google.com",
      trends_link: "https://trends.builtwith.com/analytics/Google-Analytics",
      coverage: {
        ten_k: 6500,
        hundred_k: 55000,
        milly: 350000,
        live: 28000000,
        expired: 15000000,
      },
    },
  };

  it("parses valid response with coverage", () => {
    const result = TrendsResponseSchema.parse(valid);
    expect(result.Tech.coverage.milly).toBe(350000);
    expect(result.Tech.trends_link).toContain("trends.builtwith.com");
    expect(result.Tech.is_premium).toBe("yes");
  });

  it("rejects missing coverage", () => {
    const bad = structuredClone(valid);
    // biome-ignore lint/suspicious/noExplicitAny: intentionally deleting field to test schema rejection
    delete (bad.Tech as any).coverage;
    expect(() => TrendsResponseSchema.parse(bad)).toThrow();
  });
});

describe("CompanyToUrlResponseSchema", () => {
  const valid = [
    {
      Domain: "example.com",
      CompanyName: "Example Inc",
      Spend: 5000,
      PageRank: 6,
      BuiltWithRank: 1200,
      Parked: false,
      Country: "US",
      State: "CA",
      Postcode: "94105",
      City: "San Francisco",
      Socials: ["https://twitter.com/example"],
    },
  ];

  it("parses valid response", () => {
    const result = CompanyToUrlResponseSchema.parse(valid);
    expect(result[0].CompanyName).toBe("Example Inc");
    expect(result[0].Parked).toBe(false);
    expect(result[0].Socials).toHaveLength(1);
  });
});

describe("TrustResponseSchema", () => {
  const valid = {
    Domain: "example.com",
    DBRecord: {
      EarliestRecord: 1609459200,
      LatestUpdate: 1704067200,
      PremiumTechs: 5,
      LiveTechs: true,
      AffiliateLinks: false,
      PaymentOptions: true,
      Ecommerce: true,
      Parked: false,
      Spend: 3000,
      Established: true,
      DBIndexed: true,
    },
    LiveRecord: null,
    Status: 0,
  };

  it("parses valid response", () => {
    const result = TrustResponseSchema.parse(valid);
    expect(result.DBRecord.PremiumTechs).toBe(5);
    expect(result.LiveRecord).toBeNull();
    expect(result.Status).toBe(0);
  });

  it("rejects Status as string", () => {
    const bad = { ...valid, Status: "OK" };
    expect(() => TrustResponseSchema.parse(bad)).toThrow();
  });

  it("accepts LiveRecord as object", () => {
    const withLive = { ...valid, LiveRecord: { someField: "data" } };
    const result = TrustResponseSchema.parse(withLive);
    expect(result.LiveRecord).toBeTruthy();
  });
});

describe("TagsResponseSchema", () => {
  const valid = [
    {
      Value: "GTM-XXXX",
      Matches: [{ Domain: "example.com", First: "2021-01-01T00:00:00Z", Last: "2024-01-01T00:00:00Z" }],
    },
  ];

  it("parses valid response with string dates", () => {
    const result = TagsResponseSchema.parse(valid);
    expect(result[0].Matches[0].First).toBe("2021-01-01T00:00:00Z");
  });

  it("rejects First/Last as numbers", () => {
    const bad = [{ Value: "GTM-XXXX", Matches: [{ Domain: "x.com", First: 123, Last: 456 }] }];
    expect(() => TagsResponseSchema.parse(bad)).toThrow();
  });
});

describe("RecommendationsResponseSchema", () => {
  const valid = [
    {
      Domain: "example.com",
      Compiled: "2024-01-15",
      Recommendations: [
        {
          link: "https://example.com/tech",
          name: "Better Analytics",
          tag: "analytics",
          categories: ["Analytics", "Marketing"],
          stars: 4,
          match: 85,
        },
      ],
    },
  ];

  it("parses valid response", () => {
    const result = RecommendationsResponseSchema.parse(valid);
    expect(result[0].Compiled).toBe("2024-01-15");
    expect(result[0].Recommendations[0].stars).toBe(4);
    expect(result[0].Recommendations[0].categories).toEqual(["Analytics", "Marketing"]);
  });
});

describe("RedirectsResponseSchema", () => {
  const valid = {
    Lookup: "example.com",
    Inbound: [{ Domain: "old.com", FirstDetected: "2021-01-01T00:00:00Z", LastDetected: "2024-01-01T00:00:00Z" }],
    Outbound: [{ Domain: "new.com", FirstDetected: "2023-06-01T00:00:00Z", LastDetected: "2024-01-01T00:00:00Z" }],
  };

  it("parses valid response with string dates", () => {
    const result = RedirectsResponseSchema.parse(valid);
    expect(result.Inbound[0].FirstDetected).toBe("2021-01-01T00:00:00Z");
  });

  it("rejects dates as numbers", () => {
    const bad = {
      Lookup: "example.com",
      Inbound: [{ Domain: "old.com", FirstDetected: 123, LastDetected: 456 }],
      Outbound: [],
    };
    expect(() => RedirectsResponseSchema.parse(bad)).toThrow();
  });
});

describe("ProductResponseSchema", () => {
  const valid = {
    query: "shoes",
    is_more: true,
    page: 1,
    limit: 50,
    results: 100,
    shop_count: 42,
    credits: 1000,
    used: 50,
    remaining: 950,
    used_this_query: 1,
    next_page: "https://api.builtwith.com/product?page=2",
    shops: [
      {
        Domain: "shoes.com",
        Products: [
          {
            Title: "Running Shoes",
            Url: "https://shoes.com/running",
            Indexed: "2024-01-15T00:00:00Z",
            FirstIndexed: "2023-06-01T00:00:00Z",
            Price: 99.99,
          },
        ],
        Type: 1,
        Spend: 5000,
      },
    ],
  };

  it("parses valid response with products", () => {
    const result = ProductResponseSchema.parse(valid);
    expect(result.shop_count).toBe(42);
    expect(result.remaining).toBe(950);
    expect(result.shops[0].Products[0].Title).toBe("Running Shoes");
    expect(result.shops[0].Type).toBe(1);
  });

  it("rejects missing shop_count", () => {
    const bad = structuredClone(valid);
    // biome-ignore lint/suspicious/noExplicitAny: intentionally deleting field to test schema rejection
    delete (bad as any).shop_count;
    expect(() => ProductResponseSchema.parse(bad)).toThrow();
  });
});
