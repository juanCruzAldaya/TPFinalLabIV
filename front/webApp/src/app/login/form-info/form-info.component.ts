import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-info',
  templateUrl: './form-info.component.html',
  styleUrl: './form-info.component.css'
})
export class FormInfoComponent {
  constructor(
    private fb: FormBuilder,
  ){}
  registerForm!: FormGroup;


}
