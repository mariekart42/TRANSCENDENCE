import {Injectable } from "@nestjs/common";
import {PrismaClient} from "@prisma/client";

// Prisma Client comes from nestjs not from me lol

@Injectable() // This decorator is used to make the PrismaService class injectable
export class PrismaService extends PrismaClient {
    constructor() {
        super({ // super() calls constructor for PrismaClient, which needs these fields:
            datasources: {
                db: {
                    url: 'postgresql://postgres:6969@localhost:5434/nest?schema=public'
                }
            }
        });
    }
}