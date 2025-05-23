import { Module } from '@nestjs/common';
import {BooksService} from "./books.service";
import {BooksController} from "./books.controller";

@Module({
    imports: [],
    providers: [
        BooksService
    ],
    controllers: [BooksController],
    exports: [BooksService],
})
export class BooksModule {}
