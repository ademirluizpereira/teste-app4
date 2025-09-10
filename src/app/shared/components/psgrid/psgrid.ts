import { Component, Input, signal, Signal, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuModule } from 'primeng/menu';
import { IconFieldModule } from 'primeng/iconfield';
import { CheckboxModule } from 'primeng/checkbox';
import { Output, EventEmitter } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-psgrid',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    SplitButtonModule,
    MenuModule,
    IconFieldModule,
    CheckboxModule,
  ],
  templateUrl: 'psgrid.html',
})
export class Psgrid {
  @Input({ required: true }) data!: Signal<any[]>;
  @Input({ required: true }) columns!: Array<{
    field: string;
    header: string;
    type: 'string' | 'number' | 'boolean' | 'date';
  }>;
  @Input() exportItems: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any[]>();

  selectedItems: any[] = [];

  @ViewChild('dt') tableRef!: Table;

  clearFilters(table: any) {
    table.clear();
  }

  filterGlobal(value: string) {
    this.tableRef.filterGlobal(value, 'contains');
  }
  
  getMenuItems(row: any) {
    return [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.edit.emit(row),
      },
      {
        label: 'Excluir',
        icon: 'pi pi-trash',
        command: () => this.delete.emit(row),
      },
    ];
  }

  onSelectionChange(selection: any[]) {
    this.selectionChange.emit(selection);
  }
}
