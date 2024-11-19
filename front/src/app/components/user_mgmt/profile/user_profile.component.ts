import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CompletingUsersService } from '../../../services/completing-users.service';
import { IUsuarios } from '../../../interfaces/users.interfaces';
import Swal from 'sweetalert2';
import { ReseñasService } from '../../../services/resenia.service';
import { IReseña } from '../../../interfaces/resenia.interface';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user_profile.component.html',
  styleUrls: ['./user_profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileImageUrl: string = 'front/src/assets/images/home/image-user.png';  
  @ViewChild('fileInput') fileInput!: ElementRef;
 

  changeProfilePicture(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        this.profileImageUrl = reader.result as string; // Actualiza la URL de la imagen
      };
      reader.readAsDataURL(file);
    }
  
  }

  resenias: IReseña[] = [];
  nuevaResenia: IReseña = {
    usuario_id: 0,
    servicio_id: 0,
    calificacion: 5,
    comentario: "",
  };
  
  constructor(private authService: AuthService, private router: Router,private servis: CompletingUsersService,private reseñasService: ReseñasService) {
  }
  ngOnInit(): void {
    this.loadUserData();
  const servicio_id = 1; // ID del servicio específico
    // this.obtenerResenias(servicio_id);
  }
    user : IUsuarios | undefined ;
    loadUserData(): void {
      const userId = this.authService.getUserId();
      console.log(userId);
      this.servis.getUserData(userId).subscribe(
        (usuario: IUsuarios) => {
          this.user=usuario;
        },
        error => {
          console.error('Error al cargar los datos del usuario:', error);
        }
      );
    }
  


  // obtenerResenias(servicio_id: number): void {
  //   this.reseñasService.getReseñas(servicio_id).subscribe((data) => {
  //     this.resenias = data;
  //   });
  // }

    navigateToCompleteUser() {
      this.router.navigate([`/complete_user/${this.authService.getUserId()}`]);
    }
    navigateTo(route: string) {
      this.router.navigate([route]);
    }
    deleteProfile(): void {
      this.servis.deleteUser(this.authService.getUserId()).subscribe(
        () => {
          this.authService.logout();
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Error al eliminar el usuario:', error);
        }
      );
    }
    
    calcularPromedioCalificacion(): number {
      if (this.resenias.length === 0) return 0;
      const sumaCalificaciones = this.resenias.reduce((sum, resenia) => sum + resenia.calificacion, 0);
      return Math.round(sumaCalificaciones / this.resenias.length); 
    }
    

confirmDelete(): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, borrar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.deleteProfile();
    }
  });
}

    
}
