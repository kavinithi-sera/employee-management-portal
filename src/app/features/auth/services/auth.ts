import { Injectable, computed, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LoginRequest } from '../models/login-request.model';
import { AuthResponse } from '../models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenKey = 'ems_access_token';

  private readonly userNameKey = 'ems_user_name';

  private token = signal<string | null>(
    localStorage.getItem(this.tokenKey)
  );

  userName = signal<string>(
    localStorage.getItem(this.userNameKey) ?? ''
  );

  isLoggedIn = computed(
    () => this.token() !== null
  );

  login(
    credentials: LoginRequest
  ): Observable<AuthResponse> {

    const validEmail = 'admin@ems.com';
    const validPassword = 'Admin@123';

    if (
      credentials.email !== validEmail ||
      credentials.password !== validPassword
    ) {

      return throwError(
        () => new Error(
          'Invalid email or password.'
        )
      );

    }

    const response: AuthResponse = {
      accessToken: 'mock-ems-access-token',
      userName: 'EMS Administrator'
    };

    return of(response).pipe(
      delay(700)
    );
  }

  saveSession(
    response: AuthResponse
  ): void {

    localStorage.setItem(
      this.tokenKey,
      response.accessToken
    );

    localStorage.setItem(
      this.userNameKey,
      response.userName
    );

    this.token.set(response.accessToken);

    this.userName.set(response.userName);
  }

  getToken(): string | null {
    return this.token();
  }

  logout(): void {

    localStorage.removeItem(
      this.tokenKey
    );

    localStorage.removeItem(
      this.userNameKey
    );

    this.token.set(null);

    this.userName.set('');
  }
}