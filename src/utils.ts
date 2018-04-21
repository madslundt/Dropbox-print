import * as fs from 'fs';
import { IConfig } from './interfaces/config';

const loadConfig = async (args: {[key: string]: string}) => {
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

    let result: IConfig;
    try {
        result = JSON.parse(fileContent);
    } catch (exception) {
        console.log(exception.toString());
        console.log('\nConfig is not valid');
        process.exit(1);

        return null;
    }

    return result;
}

const wait = (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export {
    loadConfig,
    wait
}