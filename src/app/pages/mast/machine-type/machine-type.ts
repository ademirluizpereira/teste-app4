import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MachineTypeService, MachineType } from './machine-type.service';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { PrimeNG } from 'primeng/config';
import { Psgrid } from '@/shared/components/psgrid/psgrid';
import { PsToolbar } from '@/shared/components/pstoolbar/pstoolbar';
import { MachineTypeDialog } from './machine-type-dialog/machine-type-dialog';

interface Column {
  field: string;
  header: string;
  type: 'string' | 'number' | 'boolean' | 'date' ;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-machine-type',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ToastModule,
    DialogModule,
    ConfirmDialogModule,
    MenuModule,
    Psgrid,
    PsToolbar,
    MachineTypeDialog,
  ],
  templateUrl: 'machine-type.html',
  styleUrl: 'machine-type.scss',
  providers: [MessageService, MachineTypeService, ConfirmationService],
})
export class MachineTypeComponent implements OnInit {
  title = signal('Cadastro de Tipo de Máquina');

  @ViewChild('toolbar') toolbar!: PsToolbar;
  @ViewChild(MachineTypeDialog) dialog!: MachineTypeDialog;
  @ViewChild(Psgrid) grid!: Psgrid;
  @ViewChild('dt') dt!: Table;
  
  machineTypes = signal<MachineType[]>([]);
  machineType!: MachineType;
  selectedMachineTypes!: MachineType[] | null;
  submitted: boolean = false;
  searchValue: string | undefined;
  exportColumns!: ExportColumn[];
  cols!: Column[];
  exportItems!: MenuItem[];
  editDialogVisible: boolean = false;
  selectedRow: any = null;
  machineTypeService = inject(MachineTypeService);
  messageService = inject(MessageService);
  confirmationService = inject(ConfirmationService);
  private primengConfig: PrimeNG = inject(PrimeNG);
  selectedItems = signal<MachineType[]>([]);
  
  exportCSV() {
    this.dt.exportCSV();
  }

  ngOnInit() {
    this.primengConfig.setTranslation({
      accept: 'Sim',
      reject: 'Não',
      cancel: 'Cancelar',
    });
    
    this.loadData();
  }

  async loadData() {
    const data = await this.machineTypeService.getMachineTypes();
    this.machineTypes.set([...data]);

    this.cols = [
      { field: 'code', header: 'Cod.T.Máquina', type: 'string' },
      { field: 'description', header: 'Desc.Tipo Máquina', type: 'string' },
      { field: 'flowSeq', header: 'Sequência', type: 'number' },
      { field: 'isActive', header: 'Ativo', type: 'boolean' },
      { field: 'createdOn', header: 'Data Criação', type: 'date' },
      { field: 'changedOn', header: 'Data Alteração', type: 'date' },
      { field: 'capacityFlag', header: 'Capacidade', type: 'boolean' },
      { field: 'basicSpecFlag', header: 'Esp.Básica', type: 'boolean' },
      { field: 'cutterFlag', header: 'Corte', type: 'boolean' },
      { field: 'productFlag', header: 'Produto', type: 'boolean' },
      { field: 'costFlag', header: 'Custo', type: 'boolean' },
      { field: 'additionalFlag', header: 'Adicional', type: 'boolean' },
      { field: 'descriptionlFlag', header: 'Descrição', type: 'boolean' },
    ];

    this.exportItems = [
      {
        label: 'PDF',
        // command: () => {
        //     this.pdf();
        // }
      },
      {
        label: 'Excel',
        // command: () => {
        //     this.excel();
        // }
      },
    ];

    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }

  
  onGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.grid.filterGlobal(value);
  }

  

  openNew() {
    this.selectedRow = {
      id: undefined,
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
    this.submitted = false;
    this.editDialogVisible = true;
    this.dialog.open();
  }

  async deleteSelectedMachineTypes() {
    const itemsToDelete = this.selectedItems();

    this.confirmationService.confirm({
      message: 'Confirma a exclusão dos itens selecionados?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'btn-blue',
      rejectButtonStyleClass: 'btn-grey',
      accept: async () => {
        try {
          if (!itemsToDelete || itemsToDelete.length === 0) {
            return;
          }

          await Promise.all(
            itemsToDelete.map(machineType =>
              this.machineTypeService.deleteMachineType(machineType.id!)
            )
          );

          const updatedList = await this.machineTypeService.getMachineTypes();
          this.machineTypes.set([...updatedList]);

          this.selectedItems.set([]); 

          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Tipos de Máquina excluídos',
            life: 3000,
          });
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao excluir tipos de máquina',
            life: 3000,
          });
          console.error('Erro ao excluir múltiplos:', error);
        }
      },
    });
  }

  hideDialog() {
    this.editDialogVisible = false;
    this.selectedRow = {};
    this.submitted = false;
  }

  deleteMachineType(machineType: MachineType) {
    this.confirmationService.confirm({
      message: 'Tem a certeza de que deseja excluir ' + machineType.description + '?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        try {
          await this.machineTypeService.deleteMachineType(machineType.id!);

          const updatedList = await this.machineTypeService.getMachineTypes();
          this.machineTypes.set([...updatedList]);

          this.machineType = {};

          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Tipo de Máquina excluído',
            life: 3000,
          });
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao excluir tipo de máquina',
            life: 3000,
          });
          console.error('Erro ao excluir:', error);
        }
      },
    });
    this.selectedItems.set([]);
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
  
  async saveMachineType(machineType: MachineType) {
    const now = new Date().toISOString();

    try {
      const finalMachineType = {
        ...machineType,
        createdBy: machineType.createdBy || 'suporte.paper@papeersolutions.com.br',
        changedBy: 'suporte.paper@papeersolutions.com.br',
        createdOn: machineType.createdOn || now,
        changedOn: now,
      };
      if (finalMachineType.id) {
        await this.machineTypeService.updateMachineType(finalMachineType);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Tipo de Máquina atualizado',
          life: 3000,
        });
      } else {
        const created = await this.machineTypeService.createMachineType(finalMachineType);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Tipo de Máquina criado',
          life: 3000,
        });
      }

      const updatedList = await this.machineTypeService.getMachineTypes();
      this.machineTypes.set([...updatedList]);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Falha ao salvar tipo de máquina',
        life: 3000,
      });
      console.error('Erro ao salvar:', error);
    }
  }

  onEdit(row: any) {
    this.editDialogVisible = true;
    this.dialog.open(row as any);
  }
  
  onDelete(row: any) {
    if (!row?.id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Registro inválido para exclusão',
      });
      return;
    }

    this.confirmationService.confirm({
      message: 'Deseja realmente excluir este Tipo de Máquina?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'btn-blue',
      rejectButtonStyleClass: 'btn-grey',
      accept: async () => {
        try {
          await this.machineTypeService.deleteMachineType(row.id);
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Tipo de Máquina excluído com sucesso',
          });

          const updatedList = await this.machineTypeService.getMachineTypes();
          this.machineTypes.set([...updatedList]);
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao excluir Tipo de Máquina',
          });
          console.error('Erro ao excluir:', error);
        }
      },
    });
  }

  getMenuItems(machineType: MachineType): MenuItem[] {
    return [
      {
        label: 'Auditoria',
        icon: 'pi pi-eye',
        // command: () => this.viewItem(this.machineType)
      },
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: () => this.onEdit(machineType),
      },
      {
        label: 'Excluir',
        icon: 'pi pi-trash',
        command: () => this.deleteMachineType(machineType),
      },
    ];
  }
}
