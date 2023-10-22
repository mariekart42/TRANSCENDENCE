import {ForbiddenException, Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
// stuff imported from prisma -> postgres Database
import {AuthDto} from "./dto";
import * as argon from 'argon2'
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";

@Injectable()
export class AuthService{
    constructor(private prisma: PrismaService) {
    }
    async signup(dto: AuthDto) {
        // generate hash:
        const hash = await argon.hash(dto.password)
        try
        {
            // safe new user to database:
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash: hash,
                },
            });

            // we delete it so it doesn't get send back to the user (he should not be able to see the hash password)
            delete user.hash;

            // return saved user
            return user;
        }
        catch (error)
        {
            if (error instanceof PrismaClientKnownRequestError)
            { // error for if unique duplicate case (email)
                if (error.code === 'P2002')
                { // code for duplicating unique field in Prisma
                    throw new ForbiddenException('EMail already taken');
                }
            }
            throw error; // if something else went wrong
        }
    }
    signin() {
        return 'lol SIGNIN';
    }
}