import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { VisitorService } from '../../../services/visitor.service';
import { ContactFormService } from '../../../services/contact-form.service';

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent {
  constructor(
    private visitorService: VisitorService,
    private contactFormService: ContactFormService,
  ) {}

  submitStatus: SubmitStatus = 'idle';

  /** Logs a click on a social/CTA link as a distinct event in the tracking sheet. */
  trackClick(label: string): void {
    this.visitorService.track(label);
  }

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
    message: new FormControl('', [Validators.required]),
  });

  submitform(): void {
    if (!this.contactform.valid) {
      this.contactform.markAllAsTouched();
      return;
    }

    this.trackClick('Contact Form Submit');
    this.submitStatus = 'sending';

    const formvalue = this.contactform.value;

    this.contactFormService
      .submit({
        name: formvalue.name ?? '',
        mobile: formvalue.mobile ?? '',
        email: formvalue.email ?? '',
        message: formvalue.message ?? '',
      })
      .then(() => {
        this.submitStatus = 'success';
        this.contactform.reset();
        setTimeout(() => (this.submitStatus = 'idle'), 4000);
      })
      .catch(() => {
        this.submitStatus = 'error';
        setTimeout(() => (this.submitStatus = 'idle'), 4000);
      });
  }
}
