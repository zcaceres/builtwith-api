import { z } from "zod/v4";

// ─── Input Schemas ───────────────────────────────────────────────────────────

/** Supported API response formats. */
export const ResponseFormatSchema = z.enum(["xml", "json", "txt", "csv", "tsv"]);
/**
 * Response format returned by the BuiltWith API.
 *
 * - `"json"` — parsed and validated (default)
 * - `"xml"` / `"txt"` / `"csv"` / `"tsv"` — returned as raw strings
 */
export type ResponseFormat = z.infer<typeof ResponseFormatSchema>;

/** Validation schema for {@link ClientOptions}. */
export const ClientOptionsSchema = z.strictObject({
  responseFormat: ResponseFormatSchema.optional(),
});
/**
 * Options passed to `createClient`.
 *
 * @example
 * ```ts
 * const client = createClient(API_KEY, { responseFormat: "xml" });
 * ```
 */
export type ClientOptions = z.infer<typeof ClientOptionsSchema>;

/** Matches YYYY-MM-DD or YYYY-MM-DD-YYYY-MM-DD date range format. */
const dateRangePattern = /^\d{4}-\d{2}-\d{2}(-\d{4}-\d{2}-\d{2})?$/;

/** Validation schema for {@link DomainParams}. */
export const DomainParamsSchema = z.strictObject({
  hideAll: z.boolean().optional(),
  hideDescriptionAndLinks: z.boolean().optional(),
  onlyLiveTechnologies: z.boolean().optional(),
  noMetaData: z.boolean().optional(),
  noAttributeData: z.boolean().optional(),
  noPII: z.boolean().optional(),
  firstDetectedRange: z.string().regex(dateRangePattern, "Expected YYYY-MM-DD or YYYY-MM-DD-YYYY-MM-DD").optional(),
  lastDetectedRange: z.string().regex(dateRangePattern, "Expected YYYY-MM-DD or YYYY-MM-DD-YYYY-MM-DD").optional(),
});
/**
 * Optional parameters for the Domain API endpoint.
 *
 * @example
 * ```ts
 * await client.domain("example.com", {
 *   onlyLiveTechnologies: true,
 *   hideAll: true,
 * });
 * ```
 */
export type DomainParams = z.infer<typeof DomainParamsSchema>;

/** Validation schema for {@link ListsParams}. */
export const ListsParamsSchema = z.strictObject({
  includeMetaData: z.boolean().optional(),
  offset: z.string().optional(),
  since: z.string().optional(),
});
/**
 * Optional parameters for the Lists API endpoint.
 *
 * @example
 * ```ts
 * await client.lists("Shopify", { since: "2024-01-01" });
 * ```
 */
export type ListsParams = z.infer<typeof ListsParamsSchema>;

/** Validation schema for {@link TrendsParams}. */
export const TrendsParamsSchema = z.strictObject({
  date: z.string().optional(),
});
/**
 * Optional parameters for the Trends API endpoint.
 *
 * @example
 * ```ts
 * await client.trends("jQuery", { date: "2024-06" });
 * ```
 */
export type TrendsParams = z.infer<typeof TrendsParamsSchema>;

/** Validation schema for {@link CompanyToUrlParams}. */
export const CompanyToUrlParamsSchema = z.strictObject({
  tld: z.string().optional(),
  amount: z.number().optional(),
});
/**
 * Optional parameters for the Company-to-URL API endpoint.
 *
 * @example
 * ```ts
 * await client.companyToUrl("Google", { tld: "com", amount: 5 });
 * ```
 */
export type CompanyToUrlParams = z.infer<typeof CompanyToUrlParamsSchema>;

/** Validation schema for {@link TrustParams}. */
export const TrustParamsSchema = z.strictObject({
  words: z.string().optional(),
  live: z.boolean().optional(),
});
/**
 * Optional parameters for the Trust API endpoint.
 *
 * @example
 * ```ts
 * await client.trust("example.com", { words: "shop,buy", live: true });
 * ```
 */
export type TrustParams = z.infer<typeof TrustParamsSchema>;

export const SingleLookupSchema = z.string().min(1);
export const MultiLookupSchema = z.union([z.string().min(1), z.array(z.string().min(1)).min(1).max(16)]);

// ─── Response Schemas ────────────────────────────────────────────────────────
// Use z.strictObject() to catch upstream API drift — if BuiltWith adds or
// removes fields, the parse will fail, signaling the schema needs updating.

/** Validation schema for {@link FreeResponse}. */
export const FreeResponseSchema = z.strictObject({
  domain: z.string(),
  first: z.number(),
  last: z.number(),
  groups: z.array(
    z.strictObject({
      name: z.string(),
      live: z.number(),
      dead: z.number(),
      latest: z.number(),
      oldest: z.number(),
      categories: z.array(
        z.strictObject({
          live: z.number(),
          dead: z.number(),
          latest: z.number(),
          oldest: z.number(),
          name: z.string(),
        }),
      ),
    }),
  ),
});
/** Response from the Free API — basic technology profile for a single domain. */
export type FreeResponse = z.infer<typeof FreeResponseSchema>;

const TechnologySchema = z.strictObject({
  Name: z.string(),
  Description: z.string(),
  Link: z.string(),
  Parent: z.string().optional(),
  Tag: z.string(),
  FirstDetected: z.number(),
  LastDetected: z.number(),
  IsPremium: z.string(),
  Categories: z.array(z.string()).optional(),
});

const PathSchema = z.strictObject({
  Technologies: z.array(TechnologySchema),
  FirstIndexed: z.number(),
  LastIndexed: z.number(),
  Domain: z.string(),
  Url: z.string(),
  SubDomain: z.string(),
});

const MetaSchema = z.strictObject({
  Majestic: z.number(),
  Vertical: z.string(),
  Social: z.array(z.string()),
  CompanyName: z.string(),
  Telephones: z.array(z.string()),
  Emails: z.array(z.string()),
  City: z.string(),
  State: z.string(),
  Postcode: z.string(),
  Country: z.string(),
  Names: z.array(
    z.strictObject({
      Name: z.string(),
      Type: z.number(),
      Level: z.string(),
      Email: z.string(),
    }),
  ),
  ARank: z.number(),
  QRank: z.number(),
});

const AttributesSchema = z.strictObject({
  MJRank: z.number(),
  MJTLDRank: z.number(),
  RefSN: z.number(),
  RefIP: z.number(),
  Sitemap: z.number(),
  GTMTags: z.number(),
  QubitTags: z.number(),
  TealiumTags: z.number(),
  AdobeTags: z.number(),
  CDimensions: z.number(),
  CGoals: z.number(),
  CMetrics: z.number(),
});

/** Validation schema for {@link DomainResponse}. */
export const DomainResponseSchema = z.strictObject({
  Results: z.array(
    z.strictObject({
      Result: z.strictObject({
        SpendHistory: z.array(
          z.strictObject({
            D: z.number(),
            S: z.number(),
          }),
        ),
        IsDB: z.string(),
        Spend: z.number(),
        Paths: z.array(PathSchema),
      }),
      Meta: MetaSchema,
      Attributes: AttributesSchema,
      FirstIndexed: z.number(),
      LastIndexed: z.number(),
      Lookup: z.string(),
      SalesRevenue: z.number(),
    }),
  ),
  Errors: z.array(z.string()),
});
/** Response from the Domain API — detailed technology profile with metadata and attributes. */
export type DomainResponse = z.infer<typeof DomainResponseSchema>;

/** Validation schema for {@link ListsResponse}. */
export const ListsResponseSchema = z.strictObject({
  NextOffset: z.string(),
  Results: z.array(
    z.strictObject({
      D: z.string(),
      FI: z.number().optional(),
      LI: z.number().optional(),
      LOS: z.array(z.string()).optional(),
      Q: z.number().optional(),
      A: z.number().optional(),
      U: z.number().optional(),
      M: z.number().optional(),
      SKU: z.number().optional(),
      F: z.number().optional(),
      E: z.number().optional(),
      FD: z.number().optional(),
      LD: z.number().optional(),
      S: z.number().optional(),
      R: z.number().optional(),
      Country: z.string().optional(),
    }),
  ),
});
/** Response from the Lists API — domains using a specific technology. */
export type ListsResponse = z.infer<typeof ListsResponseSchema>;

/** Validation schema for {@link RelationshipsResponse}. */
export const RelationshipsResponseSchema = z.strictObject({
  Relationships: z.array(
    z.strictObject({
      Domain: z.string(),
      Identifiers: z.array(
        z.strictObject({
          Value: z.string(),
          Type: z.string(),
          First: z.number(),
          Last: z.number(),
          Matches: z.array(
            z.strictObject({
              Domain: z.string(),
              First: z.number(),
              Last: z.number(),
              Overlap: z.boolean(),
            }),
          ),
        }),
      ),
    }),
  ),
  Errors: z.array(z.string()),
  results: z.number(),
  max_per_page: z.number(),
  next_skip: z.number(),
  more_results: z.boolean(),
});
/** Response from the Relationships API — domains sharing identifiers (analytics IDs, ad accounts, etc.). */
export type RelationshipsResponse = z.infer<typeof RelationshipsResponseSchema>;

/** Validation schema for {@link KeywordsResponse}. */
export const KeywordsResponseSchema = z.strictObject({
  Keywords: z.array(
    z.strictObject({
      Domain: z.string(),
      Keywords: z.array(z.string()),
    }),
  ),
});
/** Response from the Keywords API — SEO keywords associated with domains. */
export type KeywordsResponse = z.infer<typeof KeywordsResponseSchema>;

/** Validation schema for {@link TrendsResponse}. */
export const TrendsResponseSchema = z.strictObject({
  Tech: z.strictObject({
    icon: z.string(),
    categories: z.array(z.string()),
    tag: z.string(),
    is_premium: z.string(),
    name: z.string(),
    description: z.string(),
    link: z.string(),
    trends_link: z.string(),
    coverage: z.strictObject({
      ten_k: z.number(),
      hundred_k: z.number(),
      milly: z.number(),
      live: z.number(),
      expired: z.number(),
    }),
  }),
});
/** Response from the Trends API — technology adoption coverage data. */
export type TrendsResponse = z.infer<typeof TrendsResponseSchema>;

/** Validation schema for {@link CompanyToUrlResponse}. */
export const CompanyToUrlResponseSchema = z.array(
  z.strictObject({
    Domain: z.string(),
    CompanyName: z.string(),
    Spend: z.number(),
    PageRank: z.number(),
    BuiltWithRank: z.number(),
    Parked: z.boolean(),
    Country: z.string(),
    State: z.string(),
    Postcode: z.string(),
    City: z.string(),
    Socials: z.array(z.string()),
  }),
);
/** Response from the Company-to-URL API — domains associated with a company name. */
export type CompanyToUrlResponse = z.infer<typeof CompanyToUrlResponseSchema>;

/** Validation schema for {@link TrustResponse}. */
export const TrustResponseSchema = z.strictObject({
  Domain: z.string(),
  DBRecord: z.strictObject({
    EarliestRecord: z.number(),
    LatestUpdate: z.number(),
    PremiumTechs: z.number(),
    LiveTechs: z.boolean(),
    AffiliateLinks: z.boolean(),
    PaymentOptions: z.boolean(),
    Ecommerce: z.boolean(),
    Parked: z.boolean(),
    Spend: z.number(),
    Established: z.boolean(),
    DBIndexed: z.boolean(),
  }),
  LiveRecord: z.object({}).passthrough().nullable(),
  Status: z.number(),
});
/** Response from the Trust API — domain verification and trust score. */
export type TrustResponse = z.infer<typeof TrustResponseSchema>;

/** Validation schema for {@link TagsResponse}. */
export const TagsResponseSchema = z.array(
  z.strictObject({
    Value: z.string(),
    Matches: z.array(
      z.strictObject({
        Domain: z.string(),
        First: z.string(),
        Last: z.string(),
      }),
    ),
  }),
);
/** Response from the Tags API — tracking and analytics tags found on a domain. */
export type TagsResponse = z.infer<typeof TagsResponseSchema>;

/** Validation schema for {@link RecommendationsResponse}. */
export const RecommendationsResponseSchema = z.array(
  z.strictObject({
    Domain: z.string(),
    Compiled: z.string(),
    Recommendations: z.array(
      z.strictObject({
        link: z.string(),
        name: z.string(),
        tag: z.string(),
        categories: z.array(z.string()),
        stars: z.number(),
        match: z.number(),
      }),
    ),
  }),
);
/** Response from the Recommendations API — suggested technologies for a domain. */
export type RecommendationsResponse = z.infer<typeof RecommendationsResponseSchema>;

/** Validation schema for {@link RedirectsResponse}. */
export const RedirectsResponseSchema = z.strictObject({
  Lookup: z.string(),
  Inbound: z.array(
    z.strictObject({
      Domain: z.string(),
      FirstDetected: z.string(),
      LastDetected: z.string(),
    }),
  ),
  Outbound: z.array(
    z.strictObject({
      Domain: z.string(),
      FirstDetected: z.string(),
      LastDetected: z.string(),
    }),
  ),
});
/** Response from the Redirects API — inbound and outbound redirect chains. */
export type RedirectsResponse = z.infer<typeof RedirectsResponseSchema>;

/** Validation schema for {@link ProductResponse}. */
export const ProductResponseSchema = z.strictObject({
  query: z.string(),
  is_more: z.boolean(),
  page: z.number(),
  limit: z.number(),
  results: z.number(),
  shop_count: z.number(),
  credits: z.number(),
  used: z.number(),
  remaining: z.number(),
  used_this_query: z.number(),
  next_page: z.string(),
  shops: z.array(
    z.strictObject({
      Domain: z.string(),
      Products: z.array(
        z.strictObject({
          Title: z.string(),
          Url: z.string(),
          Indexed: z.string(),
          FirstIndexed: z.string(),
          Price: z.number(),
        }),
      ),
      Type: z.number(),
      Spend: z.number(),
    }),
  ),
});
/** Response from the Product API — e-commerce product search results. */
export type ProductResponse = z.infer<typeof ProductResponseSchema>;

// ─── Client Interface ────────────────────────────────────────────────────────

/**
 * The BuiltWith API client. Created via `createClient()`.
 *
 * All methods return validated, typed responses when using JSON format,
 * or raw strings for XML/TXT/CSV/TSV formats.
 *
 * @example
 * ```ts
 * import { createClient } from "builtwith-api";
 *
 * const client = createClient(process.env.BUILTWITH_API_KEY!);
 * const profile = await client.free("example.com");
 * ```
 */
export interface BuiltWithClient {
  /** Free lookup — basic technology profile for a single domain. */
  free(lookup: string): Promise<FreeResponse | string>;
  /**
   * Detailed technology profile for one or more domains.
   * @param lookup - Single domain or array of up to 16 domains.
   * @param params - Optional filters (hide fields, date ranges, etc.).
   */
  domain(lookup: string | string[], params?: DomainParams): Promise<DomainResponse | string>;
  /**
   * List domains using a specific technology.
   * @param technology - Technology name (e.g. "Shopify", "React").
   * @param params - Optional pagination and filtering.
   */
  lists(technology: string, params?: ListsParams): Promise<ListsResponse | string>;
  /**
   * Find related domains via shared identifiers (analytics IDs, ad accounts, etc.).
   * @param lookup - Single domain or array of up to 16 domains.
   */
  relationships(lookup: string | string[]): Promise<RelationshipsResponse | string>;
  /**
   * Get SEO keywords associated with one or more domains.
   * @param lookup - Single domain or array of up to 16 domains.
   */
  keywords(lookup: string | string[]): Promise<KeywordsResponse | string>;
  /**
   * Technology adoption trends and coverage data.
   * @param technology - Technology name to look up.
   * @param params - Optional date filter.
   */
  trends(technology: string, params?: TrendsParams): Promise<TrendsResponse | string>;
  /**
   * Find domains associated with a company name.
   * @param companyName - Company name to search.
   * @param params - Optional TLD filter and result count.
   */
  companyToUrl(companyName: string, params?: CompanyToUrlParams): Promise<CompanyToUrlResponse | string>;
  /** Live technology lookup — scans the domain in real time. */
  domainLive(lookup: string): Promise<DomainResponse | string>;
  /**
   * Trust and verification score for a domain.
   * @param lookup - Domain to look up.
   * @param params - Optional keywords and live analysis toggle.
   */
  trust(lookup: string, params?: TrustParams): Promise<TrustResponse | string>;
  /** Get tracking and analytics tags found on a domain. */
  tags(lookup: string): Promise<TagsResponse | string>;
  /** Get technology recommendations for a domain. */
  recommendations(lookup: string): Promise<RecommendationsResponse | string>;
  /** Get inbound and outbound redirect chains for a domain. */
  redirects(lookup: string): Promise<RedirectsResponse | string>;
  /** Search for products across e-commerce sites. */
  product(query: string): Promise<ProductResponse | string>;
}

// ─── Utility Types ───────────────────────────────────────────────────────────

/** @internal Maps JS param names to BuiltWith API query string keys. */
export type BooleanMapping = Record<string, string>;
/** @internal URL query parameters — `undefined` values are omitted. */
export type QueryParams = Record<string, string | number | undefined>;
