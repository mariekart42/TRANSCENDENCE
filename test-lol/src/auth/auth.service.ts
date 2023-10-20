import {Injectable} from "@nestjs/common";

@Injectable({})
export class AuthService{
    signup() {
        return 'lol SIGNUP';
    }
    signin() {
        return 'lol SIGNIN';
    }
}