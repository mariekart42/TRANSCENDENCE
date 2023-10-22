import {Body, Controller, Post} from "@nestjs/common"
import { AuthService } from "./auth.service";
import {AuthDto} from "./dto";


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    // THIS is bad practice cause we relay on Express (not valid for different ones like fastify)
    // signup(@Req() req: Request) { // Request comes from Express and has a lot of properties
    //     console.log(req.url); // specify here a property to print it out in the terminal
    //     console.log(req.body);

    @Post('signup')
    signup(@Body() dto: AuthDto ) {
        console.log({
            dto,
        })
        return this.authService.signup(dto);
    }
    @Post('signin')
    signin() {
        return this.authService.signin();
    }


}