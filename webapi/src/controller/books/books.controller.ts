import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { PaginationDto } from '../../core/DTO/pagination.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ConstantsCommons } from '../../core/commons/constants.commons';
import { HttpErrorExceptionFilter } from '../../core/filter/errors/errors.filter';
import { Public } from '../auth/public.decorator';
import { Book } from 'src/core/models/book.model';

@ApiBearerAuth()
@Controller('books')
@UseFilters(new HttpErrorExceptionFilter())
export class BooksController {
  constructor(private bookService: BooksService) {}

  @Public()
  @Get()
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    default: ConstantsCommons.PAGE_SIZE_DEFAULT,
  })
  @ApiQuery({
    name: 'typeRead',
    required: false,
    type: String,
    default: 'next',
  })
  @ApiQuery({
    name: 'lastItemId',
    required: false,
    type: String,
  })
  async findAllAsync(
    @Query('pageSize') pageSize: number = 10,
    @Query('typeRead') typeRead: 'previous' | 'next' = 'next',
    @Query('lastItemId') lastItemId?: string,
  ): Promise<PaginationDto<Book>> {
    const pageSizeNumber = Number(pageSize);
    return await this.bookService.getAllDocsWithPagination(
      pageSizeNumber,
      typeRead,
      lastItemId,
    );
    /*return await this.bookService.findAllAsync(pageSize, page);*/
  }

  @Public()
  @Get('search')
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'author', required: false })
  @ApiQuery({ name: 'minYear', required: false, type: Number, default: 0 })
  @ApiQuery({ name: 'maxYear', required: false, type: Number, default: 0 })
  @ApiQuery({ name: 'kind', required: false })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, default: 10 })
  @ApiQuery({
    name: 'typeRead',
    required: false,
    type: String,
    default: 'next',
  })
  @ApiQuery({ name: 'lastItemId', required: false, type: String })
  async searchAsync(
    @Query('title') title: string = '',
    @Query('author') author: string = '',
    @Query('minYear') minYear: number = 0,
    @Query('maxYear') maxYear: number = 0,
    @Query('kind') kind: string = '',
    @Query('pageSize') pageSize: number = 10,
    @Query('typeRead') typeRead: 'previous' | 'next' = 'next',
    @Query('lastItemId') lastItemId?: string,
  ): Promise<PaginationDto<Book>> {
    const currentYear = new Date(Date.now()).getFullYear();

    if (minYear > 0 && minYear < 1400) {
      throw new BadRequestException(
        "L'année de publication minimale doit être supérieur ou égale à 1400",
      );
    }
    if (maxYear > currentYear) {
      throw new BadRequestException(
        `L'année de publication maximale doit être inférieur ou égale à ${currentYear}`,
      );
    }

    return this.bookService.searchAsync(
      minYear,
      maxYear,
      pageSize,
      typeRead,
      lastItemId,
    );
  }

  @Public()
  @Get(':id')
  async findByIdAsync(@Param('id') id: string): Promise<Book | null> {
    return this.bookService.getDocByIdAsync(id);
  }

  @Public()
  @Post()
  async create(@Body() book: Book) {
    return await this.bookService.createDocAsync(book);
  }

  /*  @Public()
  @Post('range')
  async createRange(@Body() books: Book[]) {
    return books.map(async (book) => {
      return await this.bookService.createDocAsync(book);
    });
  }*/

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.bookService.deleteDocAsync(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() book: Book) {
    if (id !== book.id) {
      throw new BadRequestException(
        "L'identifiant du paramètre est différent à celui du livre",
      );
    }

    await this.bookService.updateDocAsync(id, book);
  }
}
