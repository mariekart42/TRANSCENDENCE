import {Controller, Get, Res, Post, UploadedFile, UseInterceptors, Param} from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MulterFile } from 'multer';
import {BookmarkModule} from "../bookmark/bookmark.module";
import {UserModule} from "../User/user.module";
import {UserController} from "../User/user.controller";
import {PrismaModule} from "../prisma/prisma.module";
import {PrismaService} from "../prisma/prisma.service";
import * as path from "path";

@Controller('index')
export class IndexController {
constructor(private prisma: PrismaService) {
}

    @Get(':id')
    getUserById(@Param() params: any): string {
        const fileContent = fs.readFileSync('root/images/test.jpeg');
        console.log(params.id);
        return `<!DOCTYPE html>
                <html>
                <head>
                    <title>My Web Page</title>
                </head>
                <body>
                    <h1>ID: ${params.id}</h1>
                </body>
                </html>`;
    }
    //
    //
    //
    // @Get()
    // @Get('images/test.jpeg')
    // sendBackground(@Res() res: Response): void {
    //     const fileContent = fs.readFileSync('root/images/`test.jpeg`');
    //     res.setHeader('Content-Type', 'image/jpg');
    //     res.send(fileContent);
    // }
    // @Post('upload')
    // @UseInterceptors(FileInterceptor('file', {
    //     storage: diskStorage({
    //         destination: 'root/uploads', // Destination directory for uploaded files
    //         filename: (req, file, callback) => {
    //             const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    //             return callback(null, `${randomName}${extname(file.originalname)}`);
    //         },
    //     }),
    // }))
    // uploadFile(@UploadedFile() file: MulterFile) {
    //     // 'file' contains information about the uploaded file
    //     // You can save the file details or perform other operations here
    //     console.log(file);
    //
    //     return { message: 'File uploaded successfully' };
    // }
    //
    // @Get('styles/styles.css')
    // sendStyles(@Res() res: Response): void {
    //     const fileContent = fs.readFileSync('root/styles/styles.css');
    //     res.setHeader('Content-Type', 'text/css');
    //     res.send(fileContent);
    // }
    // @Get()
    // sendIndexPage(@Res() res: Response): void {
    //     const fileContent = fs.readFileSync('root/index.html');
    //     res.setHeader('Content-Type', 'text/html');
    //     res.send(fileContent);
    // }
    // @Get('404')
    // sendError404(@Res() res: Response): void {
    //
    //     const fileContent = fs.readFileSync('root/html/404.html', 'utf8');
    //
    //     // Set the Content-Type header to indicate that you are sending HTML
    //     res.setHeader('Content-Type', 'text/html');
    //
    //     // Send the HTML content as the response
    //     res.send(fileContent);
    // }
}