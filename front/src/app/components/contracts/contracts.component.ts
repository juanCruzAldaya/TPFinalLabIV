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

  constructor(private contractService: ContractsService, private authService: AuthService) {}

  ngOnInit(): void {
    this.contractService.get_contrataciones_clientes(this.authService.getUserId()).subscribe({
      next: (data: any) => {
        console.log('Received data:', data); // Línea de depuración
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
}