// feedback.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  feedbacks = [
    {
      author: 'Juan Pérez',
      message: 'Excelente servicio, muy recomendable.',
      image: 'assets/images/feedback/customer0.jpg'
    },
    {
      author: 'Ana Gómez',
      message: 'Muy profesionales y atentos.',
      image: 'assets/images/feedback/customer1.jpg'
    },
    {
      author: 'Pedro Lopez',
      message: 'Muy satisfecho con el trabajo realizado. Recomendado 100%.',
      image: 'assets/images/feedback/customer2.jpg'
    },
    {
      author: 'Luis Rodriguez',
      message: 'Profesionales de confianza y muy atentos.',
      image: 'assets/images/feedback/customer3.jpg'
    },
    {
      author: 'Samiro Juarez',
      message: 'Gran atención al cliente y un trabajo impecable.',
      image: 'assets/images/feedback/customer4.jpg'
    },
    {
      author: 'Pablo Ortega',
      message: 'Superaron mis expectativas en todo sentido.',
      image: 'assets/images/feedback/customer5.jpg'
    }
    // Añade más feedbacks aquí
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
