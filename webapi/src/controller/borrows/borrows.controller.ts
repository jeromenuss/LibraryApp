import {
  Controller,
  Get,
  Param,
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

  /*@Get('profiles/:id/borrows')
  async getByUserId(@Param('id') id: number) {
    throw new NotImplementedException('Fonction en cours de développement');
  }*/

  /*@Post('borrows')
  async createBorrow(@Body() borrow: BorrowsDto) {
    if (borrow.bookId == 0)
      throw new BadRequestException("L'identifiant du livre est invalide");
    if (borrow.userId == 0)
      throw new BadRequestException(
        "L'identifiant de l'utilisateur est invalide",
      );

    throw new NotImplementedException('Fonction en cours de développement');
  }*/

  /* @Put('borrows/:id/back')
  async backBook(@Param('id') id: number) {
    throw new NotImplementedException('Fonction en cours de développement');
  }*/
}
