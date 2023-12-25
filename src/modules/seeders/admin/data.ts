import {IAdmin} from "../../../database/interfaces/IAdmin.interface";

export const adminDataSeeds: IAdmin[] = [
    {
        username: 'nhatnt',
        password: 'Nhat@nt123',
        email: 'nhat.bka.64@gmail.com',
        fullName: 'nhatnt',
        isActive: 1,
        type: 1, // super admin
    }
]