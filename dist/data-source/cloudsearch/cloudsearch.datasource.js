"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
});
class CloudsearchDataSource {
    constructor(domain) {
        this.cloudSearchDomain = new cloudsearchdomain_1.default({
            endpoint: domain,
            apiVersion: '2013-01-01',
        });
    }
    search(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.cloudSearchDomain.search(params, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    return resolve(data);
                });
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
        if (min) {
            return `(range field=${field} ['${min}',})`;
        }
        if (max) {
            return `(range field=${field} {,'${max}'])`;
        }
        return '';
    }
    rangePrice(field, min, max) {
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
    rangeDate2(field, min, max) {
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
//# sourceMappingURL=cloudsearch.datasource.js.map