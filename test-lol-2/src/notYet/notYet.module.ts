import {Module} from "@nestjs/common";
import {NotYetController} from "./notYet.controller";

@Module({
    controllers: [NotYetController]
})
export class NotYetModule{}