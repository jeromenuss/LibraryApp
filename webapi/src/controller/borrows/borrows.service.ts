import { Injectable } from '@nestjs/common';
import { FirebaseRepository } from '../../firebase/firebase.repository';
import { Borrow } from 'src/core/models/borrow.model';

@Injectable()
export class BorrowsService extends FirebaseRepository<Borrow> {
  constructor() {
    super();
  }

  /*async createBorrowAsync(borrow: BorrowsDto) {
    throw new NotFoundException();
  }*/
}
