import {Controller, Get, Res} from "@nestjs/common";
import {Response} from "express";
import * as fs from "fs";

@Controller('(*)') // here important to say (*) !!
export class NotYetController {
    @Get()
    notHandledYet(@Res() res: Response) {
        const fileContent = fs.readFileSync('root/error/notYet.html');
        res.setHeader('Content-Type', 'text/html');
        res.send(fileContent);
    }
}