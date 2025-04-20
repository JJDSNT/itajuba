import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.css']
})
export class ContactPageComponent {
  name = '';
  email = '';
  message = '';

  onSubmit() {
    console.log('Enviado:', this.name, this.email, this.message);
    alert('Mensagem enviada com sucesso!');
  }
}
