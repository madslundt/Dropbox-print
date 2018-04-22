import * as minimist from 'minimist';
import App from './app';
import { loadConfig, wait } from './utils';

(async function() {
    const args = minimist(process.argv.slice(2));
    const config = await loadConfig(args);

    if (!config) {
        process.exit(1);
    } else {
        const app = new App(config);

        console.log("Processing");
        do {
            await app.process();
            await wait(5000);
        } while (true);
    }
})();