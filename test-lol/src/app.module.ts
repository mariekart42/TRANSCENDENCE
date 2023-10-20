import { Module } from '@nestjs/common';
import {BookmarkModule} from "./bookmark/bookmark.module";
import {UserModule} from "./User/User.module";
import {AuthModule} from "./auth/auth.module";
import {PrismaModule} from "./prisma/prisma.module";

@Module({
  imports: [BookmarkModule, UserModule, AuthModule, PrismaModule],
})
export class AppModule {}
