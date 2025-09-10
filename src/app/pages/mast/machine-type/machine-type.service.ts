import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface MachineType {
  id?: string;
  code?: string;
  description?: string;
  flowSeq?: number;
  capacityFlag?: boolean;
  basicSpecFlag?: boolean;
  loadFlag?: boolean;
  cutterFlag?: boolean;
  productFlag?: boolean;
  costFlag?: boolean;
  additionalFlag?: boolean;
  descriptionFlag?: boolean;
  isActive?: boolean;
  createdBy?: string;
  changedBy?: string;
  createdOn?: string;
  changedOn?: string;
}

@Injectable()
export class MachineTypeService {
  private baseUrl = environment.apiUrl;

  private http = inject(HttpClient);

  getMachineTypes(): Promise<MachineType[]> {
    return firstValueFrom(this.http.get<MachineType[]>(`${this.baseUrl}/machineTypes`));
  }

  createMachineType(machineType: MachineType): Promise<MachineType> {
    return firstValueFrom(this.http.post<MachineType>(`${this.baseUrl}/machineTypes`, machineType));
  }

  updateMachineType(machineType: MachineType): Promise<MachineType> {
    return firstValueFrom(
      this.http.put<MachineType>(`${this.baseUrl}/machineTypes/${machineType.id}`, machineType)
    );
  }

  deleteMachineType(id: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.baseUrl}/machineTypes/${id}`));
  }
}
