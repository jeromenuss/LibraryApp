import {
  Body,
  Controller,
  Get,
  Param, Patch, Post, Put,
  UseFilters,
} from '@nestjs/common';
import { BorrowsService } from './borrows.service';
import { BorrowsDto } from '../../core/DTO/borrows.dto';
import { BooksService } from '../books/books.service';
import { ProfilesService } from '../profiles/profiles.service';
import { HttpErrorExceptionFilter } from '../../core/filter/errors/errors.filter';
import { Borrow } from '../../core/models/borrow.model';

@Controller()
@UseFilters(new HttpErrorExceptionFilter())
export class BorrowsController {
  constructor(
    private borrowService: BorrowsService,
    private bookService: BooksService,
    private userService: ProfilesService,
  ) {}

  @Get('borrows')
  async GetAllAsync(): Promise<Borrow[]> {
    return await this.borrowService.getAllDocsAsync();
  }

  @Get('borrows/:id')
  async getByIdAsync(@Param('id') id: string): Promise<Borrow> {
    return await this.borrowService.getDocByIdAsync(id);
  }

  @Post('borrows')
  async createBorrow(@Body() borrow:BorrowsDto):Promise<string>{
    return this.borrowService.createBorrow(borrow);
  }

  @Patch('borrows/:id/back')
  async backBook(@Param('id') id:string):Promise<void> {
    return this.borrowService.backBook(id);
  }
}
