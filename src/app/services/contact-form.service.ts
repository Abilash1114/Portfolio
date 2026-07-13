import { Injectable } from '@angular/core';

// After deploying apps-script/ContactFormCode.gs as a Web App, paste its /exec URL here.
const CONTACT_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbwEnplBYl31hR7_zwA8cL4F61vhaBB-gXepdJoRtfCqDkufI-OnydliQlGmOUJ7nSt4/exec';

export interface ContactMessage {
  name: string;
  mobile: string;
  email: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactFormService {
  /**
   * Sends the message to the Apps Script sheet. Uses 'no-cors' like VisitorService —
   * Apps Script's /exec responds with a redirect that trips CORS validation even
   * though doPost() (the actual sheet write) already completed on the original
   * request, so we can't read the response body — but we don't need to: if fetch
   * doesn't throw, the request reached Google and the row was written.
   */
  submit(payload: ContactMessage): Promise<void> {
    return fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    }).then(() => undefined);
  }
}
