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
export const MultiLookupSchema = z.union([
  z.string().min(1),
  z.array(z.string().min(1)).min(1).max(16),
]);

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
      categories: z.array(z.string()),
    }),
  ),
});
export type FreeResponse = z.infer<typeof FreeResponseSchema>;

export const DomainResponseSchema = z.object({
  Results: z.array(
    z.object({
      Result: z.object({
        Paths: z.array(z.any()),
        IsDB: z.boolean(),
        Spend: z.number(),
      }),
      Meta: z.object({}).passthrough(),
      Attributes: z.object({}).passthrough(),
    }),
  ),
  Errors: z.array(z.any()),
});
export type DomainResponse = z.infer<typeof DomainResponseSchema>;

export const ListsResponseSchema = z.object({
  NextOffset: z.string(),
  Results: z.array(
    z.object({
      D: z.string(),
    }).passthrough(),
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
          Matches: z.array(z.any()),
        }),
      ),
    }),
  ),
  Errors: z.array(z.any()),
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
    name: z.string(),
    description: z.string(),
    link: z.string(),
    tag: z.string(),
  }).passthrough(),
});
export type TrendsResponse = z.infer<typeof TrendsResponseSchema>;

export const CompanyToUrlResponseSchema = z.array(
  z.object({
    Domain: z.string(),
  }).passthrough(),
);
export type CompanyToUrlResponse = z.infer<typeof CompanyToUrlResponseSchema>;

export const TrustResponseSchema = z.object({
  Domain: z.string(),
  DBRecord: z.object({}).passthrough(),
  Status: z.string(),
});
export type TrustResponse = z.infer<typeof TrustResponseSchema>;

export const TagsResponseSchema = z.array(
  z.object({
    Value: z.string(),
    Matches: z.array(
      z.object({
        Domain: z.string(),
        First: z.number(),
        Last: z.number(),
      }),
    ),
  }),
);
export type TagsResponse = z.infer<typeof TagsResponseSchema>;

export const RecommendationsResponseSchema = z.array(
  z.object({
    Domain: z.string(),
    Recommendations: z.array(
      z.object({
        name: z.string(),
        link: z.string(),
        tag: z.string(),
      }).passthrough(),
    ),
  }).passthrough(),
);
export type RecommendationsResponse = z.infer<typeof RecommendationsResponseSchema>;

export const RedirectsResponseSchema = z.object({
  Lookup: z.string(),
  Inbound: z.array(
    z.object({
      Domain: z.string(),
      FirstDetected: z.number(),
      LastDetected: z.number(),
    }),
  ),
  Outbound: z.array(
    z.object({
      Domain: z.string(),
      FirstDetected: z.number(),
      LastDetected: z.number(),
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
  shops: z.array(
    z.object({
      Domain: z.string(),
    }).passthrough(),
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
