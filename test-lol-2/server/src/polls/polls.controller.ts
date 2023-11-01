import {Body, Controller, Logger, Post} from "@nestjs/common";
import {CreatePollDto, JoinPollDto} from "./dtos";

@Controller('polls')
export class PollsController {

    @Post()
    async create(@Body() createPollDtoObject: CreatePollDto) {
        Logger.log(' -->  POLLS  CREATE');
        return createPollDtoObject;
    }

    @Post('/join')
    async join(@Body() joinPollDtoObject: JoinPollDto) {
        Logger.log(' -->  POLLS  JOIN');
        return joinPollDtoObject;
    }

    @Post('/rejoin')
    async rejoin() {
        Logger.log(' -->  POLLS  REJOIN');
    }

}