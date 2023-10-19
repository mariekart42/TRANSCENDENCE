import { Module } from '@nestjs/common';
import {BookmarkModule} from "./bookmark/bookmark.module";
import {UserModule} from "./User/User.module";

@Module({
  imports: [AppModule, BookmarkModule, UserModule],
})
export class AppModule {}
