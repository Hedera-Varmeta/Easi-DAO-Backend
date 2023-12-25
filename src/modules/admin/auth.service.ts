import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {Admin} from "../../database/entities";
import {Repository} from "typeorm";
import * as argon2 from "argon2";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @InjectRepository(Admin)
        private adminRepository: Repository<Admin>,
    ) {
    }


    async getUserByEmailAndUsername(email: string, username: string) {
        return await this.adminRepository.findOne({
            where: {
                email: email,
                username: username
            }
        });
    }

    //login
    async validateAdmin(data: any): Promise<any> {
        const {username, email} = data;
        if (username) {
            return this.getUserByUsername(username);
        }
        if (email) {
            return this.getUserByEmail(email);
        }
        return null;
    }

    async getUserByUsername(username: string): Promise<Admin | undefined> {
        return this.adminRepository.findOne({
            where: {
                username: username
            }
        });
    }

    async getUserByEmail(email: string): Promise<Admin | undefined> {
        return this.adminRepository.findOne({
            where: {
                email: email
            }
        });
    }

    async login(user: any): Promise<any> {
        const payload = {username: user.username, userId: user.id};
        const token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRED,
        });

        return {
            email: user.email,
            type: user.type,
            token,
        };
    }

    async updatePassword(user: Admin, data: any) {
        if (!user || !user.username || !data) return false;

        let dataUser = await this.getUserByEmailAndUsername(
            user.email,
            user.username
        );
        if (!dataUser) return false;

        const isPassword = await argon2.verify(
            dataUser.password,
            data.oldPassword
        );

        if (!isPassword) return false;

        const hashedNewPassword = await argon2.hash(data.newPassword);

        dataUser.password = hashedNewPassword;
        dataUser = await this.adminRepository.save(dataUser);

        const {password, ...dataReturn} = dataUser;

        return dataReturn;
    }

    async logout(token: string) {
        const tokenWithoutBearer = token.split(" ")[1];
        //TODO: handle invalid schedule
    }

    async resetPassword(user: Admin, newPassword: string) {
        if (!user || !user.username || !newPassword) return false;

        let dataUser = await this.getUserByEmailAndUsername(
            user.email,
            user.username
        );
        if (!dataUser) return false;

        const hashedNewPassword = await argon2.hash(newPassword);

        dataUser.password = hashedNewPassword;
        dataUser = await this.adminRepository.save(dataUser);

        const {password, ...dataReturn} = dataUser;

        return dataReturn;
    }

    createNewRandomPassword(): string {
        const specialChars = '!@#$%^&*_+-=<>?/~`'
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
        const numericChars = '0123456789'

        let password = ''

        // Add at least one special character
        password += specialChars[Math.floor(Math.random() * specialChars.length)]

        // Add at least one uppercase letter
        password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]

        // Add at least one number
        password += numericChars[Math.floor(Math.random() * numericChars.length)]

        // Add the remaining characters randomly
        const remainingChars = specialChars + uppercaseChars + lowercaseChars + numericChars
        for (let i = 0; i < 5; i++) {
            password += remainingChars[Math.floor(Math.random() * remainingChars.length)]
        }

        // Shuffle the password so the special char, uppercase and number aren't at the beginning
        password = password.split('').sort(() => Math.random() - 0.5).join('')

        return password
    }
}