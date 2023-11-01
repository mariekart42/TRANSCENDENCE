import {Injectable} from "@nestjs/common";
import {CreatePollFields, JoinPollFields, RejoinPollFields} from "./types";
import {createPollID, createUserID} from "../ids";

@Injectable()
export class PollsService {

    async createPoll(fields: CreatePollFields) {
        // function declared in ids.ts
        const pollID = createPollID();
        const userID = createUserID();

        return {
            ...fields, // returning pollFields
            pollID,
            userID
        };
    }


    async joinPoll(fields: JoinPollFields) {
        const userID = createUserID();

        return {
            ...fields,
            userID
        };
    }
    async rejoinPoll(fields: RejoinPollFields) {
        return fields; // returning this just for now
    }
}


