import { Module } from '@nestjs/common';
import {BookmarkModule} from "./bookmark/bookmark.module";
import {UserModule} from "./User/User.module";
import {AuthModule} from "./auth/auth.module";

@Module({
  imports: [AppModule, BookmarkModule, UserModule, AuthModule],
})
export class AppModule {}
