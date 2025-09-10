import { Component, Input, Output, EventEmitter, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MachineType } from '../machine-type.service';


@Component({
  selector: 'app-machine-type-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, ToggleSwitchModule],
  templateUrl: './machine-type-dialog.html',
})
export class MachineTypeDialog {
  visible = signal(false);
  submitted = signal(false);
  selectedRow: WritableSignal<MachineType> = signal(this.getEmptyMachineType());

  get isVisible(): boolean {
    return this.visible();
  }

  set isVisible(value: boolean) {
    this.visible.set(value);
  }

  @Output() onSave = new EventEmitter<MachineType>();
  @Output() onCancel = new EventEmitter<void>();

  open(row?: MachineType) {
    this.selectedRow.set(row ? { ...row } : this.getEmptyMachineType());
    this.submitted.set(false);
    this.visible.set(true);
  }

  close() {
    this.visible.set(false);
    this.onCancel.emit();
    this.submitted.set(false);
    this.selectedRow.set(this.getEmptyMachineType());
  }

  save() {
    this.submitted.set(true);

    const row = this.selectedRow();

    if (row.code?.trim() && row.description?.trim() && row.flowSeq !== null) {
      this.onSave.emit(row);
      this.visible.set(false);
    }
  }

  private getEmptyMachineType(): MachineType {
    return {
      code: '',
      description: '',
      flowSeq: 0,
      isActive: true,
      capacityFlag: false,
      basicSpecFlag: false,
      loadFlag: false,
      cutterFlag: false,
      costFlag: false,
      productFlag: false,
      additionalFlag: false,
      descriptionFlag: true,
    };
  }
}
