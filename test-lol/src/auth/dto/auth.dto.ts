// hast to be a class cause we want to use class-validator and class-transformer on it
import {IsEmail, IsNotEmpty, IsString} from "class-validator";
export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}