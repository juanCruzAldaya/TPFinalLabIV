import { Component, OnInit, ViewChild } from '@angular/core';
import { ContractsService } from '../../services/contracts.service';
import { IContract } from '../../interfaces/IContracts.interface';
import { AuthService } from '../../services/auth.services';



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

  constructor(private contractService: ContractsService, private authService: AuthService) {}

  ngOnInit(): void {
    this.contractService.get_contrataciones_clientes().subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.contracts = data;
          
          this.processContracts(data);
        } else if (data && typeof data === 'object' && Array.isArray(data.contracts)) {
          this.contracts = data.contracts;
          this.processContracts(data.contracts);
        } else {
          console.error('Expected an array but got:', data);
        }
      },
      error: (err) => console.error('Error fetching contracts:', err)
    });
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
  
}
