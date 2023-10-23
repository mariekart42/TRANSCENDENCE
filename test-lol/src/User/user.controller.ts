import {Controller, Get, Post} from "@nestjs/common";

@Controller('users')
export class UserController {

    @Get('me')
    getMe() {
        return 'user Info lol';
    }
}