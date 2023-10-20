import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
// stuff imported from prisma -> postgres Database

@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService) {
    }
    signup() {
        return 'lol SIGNUP';
    }
    signin() {
        return 'lol SIGNIN';
    }
}