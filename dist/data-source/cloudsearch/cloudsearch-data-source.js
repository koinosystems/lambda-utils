"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudsearchDataSource = void 0;
const aws_sdk_1 = require("aws-sdk");
const cloudsearchdomain_1 = __importDefault(require("aws-sdk/clients/cloudsearchdomain"));
const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = process.env;
aws_sdk_1.config.update({
    region: AWS_REGION,
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
});
class CloudsearchDataSource {
    constructor(domain) {
        this.cloudSearchDomain = new cloudsearchdomain_1.default({
            endpoint: domain,
            apiVersion: '2013-01-01'
        });
    }
    async search(params) {
        return new Promise((resolve, reject) => {
            this.cloudSearchDomain.search(params, (err, data) => {
                if (err) {
                    reject(err);
                }
                return resolve(data);
            });
        });
    }
    and(...args) {
        return '(and' + args.join(' ') + ')';
    }
    or(...args) {
        return '(or' + args.join(' ') + ')';
    }
    prefix(term) {
        return `(prefix '${term}')`;
    }
    range(field, min, max) {
        if (!max) {
            return `(range field=${field} [${min},})`;
        }
        return `(range field=${field} [${min},${max}])`;
    }
    rangeDate(field, min, max) {
        if (min && max) {
            return `(range field=${field} ['${min}','${max}'])`;
        }
        else if (min) {
            return `(range field=${field} ['${min}',})`;
        }
        else if (max) {
            return `(range field=${field} {,'${max}'])`;
        }
        else {
            return '';
        }
    }
    rangePrice(field, min, max) {
        if (min != null && max != null && min !== undefined && max !== undefined) {
            return `(range field=${field} ['${min}','${max}'])`;
        }
        else if (min) {
            return `(range field=${field} ['${min}',})`;
        }
        else if (max) {
            return `(range field=${field} {,'${max}'])`;
        }
        else {
            return '';
        }
    }
    rangeDate2(field, min, max) {
        if (min && max) {
            return `(range field=${field} ['${min}','${max}'])`;
        }
        else if (min) {
            return `(range field=${field} ['${min}',})`;
        }
        else if (max) {
            return `(range field=${field} {,'${max}'])`;
        }
        else {
            return '';
        }
    }
    term(term, field, boost) {
        let options = '';
        if (field)
            options += `field=${field} `;
        if (boost)
            options += `boost=${boost} `;
        return `(term ${options}'${term}')`;
    }
    phrase(phrase, field, boost) {
        let options = '';
        if (field)
            options += `field=${field} `;
        if (boost)
            options += `boost=${boost} `;
        return `(phrase ${options}'${phrase}')`;
    }
}
exports.CloudsearchDataSource = CloudsearchDataSource;
//# sourceMappingURL=cloudsearch-data-source.js.map