import {getLogger} from '../../shared/logger';

const fs = require('fs')
const logger = getLogger('NotificationWorkerService');

export class NotificationWorkerService {

    constructor(
    ) {
        this._setup();
    }

    async delay(t) {
        return new Promise(resolve => setTimeout(resolve, t));
    }

    async _setup() {
        do {
            try {
                await this.crawlData();
                await this.delay(1 * 60 * 1000);// 1 minutes

            } catch (e) {
                logger.error(`NotificationWorkerService::doCrawlJob ${e.message}`);
            }
        } while (true);
    }

    async crawlData() {
        logger.info('NotificationWorkerService::crawlData start get Notification');
    }

}
