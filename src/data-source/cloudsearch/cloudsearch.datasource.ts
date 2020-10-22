import { AWSError, config } from 'aws-sdk';
import CloudSearchDomain from 'aws-sdk/clients/cloudsearchdomain';

const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env;

config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

export abstract class CloudsearchDataSource {
  public cloudSearchDomain: CloudSearchDomain;

  constructor(domain: string) {
    this.cloudSearchDomain = new CloudSearchDomain({
      endpoint: domain,
      apiVersion: '2013-01-01',
    });
  }

  public async search(
    params: CloudSearchDomain.SearchRequest
  ): Promise<CloudSearchDomain.SearchResponse> {
    return new Promise((resolve, reject) => {
      this.cloudSearchDomain.search(
        params,
        (err: AWSError, data: CloudSearchDomain.SearchResponse) => {
          if (err) {
            reject(err);
          }
          return resolve(data);
        }
      );
    });
  }

  public and(...args: string[]): string {
    return '(and' + args.join(' ') + ')';
  }

  public or(...args: string[]): string {
    return '(or' + args.join(' ') + ')';
  }

  public prefix(term: string): string {
    return `(prefix '${term}')`;
  }

  public range(field: string, min: number, max: number): string {
    if (!max) {
      return `(range field=${field} [${min},})`;
    }
    return `(range field=${field} [${min},${max}])`;
  }

  public rangeDate(field: string, min: number | string, max: number | string): string {
    if (min && max) {
      return `(range field=${field} ['${min}','${max}'])`;
    }
    if (min) {
      return `(range field=${field} ['${min}',})`;
    }
    if (max) {
      return `(range field=${field} {,'${max}'])`;
    }
    return '';
  }

  public rangePrice(field: string, min: number | string, max: number | string): string {
    if (min != null && max != null && min !== undefined && max !== undefined) {
      return `(range field=${field} ['${min}','${max}'])`;
    }
    if (min) {
      return `(range field=${field} ['${min}',})`;
    }
    if (max) {
      return `(range field=${field} {,'${max}'])`;
    }
    return '';
  }

  public rangeDate2(field: string, min: string | undefined, max: string | undefined): string {
    if (min && max) {
      return `(range field=${field} ['${min}','${max}'])`;
    }
    if (min) {
      return `(range field=${field} ['${min}',})`;
    }
    if (max) {
      return `(range field=${field} {,'${max}'])`;
    }
    return '';
  }

  public term(term: string, field?: string, boost?: number): string {
    let options = '';
    if (field) options += `field=${field} `;
    if (boost) options += `boost=${boost} `;
    return `(term ${options}'${term}')`;
  }

  public phrase(phrase: string, field?: string, boost?: number): string {
    let options = '';
    if (field) options += `field=${field} `;
    if (boost) options += `boost=${boost} `;
    return `(phrase ${options}'${phrase}')`;
  }
}
