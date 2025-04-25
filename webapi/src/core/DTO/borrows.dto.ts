import {ApiProperty} from "@nestjs/swagger";

export class BorrowsDto{
    @ApiProperty()
    bookId:number;
    @ApiProperty()
    userId:number;
    @ApiProperty()
    borrowDate:Date;
    @ApiProperty()
    borrowBackDate:Date;

}