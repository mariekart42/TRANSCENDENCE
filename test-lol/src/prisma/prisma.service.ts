import {Injectable } from "@nestjs/common";
import {PrismaClient} from "@prisma/client";
import {ConfigService} from "@nestjs/config";

// Prisma Client comes from nestjs not from me lol

@Injectable() // This decorator is used to make the PrismaService class injectable
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService) {
        super({ // super() calls constructor for PrismaClient, which needs these fields:
            datasources: {
                db: {
                    url: config.get('DATABASE_URL'),
                },
            },
        });
    }
}