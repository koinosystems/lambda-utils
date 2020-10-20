import CloudSearchDomain from 'aws-sdk/clients/cloudsearchdomain';
export declare abstract class CloudsearchDataSource {
    cloudSearchDomain: CloudSearchDomain;
    constructor(domain: string);
    search(params: CloudSearchDomain.SearchRequest): Promise<CloudSearchDomain.SearchResponse>;
    and(...args: string[]): string;
    or(...args: string[]): string;
    prefix(term: string): string;
    range(field: string, min: number, max: number): string;
    rangeDate(field: string, min: number | string, max: number | string): string;
    rangePrice(field: string, min: number | string, max: number | string): string;
    rangeDate2(field: string, min: string | undefined, max: string | undefined): string;
    term(term: string, field?: string, boost?: number): string;
    phrase(phrase: string, field?: string, boost?: number): string;
}
