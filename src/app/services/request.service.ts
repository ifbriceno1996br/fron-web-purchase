import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseRequest } from '../interfaces/purchase-request.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private apiUrl = 'http://localhost:8000/api/v1/requests';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.accessToken;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getRequests(): Observable<PurchaseRequest[]> {
    return this.http.get<PurchaseRequest[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  updateRequestStatus(requestId: number, status: string, comment: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${requestId}/status/`, { status, comment }, { headers: this.getHeaders() });
  }

  downloadReport(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/report/csv/`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }
  downloadReportUserStats(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/user-stats/csv`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }

  createRequest(request: { description: string; amount: number }): Observable<PurchaseRequest> {
    const body = {
      ...request,
      status: 'pendiente'
    };
    return this.http.post<PurchaseRequest>(this.apiUrl, body, { headers: this.getHeaders() });
  }
}
