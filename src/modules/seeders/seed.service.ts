import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Admin} from "../../database/entities";
import {Repository} from "typeorm";
import {IAdmin} from "../../database/interfaces/IAdmin.interface";
import * as argon2 from "argon2";

@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(Admin)
        private adminRepository: Repository<Admin>,
    ) {
    }

    async createOne(admin: IAdmin): Promise<any> {
        const hashedPassword = await argon2.hash(admin.password);

        admin = {...admin, password: hashedPassword};
        return this.adminRepository.save(admin);
    }
}