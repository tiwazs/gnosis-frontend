import { User } from "@prisma/client";
import { Encryptor } from "../lib/encryptor";
import prisma from "../lib/prisma";
import crypto from 'crypto';


export interface UserDataModel {
    username: string;
    email: string;
    password: string;
    firstName: string | null | undefined;
    lastName: string | null | undefined;
    mainPhoto: string | null | undefined;
}


export default class userService {
    static async create(user: UserDataModel): Promise<User> {
        const { username, email, password, firstName, lastName, mainPhoto } = user;
        const userCreated = await prisma.user.create({
            data: {
                ...user
            }
        });
        return userCreated;
    }

    static async findAll(): Promise<User[]> {
        const users = await prisma.user.findMany();
        return users;
    }

    static async findById(id: string): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: {
                id
            }
        });
        return user;
    }

    static async genertateApiKey(id: string): Promise<User | null> {
        const user = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                apiKey: crypto.randomUUID()
            }
        });

        return user;
    }

    static async getByApiKey(apiKey: string): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: {
                apiKey: apiKey
            }
        });

        return user;
    }

    static async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: {
                email
            }
        });
        return user;
    }

    static async findByUsername(username: string): Promise<User | null> {
        const user = await prisma.user.findFirst({
            where: {
                name: username
            }
        });
        return user;
    }

    static async update(id: string, user: Partial<UserDataModel>): Promise<User | null> {
        const { password, ...rest } = user as Partial<UserDataModel> & { name?: string; image?: string };
        const data: Record<string, unknown> = { ...rest };
        if (password) {
            if (password.length < 8) {
                throw new Error("Password must be at least 8 characters long.");
            }
            data.password = await Encryptor.encryptPassword(password);
        }

        const userUpdated = await prisma.user.update({
            where: {
                id
            },
            data
        });
        return userUpdated;
    }

    static async delete(id: string): Promise<User | null> {
        const userDeleted = await prisma.user.delete({
            where: {
                id
            }
        });
        return userDeleted;
    }
}