import {Controller, Get, Param, Res} from "@nestjs/common";
import {Response} from 'express'; // for setHeader/send

@Controller('user/(*)')
export class UserController {

    @Get(':id')
    getName(@Res() res: Response, @Param('id') name : string) {
        console.log('lol I am in User Controller');

        res.setHeader('Content-Type', 'text/html');
        res.send('Hi, my name is ' + name);
    }
}