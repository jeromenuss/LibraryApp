import { ApiProperty } from '@nestjs/swagger';

export class BorrowsDto {
  @ApiProperty()
  bookId: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  borrowDate: Date;
  @ApiProperty()
  borrowBackDate: Date;
}
