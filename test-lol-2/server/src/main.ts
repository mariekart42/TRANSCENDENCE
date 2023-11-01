import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get('PORT');
    const clientPort = configService.get('CLIENT_PORT'); // both defined in .env

    console.log('PORT: ' + port);
    console.log('CLIENT_PORT: ' + clientPort);

    // app.useGlobalPipes(new ValidationPipe({
    //     whitelist: true // will only parse the fields initted from us, no extra values that are not in our dto
    // })) // makes us use Pipe globally
    await app.listen(3000);
}
bootstrap();