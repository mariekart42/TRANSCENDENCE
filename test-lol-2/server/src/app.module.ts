import {Module} from "@nestjs/common";
import {IndexModule} from "./index/index.module";
import {NotYetModule} from "./notYet/notYet.module";
import {PrismaModule} from "./prisma/prisma.module";
import {ConfigModule} from "@nestjs/config";
import {PollsModule} from "./polls/polls.module";

@Module({
    imports: [
        ConfigModule.forRoot({  // loads .env file into our application
            isGlobal: true, // makes ConfigModule available through the whole program
        }),
        IndexModule,
        NotYetModule,
        PrismaModule,
        PollsModule],
 })
export class AppModule {}