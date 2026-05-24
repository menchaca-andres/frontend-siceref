import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-table-pagination',
  templateUrl: './table-pagination.html',
  styleUrl: './table-pagination.scss'
})
export class TablePaginationComponent {
  @Input() page = 1
  @Input() pageSize = 5
  @Input() totalItems = 0

  @Output() pageChange = new EventEmitter<number>()

  totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize))
  }

  rangeStart(): number {
    if (this.totalItems === 0) return 0
    return (this.page - 1) * this.pageSize + 1
  }

  rangeEnd(): number {
    return Math.min(this.page * this.pageSize, this.totalItems)
  }

  previous(): void {
    if (this.page > 1) this.pageChange.emit(this.page - 1)
  }

  next(): void {
    if (this.page < this.totalPages()) this.pageChange.emit(this.page + 1)
  }
}
