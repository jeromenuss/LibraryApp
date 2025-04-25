import {ApiProperty} from "@nestjs/swagger";

export class PaginationDto<T>{
    @ApiProperty()
    page:number;
    @ApiProperty()
    pageSize:number;
    @ApiProperty()
    totalCount:number;
    @ApiProperty()
    data:T[];
}