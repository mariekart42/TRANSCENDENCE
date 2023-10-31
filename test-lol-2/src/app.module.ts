import {Module} from "@nestjs/common";
import {IndexModule} from "./index/index.module";
import {NotYetModule} from "./notYet/notYet.module";

@Module({
    imports: [
        IndexModule,
        NotYetModule]
})
export class AppModule {}