import {Injectable, Logger} from "@nestjs/common";
import {adminDataSeeds} from "./admin/data";
import {SeedService} from "./seed.service";

@Injectable()
export class Seeder {
    constructor(
        private readonly logger: Logger,
        private readonly seedService: SeedService,
    ) {
    }

    async seed(entity: string) {
        try {
            if (entity == 'admin') {
                this.logger.debug('Start seeding admin!');
                await this.admin();
            } else if (process.env.ENTITY == 'all') {
                this.logger.debug('Start seeding all seeders!');
                try {
                    await this.admin();
                } catch (error) {
                    this.logger.error('Failed seeding admin with error: ', error.message);
                }
            } else {
                throw Error('Cannot find any entities!!!');
            }
        } catch (error) {
            this.logger.error('Failed seeding with error: ', error.message);
        }
    }

    async admin() {
        for (let i = 0; i < adminDataSeeds.length; i++) {
            await this.seedService.createOne(adminDataSeeds[i]);
        }
        return true;
    }
}