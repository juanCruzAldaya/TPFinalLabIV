import { Component, OnInit } from '@angular/core';
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
  selectedContract: IContract | null = null;

  constructor(private contractService: ContractsService, private authService: AuthService) {}

  ngOnInit(): void {
    this.contractService.get_contrataciones_clientes(parseInt(this.authService.getUserId())).subscribe({
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

  openBasicDetails(contract: IContract): void {
    this.selectedContract = contract;
    this.showModal('basicDetailsModal');
  }

  openProfessionalDetails(): void {
    this.hideModal('basicDetailsModal');
    this.showModal('professionalDetailsModal');
  }

  showModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'block';
      modalElement.removeAttribute('aria-hidden');
      modalElement.setAttribute('aria-modal', 'true');
    } else {
      console.error(`Element with id "${modalId}" not found.`);
    }
  }

  hideModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      modalElement.setAttribute('aria-hidden', 'true');
      modalElement.removeAttribute('aria-modal');
    } else {
      console.error(`Element with id "${modalId}" not found.`);
    }
  }

  
}
