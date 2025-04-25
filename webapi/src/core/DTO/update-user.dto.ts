import {Profile} from "../models/profile.model";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateUserDto{
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    lastname: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    phone: string;
    @ApiProperty()
    password: string;
}