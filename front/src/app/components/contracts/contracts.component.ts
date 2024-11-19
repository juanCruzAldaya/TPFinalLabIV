import { Component, OnInit, ViewChild } from '@angular/core';
import { ContractsService } from '../../services/contracts.service';
import { IContract } from '../../interfaces/IContracts.interface';
import { AuthService } from '../../services/auth.services';
import { CalendarService } from '../../services/calendar.service';
import {IEvento} from '../../interfaces/IEvent.interface'
import { SharedService } from '../../services/shared.service';


@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit {
  contracts: IContract[] = [];
  filteredContracts: any[] = [];

  selectedContract: IContract | null = null;
  isModalOpen = false;
  isProfessionalModalOpen = false;
  isProfessionalView = false;
  confirmAction: string = '';
  contractToConfirm: IContract | null = null;
  isConfirmModalOpen = false;

  constructor(private contractService: ContractsService, 
    private authService: AuthService, 
    private calendarService: CalendarService, 
    private sharedService: SharedService) {

    }

  ngOnInit(): void {
    this.loadContracts();
  }








  loadContracts(): void {
    if (this.isProfessionalView) {
      this.contractService.get_contrataciones_profesionales().subscribe({
        next: (data: any) => {
          this.contracts = data;
        },
        error: (err) => console.error('Error fetching contracts:', err)
      });
    } else {
      this.contractService.get_contrataciones_clientes().subscribe({
        next: (data: any) => {
          this.contracts = data;
        },
        error: (err) => console.error('Error fetching contracts:', err)
      });
    }
  }
  processContracts(contracts: IContract[]): void {
    contracts.forEach(contract => {
      console.log('Processing contract:', contract);
      // Aquí puedes agregar la lógica que necesites para procesar cada contrato
    });
  }
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return 'status-pending';
      case 'cancelado':
      case 'rechazado':
        return 'status-canceled';
      case 'aceptado':
      case 'finalizado':
        return 'status-accepted';
      default:
        return '';
    }
  } 



  onContractTypeChange(event: any): void {
    this.isProfessionalView = event.target.value === 'profesional';
    this.loadContracts();
  }

  openBasicDetails(contract: any) {
    this.selectedContract = contract;
    this.isModalOpen = true;
  }

  openProfessionalDetails() {
    this.isProfessionalModalOpen = true;
  }
  
  closeModal() {
    this.isModalOpen = false;
  }
  showContractDetails(contract: any) {
    this.selectedContract = contract;
    this.isModalOpen = true;
  }
  updateFilter(criteria: any): void {
    this.filteredContracts = this.contracts.filter(contract => {
      return true; 
    });
  }


  closeProfessionalModal() {
    this.isProfessionalModalOpen = false;
  }
  acceptContract(contractId: number): void {
    this.contractService.updateContractStatus(contractId, 'aceptado').subscribe({
      next: () => {
        const contract = this.contracts.find(c => c.id === contractId);
        if (contract) {
          contract.estado = 'aceptado';
          const evento: IEvento = {
            id: 0, 
            calendario_id: this.sharedService.getCalendarId(),
            fecha: contract.fecha_contratacion, 
            hora_inicio: contract.hora_contratacion, 
            hora_fin: this.calculateEndTime(contract.hora_contratacion, 3), 
            estado: 'reservado'
          };
          this.calendarService.createEvent(evento).subscribe({
            next: (response) => {
              console.log('Evento creado con éxito', response);
            },
            error: (err) => {
              console.error('Error al crear el evento:', err);
            }
          });

          
        }
        
        console.log('Contract accepted successfully');
      },
      error: (err) => {
        console.error('Error accepting contract:', err);
      }
    });
  }
  calculateEndTime(startTime: string, durationHours: number): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(hours + durationHours, minutes);
    return endTime.toTimeString().slice(0, 5);
  }
  rejectContract(contractId: number): void {
    this.contractService.updateContractStatus(contractId, 'rechazado').subscribe({
      next: () => {
        const contract = this.contracts.find(c => c.id === contractId);
        if (contract) {
          contract.estado = 'rechazado';
        }
        console.log('Contract rejected successfully');
      },
      error: (err) => {
        console.error('Error rejecting contract:', err);
      }
    });
  }
  openConfirmModal(action: string, contract: IContract): void {
    this.confirmAction = action;
    this.contractToConfirm = contract;
    this.isConfirmModalOpen = true;
  }

  closeConfirmModal(): void {
    this.isConfirmModalOpen = false;
  }

  confirmActionHandler(): void {
    if (this.confirmAction === 'aceptar') {
      this.acceptContract(this.contractToConfirm!.id);
    } else if (this.confirmAction === 'rechazar') {
      this.rejectContract(this.contractToConfirm!.id);
    }
    else if (this.confirmAction === 'finalizar') {
      this.finalizeContract();
    }
    this.closeConfirmModal();
  }
  canFinish(): boolean {
    return this.selectedContract?.estado === 'aceptado';
  }
  canCancelService(): boolean {
    return this.selectedContract?.estado !== 'cancelado' && this.selectedContract?.estado !== 'finalizado';
  }
  canReviewService(): boolean {
    return this.selectedContract?.estado === 'finalizado';
  }
  cancelService(): void {
    if (this.selectedContract) {
      if (this.selectedContract.estado != 'cancelado'){
        this.contractService.updateContractStatus(this.selectedContract.id, 'cancelado').subscribe({
          next: () => {
            this.selectedContract!.estado = 'cancelado';
            console.log('Service canceled successfully');
          },
          error: (err) => {
            console.error('Error canceling service:', err);
          }
        });
      }

    }
  }
  addReview(): void {
    // Logic to open a review form or modal
    console.log('Opening review form for service:', this.selectedContract?.id);
  }
  // Method to finish the service


  finishService(): void {
    if (this.selectedContract) {
      this.openConfirmModal('finalizar', this.selectedContract);
    }
  }
  finalizeContract(): void {
    if (this.selectedContract) {
      this.contractService.updateContractStatus(this.selectedContract.id, 'finalizado').subscribe({
        next: () => {
          this.selectedContract!.estado = 'finalizado';
          console.log('Service finished successfully');
        },
        error: (err) => {
          console.error('Error finishing service:', err);
        }
      });
    }
  }
  isAccepted(contract: IContract): boolean {
    return contract.estado === 'aceptado';
  }
  
  isPending(contract: IContract): boolean {
    return contract.estado === 'pendiente';
  }
}
