import {ForbiddenException, Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
// stuff imported from prisma -> postgres Database
import {AuthDto} from "./dto";
import * as argon from 'argon2'
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {
    }


    // SIGNUP:
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
            // delete user.hash; // dont need this anymore cause we now specify what we return

            return this.signToken(user.id, user.email);
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


    async lol(lol: string) {
        return lol;
    }


    // SIGNIN:
    async signin(dto: AuthDto) {
        // find user by email:
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });
        if (!user) // if user is not in Prisma Databank
            throw new ForbiddenException('This EMail does not exist');

        // compare password:
        const passwordMath = await argon.verify(user.hash, dto.password);
        if (!passwordMath)
            throw new ForbiddenException('Password is wrong!');

        // deleting hash so user cant see it
        // delete user.hash;

        // if everything is fine we return the user
        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> // returning object of generated access token
    {
        const payload = {
            sub: userId,
            email,
        };
        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '30m',
            secret: secret
        });

        return {
            access_token: token,
        };
    }
}