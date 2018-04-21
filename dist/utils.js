"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const loadConfig = (args) => __awaiter(this, void 0, void 0, function* () {
    const configPath = args.config || args.c;
    if (!configPath) {
        console.log(`Config has not been specified`);
        process.exit(1);
    }
    const fileContent = fs.readFileSync(configPath, 'utf8');
    if (!fileContent) {
        console.log(`Can not file any config located at ${configPath}`);
        process.exit(1);
    }
    let result;
    try {
        result = JSON.parse(fileContent);
    }
    catch (exception) {
        console.log(exception.toString());
        console.log('\nConfig is not valid');
        process.exit(1);
        return null;
    }
    return result;
});
exports.loadConfig = loadConfig;
const wait = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
exports.wait = wait;
