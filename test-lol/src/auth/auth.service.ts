import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
// stuff imported from prisma -> postgres Database
import {AuthDto} from "./dto";
import * as argon from 'argon2'

@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService) {
    }
    async signup(dto: AuthDto) {
        // generate hash:
        const hash = await argon.hash(dto.password)

        // safe new user to database:
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash: hash,
            },
        });

        // return saved user
        return user;
    }
    signin() {
        return 'lol SIGNIN';
    }
}