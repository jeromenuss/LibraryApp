import { Component } from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {DatePipe} from "@angular/common";
import {MatChip} from "@angular/material/chips";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {BorrowItemDto} from "../../../core/dto/borrow-item.dto";

@Component({
  selector: 'app-list-borrow',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    DatePipe,
    MatChip,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatPaginator,
    MatCardContent
  ],
  templateUrl: './list-borrow.component.html',
  styleUrl: './list-borrow.component.scss'
})
export class ListBorrowComponent {
  selectedState: string = "";
  filteredDataSource: BorrowItemDto[] = [];
  displayedColumns: string[] = ["isbn", "title", "user", "borrowDate", "previousDateBack", "state"];
  filteredLength: number = 0;

  onStateFilterChange(value: string) {

  }

  onPageChange($event: PageEvent) {

  }
}
