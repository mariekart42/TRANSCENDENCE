import {Global, Module} from "@nestjs/common";
import {PrismaService} from "./prisma.service";
import {ConfigService} from "@nestjs/config";

@Global() // dis allows to access prismaService from everywhere without exporting it to each Module
// make sure PrismaModule is imported in root module (app.module)
@Module({
    providers: [PrismaService],
    exports: [PrismaService], // need to also export it to make it accessible to other modules
})
export class PrismaModule {}
