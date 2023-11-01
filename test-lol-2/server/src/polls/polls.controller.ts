import {Body, Controller, Logger, Post} from "@nestjs/common";
import {CreatePollDto, JoinPollDto} from "./dtos";
import {PollsService} from "./polls.service";

@Controller('polls')
export class PollsController {

    // we want access to polls.service => CONSTRUCTOR!
    constructor(private pollServiceObject: PollsService) {}

    @Post()
    async create(@Body() createPollDtoObject: CreatePollDto) {
        Logger.log(' -->  POLLS  CREATE');
        const result = await this.pollServiceObject.createPoll(createPollDtoObject);
    console.log(result);
        return result;
    }

    @Post('/join')
    async join(@Body() joinPollDtoObject: JoinPollDto) {
        Logger.log(' -->  POLLS  JOIN');
        const result = await this.pollServiceObject.joinPoll(joinPollDtoObject);
    console.log(result);
        return result;
    }

    @Post('/rejoin')
    async rejoin() {
        Logger.log(' -->  POLLS  REJOIN');
        const result = await this.pollServiceObject.rejoinPoll({
            name: "I'am a dummy lol",
            pollID: "Dummy ID",
            userID: "Dummy userID",
            // creating a dummy here cause we don't have logic for this yet
        });
    console.log(result);
        return result;

    }

}