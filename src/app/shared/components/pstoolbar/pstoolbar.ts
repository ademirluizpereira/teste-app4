import { Component, Input, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-pstoolbar',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
  ],
  templateUrl: './pstoolbar.html',
  styleUrls: ['./pstoolbar.scss']
})
export class PsToolbar {
  @Input() selectedItems!: Signal<any[]>;
  @Input() title!: Signal<string>;
  @Input() onAdd!: () => void;
  @Input() onDelete!: () => void;
  @Input() onFilter!: (event: Event) => void;
  disableDelete = computed(() => this.selectedItems?.().length === 0);
}
