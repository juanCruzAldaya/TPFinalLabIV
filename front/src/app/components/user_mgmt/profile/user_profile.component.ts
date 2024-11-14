import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user_profile.component.html',
  styleUrls: ['./user_profile.component.css']
})
export class ProfileComponent {
  constructor(private authService: AuthService, private router: Router) {
  }
  repositories = [
    { name: 'Electricista', description: 'Electricista profesional con años de experiencia en instalaciones, reparaciones y mantenimiento. Especializado en resolver problemas eléctricos residenciales y comerciales. Servicio rápido, seguro y con garantía.', language: 'JavaScript', isEditing: false },
    { name: 'Clases de ingles particulares', description: 'Profesor de inglés con experiencia en todos los niveles, desde principiantes hasta avanzados. Clases personalizadas para mejorar conversación, gramática y comprensión. Ideal para estudiantes y profesionales', language: 'JavaScript', isEditing: false },
    { name: 'Reparacion de computadoras', description: 'Técnico en reparación de computadoras con experiencia en solución de problemas, mantenimiento y optimización. Ofrece servicios de limpieza, recuperación de datos y actualización de hardware para mejorar el rendimiento', language: 'JavaScript', isEditing: false },
  ];

  serviceTitle: string = ''; // Propiedad para almacenar el título del servicio
  serviceDescription: string = ''; // Propiedad para almacenar la descripción del servicio

  editService(index: number) {
    this.repositories[index].isEditing = true; 
  }

  saveChanges(index: number) {
    this.repositories[index].isEditing = false;
  }

    // Método para guardar los valores editados
    guardarServicio() {
      // Aquí puedes agregar la lógica para guardar los datos, por ejemplo:
      console.log('Título del servicio:', this.serviceTitle);
      console.log('Descripción del servicio:', this.serviceDescription);
      // Puedes hacer otras operaciones, como enviar los datos a un servidor o actualizar una lista de servicios.
    }
    navigateToCompleteUser() {
      this.router.navigate([`/complete_user/${this.authService.getUserId()}`]);
    }
}
