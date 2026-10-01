import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice, Payment, PaymentRequest } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.baseUrl}/invoices`);
  }

  payInvoice(id: number, payment: PaymentRequest): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.baseUrl}/invoices/${id}/payments`, payment);
  }

  getPayments(invoiceId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.baseUrl}/invoices/${invoiceId}/payments`);
  }
}
