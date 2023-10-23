import { Module } from '@nestjs/common';
import {BookmarkModule} from "./bookmark/bookmark.module";
import {UserModule} from "./User/User.module";
import {AuthModule} from "./auth/auth.module";
import {PrismaModule} from "./prisma/prisma.module";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
      ConfigModule.forRoot({  // loads .env file into our application
          isGlobal: true, // makes ConfigModule available through the whole program
      }),
      BookmarkModule,
      UserModule,
      AuthModule,
      PrismaModule],
})
export class AppModule {}
