import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  contactform = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    mobile: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{10}$'),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
    ]),
    requirement: new FormControl('', [Validators.required]),
    comment: new FormControl('', [Validators.required]),
  });

  submitform(): void {
    if (this.contactform.valid) {
      const formvalue = this.contactform.value;
      const companyemail = 'abilashravi09@gmail.com';
      const subject = 'Contact Form Message';
      const body = `
Name: ${formvalue.name}

Mobile: ${formvalue.mobile}

Email: ${formvalue.email}

Requirement: ${formvalue.requirement}

Comment:
${formvalue.comment}
      `;
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${encodeURIComponent(
        companyemail,
      )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(gmailUrl, '_blank');
      this.contactform.reset();
    } else {
      this.contactform.markAllAsTouched();
    }
  }
}
