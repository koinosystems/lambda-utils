"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useacase = exports.presentation = exports.logger = exports.ses = exports.sns = exports.rds = exports.dynamodb = exports.cloudsearch = exports.authentication = void 0;
/* AUTHENTICATION */
exports.authentication = __importStar(require("./authentication"));
/* DATA-SOURCE CLOUDSEARCH */
exports.cloudsearch = __importStar(require("./data-source/cloudsearch"));
/* DATA-SOURCE DYNAMODB */
exports.dynamodb = __importStar(require("./data-source/dynamodb"));
/* DATA-SOURCE RDS */
exports.rds = __importStar(require("./data-source/rds"));
/* MESSAGE SNS */
exports.sns = __importStar(require("./message/sns"));
/* MESSAGE SES */
exports.ses = __importStar(require("./message/ses"));
/* LOGGER */
exports.logger = __importStar(require("./logger"));
/* PRESENTATION */
exports.presentation = __importStar(require("./presentation"));
// /* USECASES */
exports.useacase = __importStar(require("./use-cases"));
//# sourceMappingURL=index.js.map