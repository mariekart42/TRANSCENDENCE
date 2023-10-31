import {ValidationPipe} from "@nestjs/common";
import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // app.useGlobalPipes(new ValidationPipe({
    //     whitelist: true // will only parse the fields initted from us, no extra values that are not in our dto
    // })) // makes us use Pipe globally
    await app.listen(3000);
}
bootstrap();