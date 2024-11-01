import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NgModel, ReactiveFormsModule } from "@angular/forms";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "laburApp";
}
