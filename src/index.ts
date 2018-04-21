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

        const process = args['_'] && args['_'].length > 0 ? args['_'][0].toLowerCase() : null;

        do {
            if (process === 'mail') {
                await app.processEmails();
            } else {
                await app.processDropbox();
            }
            await wait(5000);
        } while (true);
    }
})();