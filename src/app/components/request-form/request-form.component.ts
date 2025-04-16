import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestService } from '../../services/request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss']
})
export class RequestFormComponent {
  today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  requestForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private requestService: RequestService,
    private router: Router
  ) {
    this.requestForm = this.fb.group({
      description: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      expected_date: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.requestForm.valid) {
      // Validar fecha
      const selectedDate = new Date(this.requestForm.value.expected_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // if (selectedDate < today) {
      //   alert('La fecha no puede ser anterior a hoy');
      //   return;
      // }

      const formData = {
        ...this.requestForm.value,
        status: 'pendiente'
      };

      this.requestService.createRequest(formData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          console.error('Error creating request:', error);
          alert('Error al crear la solicitud');
        }
      });
    } else {
      alert('Por favor complete todos los campos correctamente');
    }
  }
}
