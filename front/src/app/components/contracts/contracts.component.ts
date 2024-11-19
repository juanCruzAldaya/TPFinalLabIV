import { Component, OnInit, ViewChild } from '@angular/core';
import { ContractsService } from '../../services/contracts.service';
import { IContract } from '../../interfaces/IContracts.interface';
import { AuthService } from '../../services/auth.service';



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

  constructor(private contractService: ContractsService, private authService: AuthService) {}

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
        }
        console.log('Contract accepted successfully');
      },
      error: (err) => {
        console.error('Error accepting contract:', err);
      }
    });
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
    this.closeConfirmModal();
  }
}
