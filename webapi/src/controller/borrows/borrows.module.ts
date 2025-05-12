import { Module } from '@nestjs/common';
import { BorrowsService } from './borrows.service';
import { BorrowsController } from './borrows.controller';
import { BooksService } from '../books/books.service';
import { ProfilesService } from '../profiles/profiles.service';

@Module({
  imports: [],
  providers: [BorrowsService, BooksService, ProfilesService],
  controllers: [BorrowsController],
  exports: [BorrowsService],
})
export class BorrowsModule {}
