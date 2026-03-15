import { z } from "zod/v4";

// ─── Input Schemas ───────────────────────────────────────────────────────────

export const ResponseFormatSchema = z.enum(["xml", "json", "txt", "csv", "tsv"]);
export type ResponseFormat = z.infer<typeof ResponseFormatSchema>;

export const ClientOptionsSchema = z.strictObject({
  responseFormat: ResponseFormatSchema.optional(),
});
export type ClientOptions = z.infer<typeof ClientOptionsSchema>;

export const DomainParamsSchema = z.strictObject({
  hideAll: z.boolean().optional(),
  hideDescriptionAndLinks: z.boolean().optional(),
  onlyLiveTechnologies: z.boolean().optional(),
  noMetaData: z.boolean().optional(),
  noAttributeData: z.boolean().optional(),
  noPII: z.boolean().optional(),
  firstDetectedRange: z.string().optional(),
  lastDetectedRange: z.string().optional(),
});
export type DomainParams = z.infer<typeof DomainParamsSchema>;

export const ListsParamsSchema = z.strictObject({
  includeMetaData: z.boolean().optional(),
  offset: z.string().optional(),
  since: z.string().optional(),
});
export type ListsParams = z.infer<typeof ListsParamsSchema>;

export const TrendsParamsSchema = z.strictObject({
  date: z.string().optional(),
});
export type TrendsParams = z.infer<typeof TrendsParamsSchema>;

export const CompanyToUrlParamsSchema = z.strictObject({
  tld: z.string().optional(),
  amount: z.number().optional(),
});
export type CompanyToUrlParams = z.infer<typeof CompanyToUrlParamsSchema>;

export const TrustParamsSchema = z.strictObject({
  words: z.string().optional(),
  live: z.boolean().optional(),
});
export type TrustParams = z.infer<typeof TrustParamsSchema>;

export const SingleLookupSchema = z.string().min(1);
export const MultiLookupSchema = z.union([z.string().min(1), z.array(z.string().min(1)).min(1).max(16)]);

// ─── Response Schemas ────────────────────────────────────────────────────────
// Use z.object() (loose/passthrough) to tolerate extra fields from the API

export const FreeResponseSchema = z.object({
  domain: z.string(),
  first: z.number(),
  last: z.number(),
  groups: z.array(
    z.object({
      name: z.string(),
      live: z.number(),
      dead: z.number(),
      latest: z.number(),
      oldest: z.number(),
      categories: z.array(
        z.object({
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
export type FreeResponse = z.infer<typeof FreeResponseSchema>;

const TechnologySchema = z.object({
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

const PathSchema = z.object({
  Technologies: z.array(TechnologySchema),
  FirstIndexed: z.number(),
  LastIndexed: z.number(),
  Domain: z.string(),
  Url: z.string(),
  SubDomain: z.string(),
});

const MetaSchema = z.object({
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
    z.object({
      Name: z.string(),
      Type: z.number(),
      Level: z.string(),
      Email: z.string(),
    }),
  ),
  ARank: z.number(),
  QRank: z.number(),
});

const AttributesSchema = z.object({
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

export const DomainResponseSchema = z.object({
  Results: z.array(
    z.object({
      Result: z.object({
        SpendHistory: z.array(
          z.object({
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
export type DomainResponse = z.infer<typeof DomainResponseSchema>;

export const ListsResponseSchema = z.object({
  NextOffset: z.string(),
  Results: z.array(
    z.object({
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
export type ListsResponse = z.infer<typeof ListsResponseSchema>;

export const RelationshipsResponseSchema = z.object({
  Relationships: z.array(
    z.object({
      Domain: z.string(),
      Identifiers: z.array(
        z.object({
          Value: z.string(),
          Type: z.string(),
          First: z.number(),
          Last: z.number(),
          Matches: z.array(
            z.object({
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
export type RelationshipsResponse = z.infer<typeof RelationshipsResponseSchema>;

export const KeywordsResponseSchema = z.object({
  Keywords: z.array(
    z.object({
      Domain: z.string(),
      Keywords: z.array(z.string()),
    }),
  ),
});
export type KeywordsResponse = z.infer<typeof KeywordsResponseSchema>;

export const TrendsResponseSchema = z.object({
  Tech: z.object({
    icon: z.string(),
    categories: z.array(z.string()),
    tag: z.string(),
    is_premium: z.string(),
    name: z.string(),
    description: z.string(),
    link: z.string(),
    trends_link: z.string(),
    coverage: z.object({
      ten_k: z.number(),
      hundred_k: z.number(),
      milly: z.number(),
      live: z.number(),
      expired: z.number(),
    }),
  }),
});
export type TrendsResponse = z.infer<typeof TrendsResponseSchema>;

export const CompanyToUrlResponseSchema = z.array(
  z.object({
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
export type CompanyToUrlResponse = z.infer<typeof CompanyToUrlResponseSchema>;

export const TrustResponseSchema = z.object({
  Domain: z.string(),
  DBRecord: z.object({
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
export type TrustResponse = z.infer<typeof TrustResponseSchema>;

export const TagsResponseSchema = z.array(
  z.object({
    Value: z.string(),
    Matches: z.array(
      z.object({
        Domain: z.string(),
        First: z.string(),
        Last: z.string(),
      }),
    ),
  }),
);
export type TagsResponse = z.infer<typeof TagsResponseSchema>;

export const RecommendationsResponseSchema = z.array(
  z.object({
    Domain: z.string(),
    Compiled: z.string(),
    Recommendations: z.array(
      z.object({
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
export type RecommendationsResponse = z.infer<typeof RecommendationsResponseSchema>;

export const RedirectsResponseSchema = z.object({
  Lookup: z.string(),
  Inbound: z.array(
    z.object({
      Domain: z.string(),
      FirstDetected: z.string(),
      LastDetected: z.string(),
    }),
  ),
  Outbound: z.array(
    z.object({
      Domain: z.string(),
      FirstDetected: z.string(),
      LastDetected: z.string(),
    }),
  ),
});
export type RedirectsResponse = z.infer<typeof RedirectsResponseSchema>;

export const ProductResponseSchema = z.object({
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
    z.object({
      Domain: z.string(),
      Products: z.array(
        z.object({
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
export type ProductResponse = z.infer<typeof ProductResponseSchema>;

// ─── Client Interface ────────────────────────────────────────────────────────

export interface BuiltWithClient {
  free(lookup: string): Promise<FreeResponse | string>;
  domain(lookup: string | string[], params?: DomainParams): Promise<DomainResponse | string>;
  lists(technology: string, params?: ListsParams): Promise<ListsResponse | string>;
  relationships(lookup: string | string[]): Promise<RelationshipsResponse | string>;
  keywords(lookup: string | string[]): Promise<KeywordsResponse | string>;
  trends(technology: string, params?: TrendsParams): Promise<TrendsResponse | string>;
  companyToUrl(companyName: string, params?: CompanyToUrlParams): Promise<CompanyToUrlResponse | string>;
  domainLive(lookup: string): Promise<DomainResponse | string>;
  trust(lookup: string, params?: TrustParams): Promise<TrustResponse | string>;
  tags(lookup: string): Promise<TagsResponse | string>;
  recommendations(lookup: string): Promise<RecommendationsResponse | string>;
  redirects(lookup: string): Promise<RedirectsResponse | string>;
  product(query: string): Promise<ProductResponse | string>;
}

// ─── Utility Types ───────────────────────────────────────────────────────────

export type BooleanMapping = Record<string, string>;
export type QueryParams = Record<string, string | number | undefined>;
