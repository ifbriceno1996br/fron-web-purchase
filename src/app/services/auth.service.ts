import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RefreshTokenRequest, User } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api/v1/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private currentRoleSubject = new BehaviorSubject<string>(localStorage.getItem('current_role') || '');
  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {
    // Check if we have user data in localStorage
    const userData = localStorage.getItem('user');
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (userData && accessToken) {
      this.currentUserSubject.next(JSON.parse(userData));
      this.accessTokenSubject.next(accessToken);
      this.refreshTokenSubject.next(refreshToken);
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getCurrentRole(): string | null {
    return this.currentRoleSubject.value || localStorage.getItem('current_role');
  }

  setCurrentRole(role: string) {
    localStorage.setItem('current_role', role);
    this.currentRoleSubject.next(role);
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  get currentUserObservable(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  get currentRoleObservable(): Observable<string> {
    return this.currentRoleSubject.asObservable();
  }

  get accessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    const formData = new URLSearchParams();
    formData.set('username', credentials.username);
    formData.set('password', credentials.password);

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'application/json');

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, formData.toString(), { headers })
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.refreshTokenSubject.value;
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const body: RefreshTokenRequest = {
      refresh_token: refreshToken
    };

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, body)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout/`, {}, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.accessToken}`
      })
    })
      .pipe(
        tap(() => {
          this.clearAuthData();
        })
      );
  }

  private handleAuthResponse(response: AuthResponse) {
    const user: User = {
      id: response.user_id,
      fullName: response.full_name,
      roleName: response.role_name,
      roles: response.roles
    };

    // Store tokens and user data
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
    localStorage.setItem('user', JSON.stringify(user));

    // Update subjects
    this.currentUserSubject.next(user);
    this.accessTokenSubject.next(response.access_token);
    this.refreshTokenSubject.next(response.refresh_token);
  }

  private clearAuthData() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('current_role');
    this.currentUserSubject.next(null);
    this.currentRoleSubject.next('');
    // this.router.navigate(['/login']); // commented out as router is not defined
  }
}
