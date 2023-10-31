import {Controller, Get, Param, Res} from "@nestjs/common";
import * as fs from "fs";
import {Response} from 'express'; // for setHeader/send
import * as path from 'path';

@Controller('images')
export class IndexController {
    @Get(':path')
    getLol(@Res() res: Response, @Param('path') url: string) {


        console.log('In IndexController getLol');
        console.log(url);

        const filePath = 'root/images/' + url;

        // Check if the path points to a directory
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
            const errorContent = fs.readFileSync('root/error/isADirectory.html');
            res.setHeader('Content-Type', 'text/html');
            res.status(200).send(errorContent);
            return;
        }
        else
        {
            // Check if the file exists
            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath);
                res.setHeader('Content-Type', 'image/jpg');
                res.send(fileContent);
                return;
            }
            else
            {
                // Handle non-existent file, for example, respond with a 404 error page
                const errorContent = fs.readFileSync('root/error/404.html');
                res.setHeader('Content-Type', 'text/html');
                res.status(404).send(errorContent);
                return;
            }
        }

    }

    @Get()
    elseResponse1(@Res() res: Response, @Param('path') url: string) {
        console.log('In IndexController elseResponse1');


        const filePath = 'root/images/' + url;

        // Check if the path points to a directory
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
            const errorContent = fs.readFileSync('root/error/isADirectory.html');
            res.setHeader('Content-Type', 'text/html');
            res.status(200).send(errorContent);
            return;
        }
        else
        {
            // Check if the file exists
            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath);
                res.setHeader('Content-Type', 'image/jpg');
                res.send(fileContent);
                return;
            }
            else
            {
                // Handle non-existent file, for example, respond with a 404 error page
                const errorContent = fs.readFileSync('root/error/404.html');
                res.setHeader('Content-Type', 'text/html');
                res.status(404).send(errorContent);
                return;
            }
        }








    }
}