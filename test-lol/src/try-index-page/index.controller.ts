import {Controller, Get, Res, Param} from "@nestjs/common";
import {Response} from 'express';
import {PrismaService} from "../prisma/prisma.service";
import * as fs from 'fs';
import * as path from 'path';



@Controller('scripts')
export class ScriptController {

    constructor(private prisma: PrismaService) {
    }

    @Get(':id(*)')
    getScript(@Res() res: Response, @Param() params: any) {
        console.log('In Script Controller');

        const filePath = 'root/' + params.id;
        // check if file exists:
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                const fileContent = fs.readFileSync('root/html/404.html');
                res.setHeader('Content-Type', 'text/html');
                res.send(fileContent)
            }
            else
            {
                // file does exist
                const fileContent = fs.readFileSync(filePath);
                res.setHeader('Content-Type', 'text/javascript');
                res.send(fileContent);
            }
        });
    }
}

@Controller() // Controller for root
export class IndexController {
    constructor(private prisma: PrismaService) {
        console.log('In constructor of root Controller');
}


    @Get(':id(*)') // (*) allows urls with multiple slashes :))
    getUserById(@Param('id') id: string, @Res() res: Response): void {

        console.log('In root Controller');
        const filePath = path.join('root', id);


        // Check if the path points to a directory
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
            // Handle directory access, for example, respond with an error page
            // const errorContent = fs.readFileSync('root/html/404.html');
            res.setHeader('Content-Type', 'text/html');
            res.status(404).send('File is a Directory');
        }
        else
        {
            // Check if the file exists
            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath);
                res.setHeader('Content-Type', 'text/html');
                res.send(fileContent);
            }
            else
            {
                // Handle non-existent file, for example, respond with a 404 error page
                const errorContent = fs.readFileSync('root/html/404.html');
                res.setHeader('Content-Type', 'text/html');
                res.status(404).send(errorContent);
            }
        }


        // // check if file exists:
        // fs.access(filePath, fs.constants.F_OK, (err) => {
        //     if (err) {
        //         const fileContent = fs.readFileSync('root/html/404.html');
        //         res.setHeader('Content-Type', 'text/html');
        //         res.send(fileContent)
        //     }
        //     else
        //     {   // file exists
        //         const fileContent = fs.readFileSync(filePath);
        //         res.setHeader('Content-Type', 'text/html');
        //         res.send(fileContent);
        //     }
        // });
    }


    requestedRoot(@Res() res: Response): void {
        console.log('Requested Root');
        const fileContent = fs.readFileSync('root/html/404.html');
        res.setHeader('Content-Type', 'text/html');
        res.send(fileContent)
        // const fileContent = fs.readFileSync('root/html/home/example-website.html');
        // res.setHeader('Content-Type', 'text/html');
        // res.send(fileContent);
    }



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
    //     console.log('In empty Get');
    //
    //     const fileContent = fs.readFileSync('root/html/home/example-website.html');
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

