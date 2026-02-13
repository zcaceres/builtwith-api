export type ResponseFormat = "xml" | "json" | "txt" | "csv" | "tsv";

export interface ClientOptions {
  responseFormat?: ResponseFormat;
}

export interface DomainParams {
  hideAll?: boolean;
  hideDescriptionAndLinks?: boolean;
  onlyLiveTechnologies?: boolean;
  noMetaData?: boolean;
  noAttributeData?: boolean;
  noPII?: boolean;
  firstDetectedRange?: string;
  lastDetectedRange?: string;
}

export interface ListsParams {
  includeMetaData?: boolean;
  offset?: string;
  since?: string;
}

export interface TrendsParams {
  date?: string;
}

export interface CompanyToUrlParams {
  tld?: string;
  amount?: number;
}

export interface TrustParams {
  words?: string;
  live?: boolean;
}

export interface BuiltWithClient {
  free(lookup: string): Promise<unknown>;
  domain(lookup: string | string[], params?: DomainParams): Promise<unknown>;
  lists(technology: string, params?: ListsParams): Promise<unknown>;
  relationships(lookup: string | string[]): Promise<unknown>;
  keywords(lookup: string | string[]): Promise<unknown>;
  trends(technology: string, params?: TrendsParams): Promise<unknown>;
  companyToUrl(companyName: string, params?: CompanyToUrlParams): Promise<unknown>;
  domainLive(lookup: string): Promise<unknown>;
  trust(lookup: string, params?: TrustParams): Promise<unknown>;
  tags(lookup: string): Promise<unknown>;
  recommendations(lookup: string): Promise<unknown>;
  redirects(lookup: string): Promise<unknown>;
  product(query: string): Promise<unknown>;
}

export type BooleanMapping = Record<string, string>;

export type QueryParams = Record<string, string | number | undefined>;
